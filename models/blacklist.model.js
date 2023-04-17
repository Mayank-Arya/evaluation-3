const mongoose = require('mongoose')

const blacklist = mongoose.Schema({
    token:{type:String,required:true}
})

const blacklistModel = mongoose.model('blacklist',blacklist)

module.exports = {
    blacklistModel
}