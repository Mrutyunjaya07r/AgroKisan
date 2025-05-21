let mongoose=require('mongoose');

let userSchema=new mongoose.Schema({
    username:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    city:{type:String,required:true}  
})

mongoose.model('USER',userSchema)