import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "./src/models/User.js";
import Product from "./src/models/Product.js";

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("🌱 Connected to MongoDB for seeding...");

        // 1. Ensure only one Admin exists
        const adminEmail = "admin@gmail.com";

        // Demote any other admins
        await User.updateMany(
            { email: { $ne: adminEmail }, role: "admin" },
            { role: "user" }
        );
        console.log("ℹ️ Other admin accounts demoted to regular users.");

        const existingAdmin = await User.findOne({ email: adminEmail });

        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash("admin123", 10);
            await User.create({
                name: "Main Admin",
                email: adminEmail,
                passwordHash: hashedPassword,
                role: "admin"
            });
            console.log("✅ Admin user created: admin@gmail.com / admin123");
        } else {
            // Ensure existing admin account is actually an admin
            existingAdmin.role = "admin";
            await existingAdmin.save();
            console.log("ℹ️ Admin user verified: admin@gmail.com.");
        }

        // 2. Create Initial Products (if empty)
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            const demoProducts = [
                {
                    title: "Modern L-Shape Sofa",
                    category: "Sofa",
                    design: "L-Shape",
                    price: 45000,
                    images: ["https://images.unsplash.com/photo-1555041469-a586c61ea9bc"],
                    description: "Comfortable and stylish L-shape sofa for your living room.",
                    stock: 5
                },
                {
                    title: "Ergonomic Office Chair",
                    category: "Chair",
                    design: "Ergonomic",
                    price: 12000,
                    images: ["https://images.unsplash.com/photo-1505797149-43b0069ec26b"],
                    description: "Perfect for long working hours with lumbar support.",
                    stock: 15
                }
            ];
            await Product.insertMany(demoProducts);
            console.log("✅ Demo products seeded.");
        } else {
            console.log("ℹ️ Products already exist in DB.");
        }

        console.log("🌱 Seeding completed successfully!");
        process.exit();
    } catch (err) {
        console.error("❌ Seeding failed:", err);
        process.exit(1);
    }
};

seedData();
