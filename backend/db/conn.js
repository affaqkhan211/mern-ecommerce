import mongoose from "mongoose";

mongoose.set('strictQuery', false);

const Connection = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Connection successful");
    } catch (error) {
        console.log("Connection failed");
    }
}

export default Connection;