let express=require('express');
let cors=require('cors');

let app=express();
app.use(express.json());
app.use(cors());

let mongoose=require('mongoose');
mongoose.connect('mongodb://127.0.0.1/AgroKisan')
.then(()=>{console.log('Connected to database')})
.catch((err)=>{console.log('Not connect to db'+err)})

require('./Model/user')
app.use(require('./Router/routes'))

app.get("/",(req,res)=>{
    res.send('hello from app.js')
})

let port=8080;
app.listen(port,()=>{
    console.log('App is running at port 8080')
})