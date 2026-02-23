import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import mongoose from "mongoose";

const makeToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

export async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: "All fields required" });

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already exists" });

  const passwordHash = await bcrypt.hash(password, 10);

  // NOTE: by default role=user
  const user = await User.create({ name, email, passwordHash, role: "user" });

  const token = makeToken(user);
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}

export async function login(req, res) {
  const { email, password } = req.body;
  console.log('Login attempt:', { email, passwordLength: password?.length });

  if (!email || !password) return res.status(400).json({ message: "Email/password required" });

  const user = await User.findOne({ email });
  if (!user) {
    console.log('User not found in DB:', email);
    return res.status(401).json({ message: "User not found. Please register." });
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    console.log('Password mismatch for user:', email);
    return res.status(401).json({ message: "Incorrect password. Please try again." });
  }

  const token = makeToken(user);
  console.log('Login successful for:', email);
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}

export async function getUsers(req, res) {
  try {
    // Return all non-admin users
    const users = await User.find({ role: "user" }).select("-passwordHash").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
}
