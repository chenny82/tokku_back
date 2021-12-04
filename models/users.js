const bcrypt = require('bcryptjs/dist/bcrypt');
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose') 

const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    userId:{
        type:String,
        required:true,
        unique:true,
    },
    password : {
        type:String,
        required:true,
    },
    nickname :{
        type: String,
        required:true,
    },
});

userSchema.methods.comparePassword = function(plainPassword,cb){
    bcrypt.compare(plainPassword,this.password,function(err,isMatch){
        if(err) return cb(err);
        cb(null,isMatch);
    })
};

userSchema.methods.generateToken = function(cb) {	
    const user = this;	
    // jsonwebtoken을 이용해서 토큰 생성하기	
    const token = jwt.sign(user.email.toString(), 'scertToken'); 	
    
    	
    user.token = token;
  user.save(function(err, user) {
    if(err) return cb(err);
    cb(null, user)	
  }); 
}	

exports.users = mongoose.model('users',userSchema );