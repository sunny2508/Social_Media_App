import express from 'express'
import { createPost,getPost,deletePost,likeUnlikePost
    ,replyPost,getFeedPost,
    getUserPost
 } from '../Controllers/postController.js';
import verifyJWT from '../Middlewares/authMiddleware.js';
const router = express.Router();


router.get('/feed',verifyJWT,getFeedPost);
router.get('/user/:username',getUserPost);
router.get('/:id',getPost);
router.post('/create',verifyJWT,createPost);
router.delete('/:id',verifyJWT,deletePost);
router.post('/likeunlike/:id',verifyJWT,likeUnlikePost);
router.post('/reply/:id',verifyJWT,replyPost);


export default router;