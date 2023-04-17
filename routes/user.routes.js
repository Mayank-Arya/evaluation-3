const express = require('express')
const {userModel} = require("../models/user.model")
const {blacklistModel} = require('../models/blacklist.model')
require('dotenv').config()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const userRouter =express.Router()


userRouter.get("/",(req,res)=>{
    res.send("This Is User Router")
})

userRouter.post("/register",async(req,res)=>{
    try{
  const {name,email,password,role} = req.body
  const isUserPresent = await userModel.findOne({email})
  if(isUserPresent) return res.send({msg:"User Already Present, Please Login"})
  const hash = await bcrypt.hash(password,5)
  const newUser = new userModel({name,email,password:hash,role})
  await newUser.save()
  res.status(200).send({msg:"New User Has Been Registered"})
    }
    catch(err){
  res.status(400).send({msg:err.message})
    }
})


userRouter.post("/login",async(req,res)=>{
    try{
    const {email,password} = req.body
    if(!email || !password) return res.status(400).send({msg:"Wrong Credentials"})
    const isUserPresent = await userModel.findOne({email})
    if(isUserPresent){
       bcrypt.compare(password,isUserPresent.password,(err,result)=>{
       if(result){
        const token = jwt.sign({email,userId:isUserPresent._id,role:isUserPresent.role},process.env.key,{expiresIn:100})
        const refreshtoken = jwt.sign({email,userId:isUserPresent._id},process.env.refreshkey,{expiresIn:60*3})
        res.status(200).send({msg:"Login Successful",token,refreshtoken})
       }else{
        res.status(400).send({msg:"Wrong credentials"})
       }
       })
       
    }else{
        res.status(400).send({msg:"User not present"})
    }
    }
    catch(err){
res.status(400).send({msg:err.message})
    }
})

userRouter.get("/getnewtoken",async(req,res)=>{
    const refreshtoken = req.headers.authorization
    try{
     if(!refreshtoken) return res.status(400).send({msg:"Please login"})
     jwt.verify(refreshtoken,process.env.refreshkey,(err,result)=>{
        if(err) return res.status(400).send({msg:"Please login"})
        const token = jwt.sign(
            {userId:result.userId,email:result.email},
            process.env.key,
            {expiresIn:60*3}
        )
        res.status(200).send({msg:"Got the token",token})
     })
     
    }
    catch(err){
        res.status(400).send({msg:err.message})
    }
})


userRouter.post("/logout",async (req,res)=>{
    try{
        const token = req.headers.authorization
        const blacklistedtoken = new blacklistModel({token})
        await blacklistedtoken.save()
        res.status(200).send({msg:"Logout Successfull"})
    }
    catch(err){
res.status(400).send({msg:err.message})
    }
})


module.exports = {
    userRouter
}