routes 폴더 사용법

models의 userInfo 파일과 연계됩니다. 

1. 아래의 줄들을 포함시켜주세요.
const {파일명} = require('../models/파일명');
const express = require('express');
const { json } = require('express/lib/response');
const router = express.Router();

// 이 사이에는 개발하신 메소드 적어주시면 됩니다!

2. 제일 마지막 줄에 module.exports = router 를 작성해주세요.
