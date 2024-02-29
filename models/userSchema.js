import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const  userSchema =  new mongoose.Schema({
     name :{
        type : String , 
        required : [true , "please provide a name"] ,
        minLength : [1 , "Name must contain atleast one character"],
        maxLength :[30 , "Name cannot exceed 30 characters"]
     } , 

     email:{
        type : String ,
        required :[ true , "Please provide your email"] , 
        validate : [validator.isEmail , "please provide valid email"]
     },

     phone:{
        type : Number ,
        required :[ true , "Please provide your phone number"] ,

     },
     password:{
        type : String ,
        required :[ true , "Please provide your password"],
        minLength:[8  , "Password must be contain 8 characters"],
        maxLength:[32 , "Password cant exceed 32 characters"],
        select : false
     },
     role:{
        type : String ,
        enum:["Job Seeker"  , "Employer"] // out of this 2 values user will be allowed to select/enter
       },
     createdAt:{
        type : Date ,
        default: Date.now()
     }
});



//hashing the password 
//It's a middleware function that runs before a document is saved to the database
userSchema.pre("save" , async function (){
    if(!this.isModified("password"))
    {
        return next()
    }
    this.password = await bcrypt.hash(this.password , 10)
   
    
})

//comparing the password
// this represent the document of user schema that is being saved
userSchema.methods.comparePassword = async function(enteredPassword)
{
    return await bcrypt.compare(enteredPassword, this.password)
}


// generating jwt token
userSchema.methods.getJwtToken = function()
{
    return jwt.sign({id:this._id} ,process.env.JWT_SECRET_KEY,{
      expiresIn:process.env.JWT_EXPIRE
    })
}


export const User = mongoose.model("User" , userSchema)