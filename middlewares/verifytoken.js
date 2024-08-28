const jwt = require('jsonwebtoken');
const userModel = require('../modelse/user');

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        try {
            const accessTokenPayload = jwt.verify(token, process.env.ACCESS_TOKEN);
            
            
            const user = await userModel.findById(accessTokenPayload.id).lean();
            if (!user) {
                return res.status(404).json({ message: "User Not Found" });
              }
            //   Reflect.deleteProperty(user, "password");

            req.user = user
            // console.log('req.user',req.user);
            
            next();
        } catch (err) {
            return res.status(401).json({ message: 'توکن منقضی شده است' });
        }
    } else {
        return res.status(403).json({ message: 'شما به API دسترسی ندارید' });
    }
};

module.exports = verifyToken;
