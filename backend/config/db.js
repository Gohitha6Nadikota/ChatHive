const mongoose=require('mongoose')

const connectDB=async ()=>{

    try{
    const conn=await mongoose.connect(process.env.MONGO_URI,{});
    // To connect to the MongoDB
    console.log(`MongoDB connected: ${conn.connection.host}`);
    }
    catch(error)
    {
        console.log(`Error: ${error.message}`);
        process.exit();
    }
};

module.exports=connectDB