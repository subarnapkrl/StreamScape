import express from 'express';

import { isAuthenticated } from '../middlewares/auth.js';
import { addPost, deletePost, getAllPosts, getMyPosts, getPostbyId, getSinglePost, updatePost } from '../controllers/postController.js';


const router=express.Router();


router.get('/getposts',getAllPosts);
router.get('/mypost',isAuthenticated,getMyPosts);
router.post('/addPost',isAuthenticated,addPost)
router.put('/updatepost/:id',isAuthenticated,updatePost);
router.delete('/deletepost/:id',isAuthenticated,deletePost);

router.get('/:id',isAuthenticated,getSinglePost);
router.get('/thepost/:id',isAuthenticated,getPostbyId);


export default router;