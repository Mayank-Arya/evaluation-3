const express = require("express")
const {blogModel} = require('../models/blog.model')
const {authorize} = require('../middleware/authorize')
const blogRouter = express.Router()


blogRouter.get("/",authorize(["User"]),(req,res)=>{
    res.send({msg:"Blog Router"})
})

blogRouter.post("/addblog",authorize(["User"]),async(req,res)=>{
    const blog = req.body
    try{
    const newblog = new blogModel(blog)
    await newblog.save()
    res.status(200).send({msg:"New Blog Added"})
    }
    catch(err){
    res.status(400).send({msg:err.message})
    }
})

blogRouter.patch('/update/:id',authorize(["User","Moderator"]),async(req,res)=>{
    const id = req.params.id
    const updateData = req.body
    try{
        const deleteblog = await blogModel.findByIdAndUpdate({_id:id,updateData})
        res.status(200).send({msg:"Blog Deleted"})
    }catch(err){
        res.status(400).send({msg:err.message})
    }
})

blogRouter.delete("/deleteblog/:id",authorize(["Moderator"]),async(req,res)=>{
   const id = req.params.id
   try{
    const deleteBlog = await blogModel.findByIdAndDelete({id})
    res.status(200).send({msg:"Blog Deleted"})
   }
   catch(err){
    res.status(400).send({msg:err.message})
   }
})

module.exports = {
    blogRouter
}