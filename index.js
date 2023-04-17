const express = require("express")
require("dotenv").config()
const {authenticate} = require('./middleware/authentication')
const {userRouter} = require('./routes/user.routes')
const {blogRouter} = require('./routes/blog.routes')
const {connection} = require("./db")
const app = express()

app.use(express.json())

app.get("/",(req,res)=>{
    res.send("Home Page")
})

app.use("/users",userRouter)
app.use(authenticate)
app.use("/blogs",blogRouter)

app.listen(process.env.port,async()=>{
    await connection
    console.log(`Running at ${process.env.port} !!!`)
})