const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require('cors');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const nodemailer = require("nodemailer");

require("dotenv/config");

const api = process.env.API_URL;

app.use(cors());
app.options('*',cors);

//middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


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