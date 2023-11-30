import express from 'express';

import {
  createPost,
  getPost,
  getPosts,
  updatePost,
  deletePost,
  getUserPosts,
  upvotePost,
  addCommentToPost,
  downvotePost,
  upvoteComment,
  downvoteComment,
  getUpvotedPostsByUser,
} from '../Controllers/postControllers.js';


const router = express.Router();

router.get('/', getPosts);
router.post('/new', createPost);
router.get('/post/:id', getPost);
router.put('/update/:id', updatePost);
router.delete('/delete/:id', deletePost);
router.get('/user/:userId', getUserPosts);
router.post('/post/upvote/:id', upvotePost);
router.post('/post/downvote/:id', downvotePost);
router.post('/post/comment/:id', addCommentToPost);
router.post('/post/:postId/comment/:commentId/upvote', upvoteComment);
router.post('/post/:postId/comment/:commentId/downvote', downvoteComment);
router.get('/user/:userId/upvoted-posts', getUpvotedPostsByUser);

export default router;