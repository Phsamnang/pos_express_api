const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const database = require("./config/database");
const bodyParser = require("body-parser");
const categoryRouter = require("./router/category");
const productRouter = require("./router/product");
const userRouter = require("./router/user");
const tableRouter = require("./router/table");
const saleRouter = require("./router/sale");
const loanRouter = require("./router/laon");
const menuRouter = require("./router/menu");
const imageRouter = require("./router/image");
const chefRouter = require("./router/chef");
const deliveryRouter = require("./router/delivery");
const importRouter = require("./router/import");
const cors = require("cors");
const authenticate = require("./middleware/authenticate");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

const { User, Menus, Sale, SaleItem, Table } = require("./models");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

app.set("io", io);

app.use(cors());

app.use(bodyParser.json());

app.use(authenticate);

app.use("/api/v1", categoryRouter);
app.use("/api/v1", productRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", tableRouter);
app.use("/api/v1", saleRouter);
app.use("/api/v1", loanRouter);
app.use("/api/v1", menuRouter);
app.use("/api/v1", imageRouter);
app.use("/api/v1", chefRouter);
app.use("/api/v1", deliveryRouter);
app.use("/api/v1", importRouter);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "POS API EXPRESS",
      version: "1.0.0",
      description: "API documentation for your Express.js app",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 8080}/api/v1`,
        description: "Local server",
      },
    ],
  },
  apis: ["./router/*.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

io.on("connection", (socket) => {
  console.log("A user connected via WebSocket:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected via WebSocket:", socket.id);
  });
});

database
  .sync()
  .then(() => {
    const PORT = process.env.PORT || 8080;
    server.listen(PORT, () => {
      console.log(`App is running on port ${PORT}`);
      console.log(
        `Swagger docs available at http://localhost:${PORT}/api-docs`
      );
      console.log(`WebSocket server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database or sync models:", err);
    process.exit(1);
  });

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "An unexpected error occurred!",
  });
});
module.exports = app;