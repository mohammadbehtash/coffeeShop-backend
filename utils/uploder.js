const path=require('path')
const multer=require('multer')
const crypto=require('crypto')

module.exports=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,'..','public','img'))
    },
    filename:(req,file,cb)=>{
        const hashedFilename=crypto.createHash('SHA256').update(file.originalname).digest('hex')
        const ext=path.extname(file.originalname)
        cb(null,hashedFilename+ext)
    }
})