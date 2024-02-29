import { catchAsyncError } from "./catchAsyncError.js"
import ErrorHandler from "./error.js"
import jwt from "jsonwebtoken"
import {User} from "../models/userSchema.js"



//authorized
export const isAuthorized = async(req , res , next)=>{
    
   try{
   const {token} = req.cookies
   console.log(req.cookies);
   if(!token)
   {

    return next(new ErrorHandler("user not authorized no token"  , 400));
   }
   
   const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY)
    
   req.user = await User.findById(decoded.id)
   next()
   }catch(err)
    {
      next(err);
   }
}