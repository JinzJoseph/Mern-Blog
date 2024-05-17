import express from 'express'
import { updateUser,deleteUser} from '../controllers/userController.js'
import { verifyToken } from '../middleware/verifyToken.js';
const router=express.Router()

router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:id',verifyToken,deleteUser)

export default router;