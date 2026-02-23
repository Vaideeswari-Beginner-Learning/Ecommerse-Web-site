import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./src/models/User.js";

dotenv.config();

async function listUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({}, 'name email role');
        console.log('--- Current Users in DB ---');
        console.log(JSON.stringify(users, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('Error listing users:', err);
        process.exit(1);
    }
}

listUsers();
