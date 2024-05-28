const mongoose = require('mongoose')
const Schema = mongoose.Schema
const passportLocalMongoose = require('passport-local-mongoose')


const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true
    }
})
userSchema.plugin(passportLocalMongoose)
/* This is going to add on a field for username and password this is going to take care that username is uinque 
and it is also going to give us some additional methods we can use */

module.exports = mongoose.model("User",userSchema)