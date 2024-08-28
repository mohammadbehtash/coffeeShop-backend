const userModel = require('../modelse/user')
const bcrypt = require('bcrypt')
const { generateAccessToken, generateRefreshToken } = require('../utils/auth')
const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const transporter = require('../sendEmail/transporter')

// exports.register = async (req, res, next) => {
//     try {

//         const { error } = userModel.registerValidation(req.body)
//         if (error) {
//             return res.status(400).json({ error: error.details });
//         }

//         const {
//             username,
//             name,
//             email,
//             password,
//             phone,
//         } = req.body
//         const isUserExists = await userModel.findOne({
//             $or: [{ username }, { email }]
//         })
//         if (isUserExists) {
//             return res.status(409).json({ message: 'username or email is duplicated' })
//         }


//         const countOfUser = await userModel.countDocuments()
//         const hashPassword = await bcrypt.hash(password, 12)
//         const user = await userModel.create({
//             email,
//             username,
//             name,
//             phone,
//             password: hashPassword,
//             role: countOfUser > 0 ? "USER" : "ADMIN",
//             cart: { item: [] },

//         })
//         const rfreshToken=generateRefreshToken(user._id)
//         user.refreshToken=rfreshToken
//         await user.save()
//         const userObject = user.toObject()
//         Reflect.deleteProperty(userObject, 'password')
//         const accessToken = generateAccessToken(user._id)
//         const refreshToken = generateRefreshToken(user._id)

//         res.cookie('access-token', accessToken, { httpOnly: true })
//         res.cookie('refresh-token', refreshToken, { httpOnly: true })

//         return res.json({ message: 'user registered OK' })
//     } catch (err) {
//         next(err);

//     }
// }

exports.login = async (req, res, next) => {
    try {

        const { error } = userModel.loginvalidation(req.body)
        if (error) return res.status(400).json({ error: error.details })

        const { identifier, password } = req.body
        const user = await userModel.findOne({
            $or: [{ email: identifier }, { username: identifier }]
        })
        if (!user) {
            return res.status(401).json({ message: 'Ther is user with this email or username' })
        }
        const isPasswordvalid = await bcrypt.compare(password, user.password)
        if (!isPasswordvalid) {
            return res.status(401).json({ message: 'password is not valid' })
        }
        const accessToken = generateAccessToken(user._id)
        const refreshToken = generateRefreshToken(user._id)

        user.refreshToken = refreshToken
        await user.save()

        const cookieOptions = {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
            sameSite: 'lax'
        };



        res.cookie('access-token', accessToken, cookieOptions)
        res.cookie('refresh-token', refreshToken, cookieOptions)

        return res.json({ message: 'user Login OK' })
    } catch (err) {
        next(err)
    }
}

exports.logout = async (req, res, next) => {
    try {
        const cookieOptions = {
            httpOnly: true,
            expires: new Date(0),
            sameSite: 'lax'
        };

        // حذف کوکی‌های access-token و refresh-token
        res.cookie('access-token', '', cookieOptions);
        res.cookie('refresh-token', '', cookieOptions);

        return res.json({ message: 'User logged out successfully' });
    } catch (err) {
        next(err);
    }
};

exports.refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies['refresh-token']
        if (!refreshToken) {
            return res.status(401).json({ ms: 'no have refresh token' })
        }

        const user = await userModel.findOne({ refreshToken })
        if (!user) {
            return res.status(404).json({ ms: 'user not found' })
        }
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN)
        // console.log(jwt.verify(refreshToken,process.env.REFRESH_TOKEN));
        const newAccessToken = generateAccessToken(user._id)
        const cookieOptions = {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 1000,
            sameSite: 'lax'
        };
        res.cookie('access-token', newAccessToken, cookieOptions)

        res.status(200).json({ accessToken: newAccessToken })
    } catch (err) {

        return res.status(403).json({ ms: 'refreshToken End' })
    }

}

exports.getMe = async (req, res, next) => {
    try {
        const user = await userModel.find(req.user._id)
        res.json(user)
    } catch (err) {
        next(err)
    }
}

