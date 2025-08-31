import mongoose from "mongoose";

const connectDB = async () => {
     
     try {

        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/monify`)

        console.log(`\nMongoDB Connected !! DB Host : ${connectionInstance.connection.host} `)


     } catch (error) {
        
          console.log("Database connection failed !!")
          process.exit(1);
     }
}

export {connectDB}