models에는 json 형식지정, routes에는 method를 작성하시면 됩니다.
models에 userInfo라고 쓰셨으면, routes에서는 userInfoR 이렇게 비슷하게 작성해주시면
나중에 보기 편할 것 같습니다!

models 폴더 사용법

1. const mongoose = require('mongoose') 를 추가해주세요.
2. database에 넣을 json 형식을 지정해준다고 생각하시면 됩니다.

예를 들어, 사용자 아이디, 비밀번호, 닉네임을 받을 것이다! 라고 가정한다면

const userInfoSchema = mongoose.Schema({
    userId:{
        type:String,
        required:true,
    },

    userPW:{
        type:String,
        required:true,
    },

    userNickname:{
        type:String,
        required:true,
    }
});

// 예를 들어 이 파일은 userInfo를 받을 것이니까, 파일명을 userInfo로 해주시면 좋겠죠?
exports.파일명 = mongoose.model('파일명',userInfoSchema);
