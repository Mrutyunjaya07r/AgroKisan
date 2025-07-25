let express=require('express');
let cors=require('cors');

let app=express();
app.use(express.json());
app.use(cors());
require('dotenv').config();


let mongoose=require('mongoose');
mongoose.connect(process.env.DB_URL)
.then(()=>{console.log('Connected to database')})
.catch((err)=>{console.log('Not connect to db'+err)})

require('./Model/user')
require('./Model/npk')
app.use(require('./Router/routes'))

app.get("/",(req,res)=>{
    res.send('hello from app.js')
})

let port=process.env.port;
app.listen(port,()=>{
    console.log('App is running at port 8080')
})