module.exports=async(req,res,next)=>{
    const isAdmon=req.user.role==='ADMIN'
    if(isAdmon){
        return next()
    }
    return res.status(403).json({
        message:"This route is accessible only for admins !!"
    })
}