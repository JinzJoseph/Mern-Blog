import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { createPost,getpost } from "../controllers/postController.js";

const router = express.Router();
router.post("/create", verifyToken, createPost);
router.post("/getpost",verifyToken,getpost)

export default router;
