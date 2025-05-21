let JWT=require('jsonwebtoken')
let {JWT_Secret}=require('../key')
let mongoose=require('mongoose');
let USER=mongoose.model("USER");

module.exports=(req,res,next)=>{
    let {authorization}=req.headers
    if(!authorization){
        return res.status(404).send('Auth 1 problem')
    }
    let token=authorization.replace("Bearer ","")
    JWT.verify(token,JWT_Secret,(err,payload)=>{
        if(err){
            return res.status(404).send('Auth 2 problem')
        }
        let {_id}=payload
        USER.findById(_id).then((userData)=>{
            console.log(userData)
            req.user=userData;
            next()
        })
    })
}