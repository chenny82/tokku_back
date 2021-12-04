1. app.js 파일에 대한 설명 

const express = require("express");
const app = express();
// 파일 실행시 api가 작동이 잘되면 console창에 기록을 남겨줌
const morgan = require("morgan");
const mongoose = require("mongoose");

require("dotenv/config");

// /tokku를 기본으로 설정한 것
const api = process.env.API_URL;

//https://expressjs.com/en/resources/middleware/cors.html 
app.use(cors());
app.options('*',cors);

//middleware
app.use(express.json());
app.use(morgan('tiny'));


//Routes
routes 폴더에 만든 메소드를 app.js에 연결시키는 부분입니다.
const userInfoRoutes = require("./routes/userInfoR");
-> 이런식으로 연결해주시면 되고

app.use(`${api}/원하는 주소 설정`, userInfoRoutes);
이것까지 설정해주시면 됩니다!


//Database 연결
mongoose.connect(process.env.DB_STRING,{
    
    // 버그 발견시 예전 버전으로 다운그레이드해서 잘 연결되도록 하는 것
    useNewUrlParser:true,
    // 오류 방지용 
    useUnifiedTopology:true,
    dbName:"tokku-database",
}).then(()=>{
    console.log("Database Connection is ready");
}).catch((err)=>{
    console.log(err);
})


// 서버주소는 http://localhost:3000 입니다.

app.listen(3000, ()=>{
    console.log("Server is running");
})

----

2. env 파일에 대한 설명
-> 고정적으로 사용할 것이 있으면 이 파일을 사용하시면 됩니다.

// /tokku는 기본으로 들어가는 게 좋을 것 같아 넣어놨습니다..!
API_URL = /tokku

// 이건 DB 링크 연결해둔 것입니다. 
DB_STRING = mongodb+srv://tokkube:1234asdf@cluster0.hj1dv.mongodb.net/tokku-database?retryWrites=true&w=majority

username : tokkube
pw : 1234asdf


3. .gitignore에 대한 설명
-> env 같이 숨겨야 할 내용은 여기에다가 그냥 파일명 적어주시면 됩니다.

4. package.json -> dependencies에 필요한 것들 적어두었습니다. 아마 파일 여시고 npm install terminal 창에 입력하시면 될 거에요! 안되면 npm install 모듈이름 해서 다운 받아주세요.


