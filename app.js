const express =require('express');
const database = require('./config/database');
const bodyParser = require('body-parser');
const categoryRouter=require('./router/category')
const productRouter=require('./router/product')
const userRouter=require('./router/user');
const tableRouter=require('./router/table')
const saleRouter=require('./router/sale')
const loanRouter=require('./router/laon')
const menuRouter=require('./router/menu')
const imageRouter = require("./router/image");
const chefRouter = require('./router/chef');
const cors=require('cors')
const authenticate = require('./middleware/authenticate');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require("swagger-ui-express");

const app =express();

const allowAllOrigins = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');   
  
    next();
  };

// Swagger Configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0', // or '2.0' for Swagger 2.0
        info: {
            title: 'POS API EXPRESS',
            version: '1.0.0',
            description: 'API documentation for your Express.js app',
        },
    },
    apis: ['./routes/*.js', './router/*.js'], // Paths to your route files (important!)
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); 

app.use(cors({allowAllOrigins}))
app.use(bodyParser.json())
app.use(authenticate)
app.use('/api/v1',categoryRouter)
app.use('/api/v1',productRouter)
app.use('/api/v1',userRouter)
app.use('/api/v1',tableRouter)
app.use('/api/v1',saleRouter)
app.use("/api/v1", loanRouter);
app.use("/api/v1", menuRouter);
app.use("/api/v1", imageRouter);
app.use('/api/v1', chefRouter);

database
  .sync() // Use { alter: true } to update the schema without dropping tables
  .then(() =>
    app.listen(8080, () => {
      console.log("App is running on port 8080");
    })
  )
  .catch(() => {
    console.log("can not connect to database!");
    process.exit(1);
  });

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "An unexpected error occurred!",
  });
});
