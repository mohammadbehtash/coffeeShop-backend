const contactModule = require('../modelse/contact-us')
const nodemailer = require('nodemailer')
const transporter=require('../sendEmail/transporter')
const { default: mongoose } = require('mongoose')

exports.getAll = async (req, res, next) => {
    try {

        const contact = await contactModule.find({}).lean()
        return res.json(contact)

    } catch (err) {
        next(err)
    }
}

exports.create = async (req, res, next) => {
    try {
        const { name, email, phone, body } = req.body
        const { error } = contactModule.createValidation(req.body)
        if (error) {
            return res.status(400).json({ error: error.details })
        }

        const contact = await contactModule.create({
            name, email, phone, body,
            answer: 0
        })
        return res.status(201).json(contact)
    } catch (err) {
        next(err)
    }
}

exports.remove = async (req, res, next) => {
    try {
        const { error } = contactModule.removeValidation(req.params)
        if (error) {
            return res.status(400).json({ error: error.details })
        }
        const { id } = req.params
        // console.log(id);
        
        const isValidID = mongoose.Types.ObjectId.isValid(id)
        if (!isValidID) {
            return res.status(406).json({ message: "session Id is not valid" })
        }


        const removecontact = await contactModule.findOneAndDelete({ _id: id })

        return res.json(removecontact)

    } catch (err) {
        next(err)
    }
}

exports.answer = async (req, res, next) => {
    try {
        const { error } = contactModule.answerValidation(req.body)
        if (error) {
            return res.status(400).json({ error: error.details })
        }
        const { email, answer } = req.body

        const mailOptions={
            from: 'mohammadyosefi8172@gmail.com',
            to: email,
            subject: 'پاسخ شما',
            text: answer
        }
        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {

                return res.json({ message: 'errore' })
            } else {
                const contact = await contactModule.findOneAndUpdate({ email }, { answer: 1 })
                return res.json({ message: 'email sent OK' })
            }
        })
    } catch (err) {
        next(err)
    }
}
