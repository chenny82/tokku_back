const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require('cors');
const session  = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const cookieParser = require("cookie-parser");


require("dotenv/config");

const api = process.env.API_URL;

app.use(cors());
app.options('*',cors);

//middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
    cookie:{maxAge:4 * 60 * 60 * 1000} //쿠키 4시간 동안 유지
}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Routes
const usersRoutes = require("./routes/usersR");
app.use(`${api}/users`,usersRoutes);

mongoose.connect(process.env.DB_STRING,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    dbName:"tokku-database",
}).then(()=>{
    console.log("Database Connection is ready");
}).catch((err)=>{
    console.log(err);
})

app.listen(3000, ()=>{
    console.log("Server is running");
})