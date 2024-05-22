import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { createPost,getpost ,deletePost,updatePost} from "../controllers/postController.js";

const router = express.Router();
router.post("/create", verifyToken, createPost);
router.get("/getpost",verifyToken,getpost);
router.delete("/deletepost/:postId/:userId",verifyToken,deletePost)
router.put('/updatePost/:postId/:userId',verifyToken,updatePost)
export default router;
