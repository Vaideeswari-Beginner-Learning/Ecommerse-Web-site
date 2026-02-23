import { Router } from "express";
import { login, register, getUsers, deleteUser } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { requireAdmin } from "../middleware/admin.middleware.js";

const router = Router();
router.post("/register", register);
router.post("/login", login);

// Admin only
router.get("/", protect, requireAdmin, getUsers);
router.delete("/:id", protect, requireAdmin, deleteUser);

export default router;
