import express from 'express';

import {
  createPost,
} from '../Controllers/postControllers.js';

const router = express.Router();

router.get('/', getPosts);
router.post('/new', createPost);
router.get('/post/:id', getPost);
router.put('/update/:id', updatePost);
router.delete('/delete/:id', deletePost);
router.get('/user/:userId', getUserPosts);


export default router;