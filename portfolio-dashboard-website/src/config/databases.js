const mongoose = require("mongoose");
const uri = "mongodb://localhost:27017/portfolio";

const connectDB = async ()=>{
    try{
        await mongoose.connect(uri);
        console.log("DB connection is successful.")
    }
    catch(error){
        console.log("Something went wrong."+"\n"+"Error : "+error);
        process.exit(1);
    }
}

const disconnectDB = async (signal)=>{
    try{
        await mongoose.disconnect();
        console.log(`DB disconnection successful (${signal}).`);
        process.exit(0);
    }
    catch(error){
        console.log(`Somethiing went wrong (${signal}).`+"\n"+"Error : "+error);
        process.exit(1);
    }
};

module.exports = {connectDB,disconnectDB};