import app from './app.js';
import cloudinary from 'cloudinary';


cloudinary.v2.config({

    cloud_name:process.env.c_name,
    api_key:process.env.c_api , 
    api_secret:process.env.c_secret

})
 

app.listen(process.env.PORT , ()=> {
      console.log(`Server listening on port ${process.env.PORT}`);
})