const app=require('./app')
const mongoose=require('mongoose')
require('dotenv').config()
const port=process.env.PORT;
console.log();
(async()=>{
    await mongoose.connect('mongodb://localhost/coffee')
    console.log('mongoodb connect');
})()

app.listen(port,()=>{
    console.log('server runing on port'+port);
    
})