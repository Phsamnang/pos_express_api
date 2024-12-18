const express =require('express');
const database = require('./config/database');
const bodyParser = require('body-parser');
const categoryRouter=require('./router/category')
const productRouter=require('./router/product')
const userRouter=require('./router/user');
const tableRouter=require('./router/table')
const saleRouter=require('./router/sale')
const cors=require('cors')
const authenticate = require('./middleware/authenticate');

const app =express();

const allowAllOrigins = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');   
  
    next();
  };

app.use(cors({allowAllOrigins}))
app.use(bodyParser.json())
app.use(authenticate)
app.use('/api/v1',categoryRouter)
app.use('/api/v1',productRouter)
app.use('/api/v1',userRouter)
app.use('/api/v1',tableRouter)
app.use('/api/v1',saleRouter)

database.sync().then(()=>
    app.listen(8080,()=>{
        console.log("App is running on port 8080"); 
    })
).catch(()=>{
    console.log("can not connect to database!");
    
})
