import ErrorHandler from "../middleware/error.js"
import { Application } from "../models/applicationSchema.js" 
import cloudinary from 'cloudinary'
import { Job } from "../models/jobSchema.js"

export const employerGetAllApplications = async(req, res, next) =>{
    try{
        const {role} =  req.user
        if (role === "Job Seeker") {
            return next(new ErrorHandler("JobSeeker is not allowed for this operation", 400))
        }   

   const {_id} = req.user;
   const applications = await Application.find({'employerID.user' :_id});
   res.status(200).json({
    success: true , 
    applications
   })



    }
    catch(e){

    }
}


export const JobSeekerGetAllApplications = async(req, res, next) =>{
    try{
        const {role} =  req.user
        if (role === "Employer") {
            return next(new ErrorHandler("Employer is not allowed for this operation", 400))
        }   

   const {_id} = req.user;
   const applications = await Application.find({'applicantID.user' :_id});
   res.status(200).json({
    success: true , 
    applications
   })



    }
    catch(e){

    }
}


export const JobSeekerDeleteApplication = async(req, res,  next) => {
    try{

        const {role} =  req.user
        if (role === "Employer") {
            return next(new ErrorHandler("Employer is not allowed for this operation", 400))
        }   


        const{id}= req.params
        const application = await Application.findById(id)
        if(!application) return next(new ErrorHandler("Oops application not found" , 404))
        await application.deleteOne();
        res.status(200).json({
            success: true , 
            message: "Application deleted successfully"
           })
    }
    catch(e){next(e);}
}



export const postApplication = async (req, res, next) => {
    try{
        console.log(76)
    const { role } = req.user;
    if (role === "Employer") {
      return next(
        new ErrorHandler("Employer not allowed to access this resource.", 400)
      );
    }
    console.log(83)

    if (!req.files || Object.keys(req.files).length === 0) {
      return next(new ErrorHandler("Resume File Required!", 400));
    }
    console.log(88)
  
    const { resume } = req.files;
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(resume.mimetype)) {
      return next(
        new ErrorHandler("Invalid file type. Please upload a PNG file.", 400)
      );
    }
    console.log(97)

    const cloudinaryResponse = await cloudinary.uploader.upload(
      resume.tempFilePath
    );
  
    console.log(103)

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(
        "Cloudinary Error:",
        cloudinaryResponse.error || "Unknown Cloudinary error"
      );
      return next(new ErrorHandler("Failed to upload Resume to Cloudinary", 500));
    }


    console.log(114)

    const { name, email, coverLetter, phone, address, jobId } = req.body;
    const applicantID = {
      user: req.user._id,
      role: "Job Seeker",
    };
    if (!jobId) {
      return next(new ErrorHandler("Job not found!", 404));
    }

    console.log(125 , jobId)

    const jobDetails = await Job.findById(jobId);
    console.log(jobDetails)
    if (!jobDetails) {
      return next(new ErrorHandler("Job not found!", 404));
    }

    console.log(132)

  
    const employerID = {
      user: jobDetails.postedBy,
      role: "Employer",
    };
    if (
      !name ||
      !email ||
      !coverLetter ||
      !phone ||
      !address ||
      !applicantID ||
      !employerID ||
      !resume
    ) {
      return next(new ErrorHandler("Please fill all fields " , 400));
    }

    console.log(154)

    const application = await Application.create({
      name,
      email,
      coverLetter,
      phone,
      address,
      applicantID,
      employerID,
      resume: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });

    console.log(170)

    res.status(200).json({
      success: true,
      message: "Application Submitted!",
      application,
    });
  
}catch(e){next(e)}


}
  
  
  