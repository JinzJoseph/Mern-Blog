import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { createcomment,getAllcomment ,likeCommand,updateComment,deleteComment,getcomments} from "../controllers/commentController.js";
const router = express.Router();

router.post("/create",verifyToken,createcomment);
router.get("/getAllcomment/:postId",getAllcomment);
router.put("/like/:commandId",verifyToken,likeCommand)
router.put("/edit/:commandId",verifyToken,updateComment),
router.delete('/deleteComment/:commentId', verifyToken, deleteComment);
router.get("/getComments",verifyToken,getcomments)
export default router;