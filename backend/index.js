import 'dotenv/config'
import app from './app.js'
import { dbConnect } from './database/db.js'

const getConnection = async()=>{
    try{
       await dbConnect();
       app.listen(process.env.PORT || 5000,()=>{
        console.log(`Server started at port ${process.env.PORT}`);
       })
    }
    catch(error)
    {
       console.log("Error in starting server",error.message);
    }
}

getConnection();