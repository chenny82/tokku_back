const mongoose = require('mongoose') 

const tabSchma = mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    name:{
        type:String,
        reqired:true,
        unique:true,
    },
    contents: [mongoose.Schema.Types.Mixed],
})

exports.googleUsers = mongoose.model('tabs',tabSchema);