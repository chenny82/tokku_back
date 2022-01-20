const mongoose = require('mongoose') 

const googleSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    name:{
        type:String,
    },
    provider:{
        type:String,
    },
    token:{
        type:String,
    },
    providerId:{
        type:String,
    },
})


exports.googleUsers = mongoose.model('googleUsers',googleSchema);