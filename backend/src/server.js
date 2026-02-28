//const express = require("express");
import express from "express";
import dotenv from "dotenv";
import authroutes from "./routes/auth.route.js";


const app= express();
dotenv.config();
const PORT =process.env.PORT

app.use("/api/auth",authroutes);

app.listen(PORT,()=>console.log("Server running on port 3000"));

