import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { createPost } from "../controllers/postController.js";

const router = express.Router();
router.post("/create", verifyToken, createPost);

export default router;
