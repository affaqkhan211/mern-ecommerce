import express from "express";
const app = express();
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import Connection from "./db/conn.js"
import cors from "cors"

import productRouter from "./routes/productRoutes.js"
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRoutes.js";

app.use(cors({
    credentials : true
}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
 });
app.use(express.json())
app.use(cookieParser());
dotenv.config();

Connection();

//routes

app.use("/api/v1/products",productRouter)
app.use("/api/v1/users", userRouter)
app.use("/api/v1/orders", orderRouter)

app.listen(process.env.PORT,()=>{
    console.log(`listening on port ${process.env.PORT}`);
})