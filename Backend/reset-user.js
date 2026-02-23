import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./src/models/User.js";

dotenv.config();

async function resetUser() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const email = "vaideeswari8@gmail.com";
        const password = "admin123";
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.findOneAndUpdate(
            { email },
            { passwordHash: hashedPassword, role: "admin" },
            { upsert: true, new: true }
        );

        console.log(`✅ User ${email} reset/created with password: ${password} and role: admin`);
        process.exit(0);
    } catch (err) {
        console.error('Error resetting user:', err);
        process.exit(1);
    }
}

resetUser();
