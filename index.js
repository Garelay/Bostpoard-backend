import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import postRoutes from "./routes/posts.js"
import userRoutes from "./routes/users.js"

const app = express()
app.use(cors())
dotenv.config()

app.use(express.json({limit: "30mb", extended: true}))
app.use(express.urlencoded({limit: "30mb", extended: true}))

app.use("/posts", postRoutes)
app.use("/user", userRoutes)

const CONNECTION_URL = process.env.CONNECTION_URL
const PORT = process.env.PORT || 5000

mongoose.connect(CONNECTION_URL)
    .then (()=>app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`)))
    .catch((error) => console.log(error.massage))

