const express =require('express');
const database = require('./config/database');
const bodyParser = require('body-parser');
const categoryRouter=require('./router/category')
const productRouter=require('./router/product')
const userRouter=require('./router/user');
const authenticate = require('./middleware/authenticate');
const app =express();

app.use(bodyParser.json())
app.use(authenticate)
app.use('/api/v1/',categoryRouter)
app.use('/api/v1/',productRouter)
app.use('/api/v1/',userRouter)

database.sync().then(()=>
    app.listen(8080,()=>{
        console.log("App is running on port 8080"); 
    })
).catch(()=>{
    console.log("can not connect to database!");
    
})
