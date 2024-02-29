import express from 'express';
import {employerGetAllApplications , JobSeekerDeleteApplication , JobSeekerGetAllApplications, postApplication} from "../controllers/applicationController.js"
import { isAuthorized } from '../middleware/auth.js';
const router = express.Router();



router.get("/jobseeker/getall" , isAuthorized ,JobSeekerGetAllApplications);
router.get("/employer/getall" ,isAuthorized, employerGetAllApplications);
router.delete("/delete/:id" ,isAuthorized, JobSeekerDeleteApplication)
router.post("/post" , isAuthorized , postApplication)
export default router;