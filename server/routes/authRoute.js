import express from "express";
import {
  signup,
  signin,
  googleAuth,
  signout,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/signin", signin);
router.post("/google", googleAuth);
router.post("/signout", signout);
export default router;
