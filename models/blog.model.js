const mongoose = require("mongoose")

const blogSchema = mongoose.Schema({
    title:{type:String,required:true},
    body:{type:String,required:true},
    author:{type:String,required:true},
    user:{type:String}
})

const blogModel = mongoose.model("blog",blogSchema)

module.exports = {
    blogModel
}