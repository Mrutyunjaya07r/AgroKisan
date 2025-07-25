let express=require('express');
let router=express.Router();
let mongoose=require('mongoose');
let USER=mongoose.model('USER')
let NPK=mongoose.model('NPK')
let {JWT_Secret}=require('../key');
let JWt=require('jsonwebtoken');
const requireLogin = require('../Middleware/requireLogin');

router.get("/",(req,res)=>{
    res.send('Hello from router')
})
router.get("/add",requireLogin,(req,res)=>{
    res.send('Hello from router middleware')
})
router.post("/signup",(req,res)=>{
    let {username,email,password,city}=req.body;
    if(!username||!email||!password||!city){
        return res.status(404).send({message:"Fill all the feilds"})
    }

    let user=new USER({
        username:username,
        email:email,
        password:password,
        city:city
    })
    let result=user.save();
    console.log(result);
    res.send(result);
})

router.post('/signin',(req,res)=>{
    let {username,password}=req.body;
    if(!username||!password){
         return res.status(404).send({message:"Fill all the feilds"})
    }
    USER.findOne({username:username}).then((savedUser)=>{
        if(!savedUser){
            return res.status(404).send({message:"User not found"})
        }
        console.log(savedUser);
    })
     USER.findOne({password:password}).then((savedUser)=>{
        if(!savedUser){
            return res.status(404).send({message:"User not found"})
        }
        console.log(savedUser);
        let token=JWt.sign({_id:savedUser._id},JWT_Secret);
        console.log(token);
        let userid=savedUser._id;
        res.json({token,userid})
    })
})

router.post("/addnpk",(req,res)=>{
    let {N,P,K,PH}=req.body;
    if(!N || !P || !K || !PH){
        return res.status(404).send({message:"Fill all the feilds"}) 
    }
    let npkmod=new NPK({
        N:N,
        P:P,
        K:K,
        PH:PH
    })
     let result=npkmod.save();
    console.log(result);
    res.send(result);
})


module.exports=router