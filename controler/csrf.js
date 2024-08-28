exports.csrf=async(req,res)=>{
    // res.json({csrfToken:req.csrfToken()})
    // res.cookie('XSRF-TOKEN', req.csrfToken())
    res.cookie('XSRF-TOKEN', req.csrfToken());
    
    // دومین خط: ارسال پاسخ JSON
    res.json({ csrfToken: req.csrfToken() });
}