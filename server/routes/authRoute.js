import express from 'express'
import { signup,signin ,googleAuth} from '../controllers/authController.js';
const router=express.Router()

router.post('/signup',signup)

router.post('/signin',signin)
router.post("/google",googleAuth)
router.post('/up')
export default router;