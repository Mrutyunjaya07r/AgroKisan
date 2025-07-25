let mongoose=require('mongoose');
let {ObjectId}=mongoose.Schema.Types

let npkSchema=new mongoose.Schema({
    N:{type:Number,required:true},
    P:{type:Number,required:true},
    K:{type:Number,required:true},
    PH:{type:Number,required:true},
    createdBy:{type:ObjectId,ref:"USER"}
})

mongoose.model('NPK',npkSchema)