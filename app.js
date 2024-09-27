const express =require('express');
const database = require('./config/database');
const bodyParser = require('body-parser');
const categoryRouter=require('./router/category')
const productRouter=require('./router/product')
const app =express();

app.use(bodyParser.json())

app.use('/api/v1/',categoryRouter)
app.use('/api/v1/',productRouter)

database.sync().then(()=>
    app.listen(8080,()=>{
        console.log("App is running on port 8080");
        
    })
).catch(()=>{
    console.log("can not connect to database!");
    
})
