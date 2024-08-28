const nodemailer=require('nodemailer')

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mohammadyosefi8172@gmail.com',
        pass: 'gjyl hyat puab lfnj'
    },

})

module.exports=transporter
