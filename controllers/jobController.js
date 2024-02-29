import ErrorHandler from "../middleware/error.js"
import { Job } from "../models/jobSchema.js"


export const getAllJobs = async (req, res, next) => {
    try {

        const jobs = await Job.find({ expired: false });
        res.status(200).json({
            sucess: true,
            jobs
        })
    //    console.log(res)

    } catch (e) {
        next(e)
    }
}

export const postJob = async (req, res, next) => {
    try {
        const { role } = req.user
        if (role === "Job Seeker") {
            return next(new ErrorHandler("JobSeeker is not allowed to post a job", 400))
        }


        const { title, description, category, country, city, location,
            fixedSalary, SalaryFrom, SalaryTo } = req.body

        console.log(SalaryFrom, SalaryTo)
             

        if (!title || !description || !category || !country || !city || !location) {
            return next(new ErrorHandler("Please provide all required  job details", 400))
        }
      
        if ((!SalaryFrom || !SalaryTo) && !fixedSalary) {
            return next(new ErrorHandler("Please provide either ranged Salalry or fixed Salary", 400))
        }

        if (SalaryFrom && SalaryTo && fixedSalary) {
            return next(new ErrorHandler("Please provide either ranged Salalry or fixed Salary but not both", 400))
        }
 
         
        if (!fixedSalary ) {
            let comparisonResult = SalaryFrom.localeCompare(SalaryTo    , undefined, { numeric: true });

             if(comparisonResult > 0) {return next(new ErrorHandler("SalaryTo should be greater than SalaryFrom", 400))}
        }
        const postedBy = req.user._id


     //   console.log("2nd time - "  , title, description, category, country, city, location , fixedSalary, SalaryFrom, SalaryTo)

        const job = await Job.create(
            {
                title,
                description,
                category,
                country,
                city,
                location,
                fixedSalary,
                SalaryFrom,
                SalaryTo,
                postedBy
            })
          // console.log(job)
    
        res.status(200).json({
            sucess: true,
            message: "Job Created Successfully",
            job
        })



    } catch (e) {
        next(e)
    }

}


// every employer can see jobs posted by him

export const getMyJobs = async (req, res, next) => {
    try {


        const { role } = req.user
        if (role === "Job Seeker") {
            return next(new ErrorHandler("JobSeeker is not allowed to access this resource", 400))
        }

        const myjobs = await Job.find({ postedBy: req.user._id })
        res.status(200).json({
            sucess: "true",
            myjobs
        })
    } catch (e) {
        next(e)
    }
}

export const updateJob = async (req, res , next) => {
    try{
        const {role} =  req.user
        if (role === "Job Seeker") {
            return next(new ErrorHandler("JobSeeker is not allowed to update a job", 400))
        }
       const {id} = req.params
       let job =  await Job.findById(id)

       if(!job)
       {
        return next(new ErrorHandler("Oops , Job not found", 400))
       }

       job = await Job.findByIdAndUpdate(id , req.body , {
        new : true ,
        runValidators : true , 
        useFindAndModify: false
       })


       res.status(200).json({
        success : true , 
        job , 
        message : "Job successfully updated"

       })



    }catch(e){next(e)}

}


export const deleteJob = async (req  , res , next) => {
    try{

        const {role} =  req.user
        if (role === "Job Seeker") {
            return next(new ErrorHandler("JobSeeker is not allowed to update a job", 400))
        }
       const {id} = req.params
       let job =  await Job.findById(id)
       if(!job)
       {
        return next(new ErrorHandler("Oops , Job not found", 400))
       }

       await job.deleteOne()

       res.status(200).json({
        success : true , 
        message : "Job deleted"

       })

 

    }

    catch(e){next(e)}
}


export const getSingleJob = async (req , res , next)=>{

    try {
        
     const{id} = req.params
     const job = await Job.findById(id)
     if(!job)
     {
        return next(new ErrorHandler("Job not found"  , 404));
     }
     console.log(job)
     res.status(200).json({
        success : "true" ,
        job
     })



    } catch (error) {
        next(new ErrorHandler("Invalid Id / CastError", 400))
    }

}