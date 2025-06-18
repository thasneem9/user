import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { viewPost, createPost, deletePost, updatePost,getMyPosts, getAllPosts } from '../controllers/postController.js';
const router = express.Router();

router.get('/viewPost', protectRoute, viewPost);
router.get('/myPosts', protectRoute, getMyPosts);
router.post('/createPost', protectRoute, createPost);
router.delete('/deletePost', protectRoute, deletePost);
router.put('/updatePost', protectRoute, updatePost);

router.get('/admin/allPosts', getAllPosts);

export default router;
