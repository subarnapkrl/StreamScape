import express from 'express';
import { getAllUser, getOneUser, getUser, login, logout, register } from '../controllers/userController.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router=express.Router();

router.post('/register',register);
router.post('/login',login)
router.get('/logout',isAuthenticated,logout);
router.get('/getuser',isAuthenticated,getUser);
router.get('/getallusers',isAuthenticated,getAllUser);
router.get('/singleuser/:id',isAuthenticated,getOneUser)

export default router;