const {users} = require('../models/users');
const mongoose = require("mongoose");
const express = require('express');
const { json } = require('express/lib/response');
const router = express.Router();
const bycrypt = require("bcryptjs");
const cookieParser=require('cookie-parser');
const { restart } = require('nodemon');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

//회원 가입 
router.post('/',async(req,res)=>{
    const {email,userId,password,nickname} = req.body;

    try{
        let user = await users.findOne({email});

        if(user){
            return res.status(400).json({message:"User Already Exists"});
        }

        user = new users({
            email,
            userId,
            password,
            nickname,
        });

        // 비밀번호 암호화
        const encrypted = await bycrypt.genSalt(10);
        user.password = await bycrypt.hash(password,encrypted);

        var transport = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.send_email,
                pass:process.env.send_pass,
            }
        });

        var mailOption={
            from:"tokku.back.test@gmail.com",
            to:user.email,
            subject:"이메일 인증 테스트",
            text:" 이메일 인증 테스트 메일입니다."
        };

        transport.sendMail(mailOption, (err, res) => {
            if (err) {
                console.log("error occured");
            } else {
                console.log("Successful");
            }
            
            
        })
        transport.close();

        await user.save();
        
        return res.status(200).send(user);

    }catch(error){
        console.log(error.message);
        return res.status(500).json({message:"Failed"});
    }
})

//로그인 - id, password 일치하는지만 확인  로그인ok
router.post('/login/:userId', async (req,res)=>{
    let user = await users.findOne({userId:req.body.userId});

    if(!user){
        return res.json({
            loginSuccess:false,
            message:"해당 아이디가 존재하지 않습니다.",
        })
    }

    user.comparePassword(req.body.password, (err, isMatch) =>{	
        if(!isMatch)	
            return res.json({	
              loginSuccess:false,	
              message:"비밀번호가 틀렸습니다."	
            })
        user.generateToken((err,user) => {	
            if(err) return res.status(400).send(err);	
                // 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지	
            else return res.cookie("x_auth", user.token)	
            .status(200)	
            .json({loginSuccess: true, userId: user.userId})	
            })		
      })
})

//아이디 찾기 -> 이메일로 아이디 보내주기
router.post('/find-id',async(req,res)=>{
    let user = await users.findOne({email:req.body.email});

    if(!user){
        return res.json({
            message:"등록된 이메일이 존재하지 않습니다.",
        })
    }

    var transport = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.send_email,
            pass:process.env.send_pass,
        }
    });

    var mailOption={
        from:"tokku.back.test@gmail.com",
        to:user.email,
        subject:"[TOKKU] 아이디를 보내드립니다.",
        text:`회원님의 아이디는 ${user.userId} 입니다`,
    };

    transport.sendMail(mailOption, (err, res) => {
        if (err) {
            console.log("error occured");
        } else {
            console.log("Successful");
        }
    })
    transport.close();

    res.status(200).json({
        message:"메일을 성공적으로 보냈습니다.",
    })
})

//비밀번호 찾기 -> 이메일로 임시 비밀번호 -> 비밀번호 변경
router.put('/find-pw/:userId',async(req,res)=>{
    const user = await users.findOne({userId:req.params.userId});

    var random = Math.random().toString(36).slice(2);

    var transport = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.send_email,
            pass:process.env.send_pass,
        }
    });

    var mailOption={
        from:"tokku.back.test@gmail.com",
        to:user.email,
        subject:"[TOKKU] 임시 비밀번호를 보내드립니다.",
        text:`회원님의 임시 비밀번호는 ${random} 입니다`,
    };

    transport.sendMail(mailOption, (err, res) => {
        if (err) {
            console.log("error occured");
        } else {
            console.log("Successful");
        }
    })
    transport.close();

    const encrypted = await bycrypt.genSalt(10);
    user.password= await bycrypt.hash(random,encrypted); 
    
    await users.findOneAndUpdate(
        user,
        {
            email:user.email,
            userId:user.userId,
            password:user.password,
            nickname:user.nickname,
        },
        {
            new:true,
        }
    )
    
    if(!user){
        return res.status(400).send('아이디를 찾을 수 없습니다!');
    }
    res.send(user);
})

//회원삭제
router.delete('/delete/:userId',async(req,res)=>{
    users.findOneAndRemove(req.params.userId).then(user=>{
        if(user){
            return res.status(200).json({success: true, message:"deleted"});
        }else{
            return res.status(404).json({
                success:false,
                message:"error occured"
            });
        }
    }).catch(err=>{
        return res.status(400).json({success:false,error:err})
    })
})

// 전체회원 조회
router.get('/',async (req,res)=>{
    const userInfo = await users.find();

    if(!userInfo){
        res.send(500).json({message:"Failed"});
    }
    res.status(200).send(userInfo);
})

module.exports = router;
