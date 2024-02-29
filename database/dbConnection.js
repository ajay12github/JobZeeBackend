import mongoose from "mongoose";

export const dbConnection = ()=> {
    mongoose.connect(process.env.MONGO_URI , {
        dbName : "job_seeking_application", 
    })
    .then(()=>{
        console.log("connected to database");
    })
    .catch((err) => {
            console.log(`some error connecting database ${err}`);
    })
}