import express from 'express'
const router = express.Router();
import { signup,login,logout,
    getProfile,updateProfile,followUnfollowUser,
    checkAuth
 } from '../Controllers/userController.js';
import verifyJWT from '../Middlewares/authMiddleware.js';

router.get('/checkauth',verifyJWT,checkAuth);
router.get('/profile/:query',getProfile);
router.post('/signup',signup);
router.post('/login',login);
router.post('/logout',verifyJWT,logout);
router.put('/updateprofile/:id',verifyJWT,updateProfile);
router.post('/followunfollow/:id',verifyJWT,followUnfollowUser);

export default router;