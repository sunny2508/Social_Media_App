import mongoose from "mongoose";

const dbConnect = async()=>{
    try{
        await mongoose.connect(`${process.env.MONGO_DB_URL}`);
        console.log("Database connected successfully");
    }
    catch(error)
    {
        console.error("Error occured in connecting to database",error.message);
        process.exit(1);
    }
}

export {dbConnect};