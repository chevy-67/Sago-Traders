const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    phone:{
        type:String,
        required:true,
        unique:true
    },
    role:{
        type:String,
        default:"customer"
    }
},{timestamps:true})

module.exports=mongoose.model('User',userSchema)