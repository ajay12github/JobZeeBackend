export const sendToken = (user , statusCode ,res , message) =>{
    const token  = user.getJwtToken()
    const options = {
        expires: new Date(Date.now() + (5 * 24 * 60 * 60 * 1000)), // 5 days from now
        httpOnly: true , 
        secure: true
    };
    

    res.status(statusCode).cookie("token" , token , options).json({
        success : true , 
        user,
        message,
        token
     })
}
