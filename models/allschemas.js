const mongoose=require ('mongoose')
// const Schema= mongoose.Schema

const schema1 = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },
    
    email:{
        type:String,
        required: true,
        unique: true,
    },
    password:{
        type:String,
        required: true,
    },
    isAdmin: { type: Boolean, default: false }
},{timestamps:true});


module.exports=mongoose.model('user_signup',schema1);