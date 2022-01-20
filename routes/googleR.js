const {googleUsers} = require('../models/googleUsers');
const mongoose = require("mongoose");
const express = require('express');
const { json } = require('express/lib/response');
const router = express.Router();
const cookieParser=require('cookie-parser');
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;


router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(user, done) {
done(null, user);
});


router.get('/',(req,res)=>{
const temp = getPage('Welcome', 'Welcome to visit...',getBtn(req.user));
  res.send(temp);
});

//로그인 or 로그아웃 상태에 따른 버튼 생성
const getBtn = (user) =>{
  return user !== undefined ? `${user.name} | <a href="/auth/logout">logout</a>` : `<a href="/auth/google">Google Login</a>`;
}

//페이지 생성 함수
const getPage = (title, description,auth)=>{
return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
      </head>
      <body>
          ${auth}
          <h1>${title}</h1>
          <p>${description}</p>
      </body>
      </html>
      `;
}




passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: process.env.REDIRECT_URL
},
async(accessToken, refreshToken, profile, done)=>{
    console.log(profile);
    let user = await googleUsers.findOne({providerId: profile.id});
    console.log(user);
    if(!user){
        console.log("ELSE");
        const email = profile.emails[0].value
        const name = profile.displayName
        const provider = profile.provider
        const token = accessToken
        const providerId = profile.id
        user = new googleUsers({
        email,
        name,
        provider,
        token,
        providerId});
        console.log("before save");
        user.save();
        console.log("save");
    } 
    console.log(user.name);
    return done(null, user);
}))



//구글 로그인 버튼 클릭시 구글 페이지로 이동하는 역할
router.get('/google',
  passport.authenticate('google', { scope: ['email','profile'] }),
  function(req, res) {
    console.log('google done');
  }
  );



//구글 로그인 후 자신의 웹사이트로 돌아오게될 주소 (콜백 url)
router.get('/google/callback', 
passport.authenticate('google', { failureRedirect: '/auth', successRedirect: '/auth' }));

//로그아웃 페이지 : 로그 아웃 처리 + 세션 삭제 + 쿠키 삭제 후 홈으로 리다이렉션
//passport 패키지로 인해 req.logout()으로 로그아웃 기능 구현 가능
router.get('/logout',async(req,res)=>{
  req.session.destroy((err)=>{
      if(err) next(err);
      req.logOut();
      res.cookie(`connect.sid`,``,{maxAge:0});
      res.redirect('/auth');
  });
});


module.exports = router;