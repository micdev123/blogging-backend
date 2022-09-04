const express = require('express')
// Accessing controllers from controllers productController
const { getPosts, createPost, updatePost, deletePost, getUserPosts, getPost, getPostTags, likePost, unLikePost, postComments, getPostsWithMostLikes, getMyPosts} = require('../controllers/postController')

// Accessing express router fnx
const router = express.Router()

// Get all posts
router.get('/', getPosts)

// Create posts
router.post('/', createPost);

router.get('/limit', getPostsWithMostLikes)

router.get('/tags', getPostTags);

router.get('/mine/:id', getMyPosts);


router.get('/find/:id', getPost);

// Get user posts 
router.get('/author/:url', getUserPosts);

// Update post :: takes in the id of the post to update
router.put('/:id', updatePost)

// Delete post :: takes in the id of the post to delete
router.delete('/:id', deletePost)

// Update likePost :: takes in the id of the post to update
router.put('/:id/likePost', likePost)

// Update likeCount:: takes in the id of the post to update
router.put('/:id/unLikePost', unLikePost)

// Create comments :: takes in the id of the post to update
router.post('/:id/postComment', postComments)



module.exports = router;
