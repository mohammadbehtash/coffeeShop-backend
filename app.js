const express=require('express')
const cors=require('cors')
const path=require('path')
const cookieParser=require('cookie-parser')
// const csrf = require('csurf');

const authRouter=require('./routers/auth')
const userRouter=require('./routers/user')
const categoryRouter=require('./routers/category')
const productRouter=require('./routers/product')
const menuRouter=require('./routers/menu')
const articleRouter=require('./routers/article')
const searchRouter=require('./routers/search')
const offRouter=require('./routers/off')
const contactRouter=require('./routers/contact-us')
const infotRouter=require('./routers/infose')
const commentRouter=require('./routers/comment')
// const csrfRouter=require('./routers/csrf')

const app=express()
// const csrfProtection=csrf({cookie:true})
app.use(cookieParser("dhdjhk7nf5gkjd4fawd1g"))
app.use('/img',express.static(path.join(__dirname,'public','img')))
app.use(cors({ credentials: true, origin: 'http://localhost:4200' }))
// { origin: 'http://localhost:4200',
//     credentials: true,
//     allowedHeaders: ['Content-Type', 'X-CSRF-TOKEN']}
app.use(express.json())
app.use(express.urlencoded({extended:true}))
// app.use(csrfProtection)

app.use('/auth',authRouter)
app.use('/users',userRouter)
app.use('/category',categoryRouter)
app.use('/product',productRouter)
app.use('/menus',menuRouter)
app.use('/articles',articleRouter)
app.use('/search',searchRouter)
app.use('/off',offRouter)
app.use('/contact-us',contactRouter)
app.use('/info',infotRouter)
app.use('/comment',commentRouter)
// app.use('/csrf',csrfRouter)



app.use((req,res)=>{
    console.log("this path is not available:",req.path);
    res.status(404).json({message:"404 OOPS! PATH NOT FOUND" })
})

app.use((err,req,res,next)=>{
    return res.json({
        statusCode:err.status || 500,
        msg:err.message || 'server Error'
    })
})


module.exports=app