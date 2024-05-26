import express from 'express'
import { updateUser,deleteUser,getusers,singleUser } from '../controllers/userController.js'
import { verifyToken } from '../middleware/verifyToken.js';
const router=express.Router()

router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:id',verifyToken,deleteUser);
router.get('/getusers',verifyToken,getusers);
router.get('/:userId',singleUser)

export default router;