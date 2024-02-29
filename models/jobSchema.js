import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({

    title: {
        type: String,
        required: [true, "Please provide job title"],
        minLength: [3, "Job title must have atleast 3 characters"],
        maxLength: [50, "Job title must not exceed 50 characters"]
    },
    description: {
        type: String,
        required: [true, "Please provide job description"],
        minLength: [3  , "Job description must have atleast 3 characters"],
        maxLength: [350, "Job description must not exceed 50 characters"]
    },
    category: {
        type: String,
        required: [true, "Please provide job category"]
    },
    country: {
        type: String,
        required: [true, "Please provide job country"]
    },
    city: {
        type: String,
        required: [true, "Please provide job city"]
    },
    location: {
        type: String,
        required: [true, "Please provide exact location"],
        maxLength: [50, "it must be less than 50 characters"]
    },
    fixedSalary: {
        
        type: Number,
        maxLength: [10, "not allowed on this much salary on this platform"]
    },
    SalaryFrom: {
        type: Number,
        maxLength: [10, "not allowed on this salary on this platform"]
    },
    SalaryTo: {

        type: Number,
        maxLength: [10, "not allowed on this salary on this platform"]
    },
    expired: {
        type: Boolean,
        default: false
    },
    jobPostedOn: {
        type: Date,
        default: Date.now()
    },
    postedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    }

});


export const Job = mongoose.model("Job", jobSchema)