import mongoose from "mongoose";
import validator from "validator";


const applicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please provide your name"],
        minLength: [3, "Please provide at least 3 characters in name"],
        maxLength: [50, "Please provide not more than 50 characters in name"],
    },
    email: {
        type: String,
        validator: [validator.isEmail, "Please provide a valid email !"],
        required: [true, "Please provide your email address"]
    },
    phone: {
        type: Number,
        required: [true, "Please eneter your phone no"]
    },
     coverLetter: {
        type: String,
        required: [true, "Please provide a cover letter!"],
    },
    address: {
        type: String,
        required: [true, "Please eneter your address"]
    },
    resume: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        },
    },
     applicantID: {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            role: {
                type: String,
                enum: ["Job Seeker"],
                required: true
            }
        },
        employerID: {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            role: {
                type: String,
                enum: ["Employer"],
                required: true
            }
        }
    
})





export const Application = mongoose.model("Application", applicationSchema);