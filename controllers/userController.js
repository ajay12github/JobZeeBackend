import { catchAsyncError } from "../middleware/catchAsyncError.js"
import ErrorHandler from "../middleware/error.js"
import {User} from "../models/userSchema.js"
import { sendToken } from "../utils/jwtToken.js"



export const register = async (req, res, next)=>{
   try{
      console.log(10)
     const {name , email , phone , role , password} = req.body
     // anything is missing 
     if(!name || !email || !phone || !role || !password)
     {
      console.log(15)
             
        return next(new ErrorHandler("Please provide all required parameters"))
     }     
     //if email is already registerd
     const isEmail = await User.findOne({email}) 
     if(isEmail)
     {
      console.log(23)

      return next(new ErrorHandler("Email already registered"))
     }
     console.log(27)
  
      console.log(name, email, phone, role, password);
     const user =await User.create({name, email, phone, role, password})
     console.log(29)
      
     sendToken(user , 200  , res , "User registerd successfully" )
   }
   catch (error) {
      next(error)
   }
}

export const login = async (req , res ,next) =>
{
   try{
   const {email , password , role} = req.body; 

   if(!email || !password || !role)
   {
      return next(new ErrorHandler("Please provide all 3 details"))
   }

   const user = await User.findOne({email}).select("+password");
   
   if(!user)
   {
     return next( new ErrorHandler("Invalid email / password,400"));
   }

   const isPasswordmatched = await user.comparePassword(password)

   if(!isPasswordmatched)
   {
     return next(new ErrorHandler("Invalid email / password"))
   }

   if(user.role !== role)
   {
      console.log(user.role +" "+ role);
      return next(new ErrorHandler("User with this role not found"));
   }

   sendToken(user , 200 , res , "User logged in successfully")
}
catch (e) {
    next(e);
   }
}


export const logout = catchAsyncError(async (req , res , next) =>
{
   res.status(201).cookie("token" , "" , {
      httpOnly:true , 
      expires: new Date(Date.now()) }).json({
         success:true , 
         message : "user logged out succesfully"
      }) 

   })



   export const getUser = (req, res , next) =>{
      const user = req.user 
      res.status(200).json({
         success: true , 
         user
      })
   }