exports.getCookie = async (req, res, next) => {
    try {
        const accessToken = req.cookies['access-token']
        if (req.cookies['access-token']) {
            return res.json(accessToken)
        } else {
            return res.status(401).json({ ms: 'no have access token' })
        }
    } catch (err) {
        next(err)
    }
}

exports.validEmail = async (req, res, next) => {
    try {
        const { error } = userModel.uemailValidation(req.body)
        if (error) {
            return res.status(400).json({ error: error.details });
        }

        const { email } = req.body;

        // Check if email already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        // Generate verification code
        const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();

        // Send verification code to user's email
        const mailOptions = {
            from: 'mohammadyosefi8172@gmail.com',
            to: email,
            subject: 'Email Verification',
            text: `Your verification code is: ${verificationCode}`
        };

        transporter.sendMail(mailOptions, async (err, info) => {
            if (err) {
                return res.status(500).json({ message: 'Error sending verification email' });
            }

            // Store the code temporarily in the database (or in memory)
            await userModel.updateOne(
                { email },
                { verificationCode, isVerified: false },
                { upsert: true }
            );
            res.cookie('userEmail', email, { httpOnly: true, secure: true })
            res.json({ message: 'Verification code sent' });
        });
    } catch (err) {
        next(err);
    }
}

exports.verifycode = async (req, res, next) => {
    try {
        // 
        const { verificationCode } = req.body;
        const email = req.cookies.userEmail;

        // Find the user by email and verification code
        const user = await userModel.findOne({ email, verificationCode });
        if (!user) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }
        res.cookie('veryfiCode', 'true', {
            httpOnly: true,
            maxAge: 30000,
            secure: true,
            signed: true
        })
        res.cookie('userId', user._id, { httpOnly: true, secure: true })
        console.log(user);

        return res.json({ message: 'code valid successfully', user: user.toObject() });
    } catch (err) {
        next(err);
    }
}

exports.registe = async (req, res, next) => {
    try {
        const { error } = userModel.registerValidation(req.body)
        if (error) {
            return res.status(400).json({ error: error.details });
        }

        const veryfiCode = req.signedCookies.veryfiCode
        //    console.log(veryfiCode);

        if (veryfiCode) {
            const userid = req.cookies.userId;
            const user = await userModel.findById(userid)

            const { username, name, phone, password } = req.body;

            const hashPassword = await bcrypt.hash(password, 12);
            const countOfUser = await userModel.countDocuments()
            const rfreshToken = generateRefreshToken(user._id)

            user.username = username;
            user.name = name;
            user.phone = phone;
            user.password = hashPassword;
            user.isVerified = true;
            user.verificationCode = undefined; // حذف کد تایید
            user.role = countOfUser == 1 ? "ADMIN" : "USER",
                // user.cart= { item: [] },
                user.refreshToken = rfreshToken

            await user.save();

            const userObject = user.toObject()
            Reflect.deleteProperty(userObject, 'password')
            const accessToken = generateAccessToken(user._id)
            const refreshToken = generateRefreshToken(user._id)

            const cookieOptions = {
                httpOnly: true,
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                sameSite: 'lax'
            };
            res.cookie('access-token', accessToken, cookieOptions)
            res.cookie('refresh-token', refreshToken, cookieOptions)


            res.clearCookie('userEmail');
            res.clearCookie('verifyCode');
            res.clearCookie('userId');

            return res.json({ message: 'user registered OK' })
        } else {
            return res.json({ message: 'code is not valid' })
        }


    } catch (err) {
        next(err)
    }

}

exports.updatedUserByAdmin=async(req,res,next)=>{
    try{

    const{id,name,username,email,phone,password}=req.body
    
    const user=await userModel.findById(id)
    if(!user){
        return res.status(404).json({message:'userNotFound'})
    }
    if(user)user.name=name
    if(user)user.username=username
    if(user)user.email=email
    if(user)user.phone=phone
    if(password){
        const newpassword=await bcrypt.hash(password,12)
        user.password=newpassword
    }
    await user.save()

    return res.json({ message: 'User updated successfully', user });
    }catch(err){
        next(err)
    }
   

}




