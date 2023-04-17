const jwt = require('jsonwebtoken')
require('dotenv').config()
const {blacklistModel} = require("../models/blacklist.model")

const {userModel} = require('../models/user.model')

const authenticate = async(req,res,next)=>{
    try{
     const token = req.headers.authorization
     const isBlacklisted = await blacklistModel.find({token})
     if(isBlacklisted.length>0){
        return res.send({msg:"Please login again,token expired"})
     }
     const decoded = await jwt.verify(token,process.env.key)
    if(!decoded){
        res.status(400).send({msg:"Not Decoded"})
    }else{
//    req.body.userId = decoded.userId;
//    req.body.email = decoded.email;
//    req.body.role = decoded.role
    const id = decoded.userId
    const user = await userModel.findById(id)
    const role = user.role
    const userId = user._id
    req.user = userId
    req.role = role
    }

     
     next()
    }
    catch(err){
     res.status(400).send({msg:err.message,problem:"Don't know"})
    }
}

module.exports = {
    authenticate
}