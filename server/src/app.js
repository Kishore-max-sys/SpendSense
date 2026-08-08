require("dotenv").config();
const express=require("express");
const cors=require("cors");

const authRouter=require("./routes/authRouter");
const categoryRouter=require("./routes/categoryRouter");
const transactionRouter=require("./routes/transactionsRouter");
const dashboardRouter=require("./routes/dashboardRouter");
const userRouter=require("./routes/userRouter");

const {
    errorHandler
}=require("./middlewares/errorHandler");
const {
    authMiddleware
}=require("./middlewares/authMiddleware");

const app=express();
app.use(cors());
app.use(express.json());

app.use("/api/auth",authRouter);
app.use("/api/users",authMiddleware,userRouter);
app.use("/api/categories",authMiddleware,categoryRouter);
app.use("/api/transactions",authMiddleware,transactionRouter);
app.use("/api/dashboard",authMiddleware,dashboardRouter);

app.use(errorHandler);

app.listen(process.env.PORT||5000,"0.0.0.0",()=>{
    console.log(`Server is running on the port ${process.env.PORT}`);
});