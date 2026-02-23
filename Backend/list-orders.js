import mongoose from "mongoose";
import dotenv from "dotenv";
import Order from "./src/models/Order.js";

dotenv.config();

async function listOrders() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const orders = await Order.find({});
        console.log('--- Current Orders in DB ---');
        console.log(JSON.stringify(orders, null, 2));
        process.exit(0);
    } catch (err) {
        console.error('Error listing orders:', err);
        process.exit(1);
    }
}

listOrders();
