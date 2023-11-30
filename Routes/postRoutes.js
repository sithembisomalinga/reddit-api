import express from 'express';

import {
  createPost,
} from '../Controllers/postControllers.js';

const router = express.Router();

router.get('/', getPosts);
router.post('/new', createPost);


export default router;