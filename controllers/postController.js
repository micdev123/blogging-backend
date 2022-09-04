const asyncHandler = require('express-async-handler')
const Post = require('../models/Post')
const User = require('../models/User')

// Create post :: POST request : endpoint /api/posts :: access public
const createPost = asyncHandler(async (req, res) => {
    // Get all properties
    const newPost = new Post(req.body)

    try {
        // Save new product in database
        const postSaved = await newPost.save()
        res.status(200).json(postSaved)
    } 
    catch (error) {
        res.status(500).json(error)
    }
})


// Get all posts :: GET request : endpoint /api/posts :: access public
const PAGE_SIZE = 8;
const getPosts = asyncHandler(async (req, res) => {
    const tag = req.query.tag;
    const pageSize = req.query.pageSize || PAGE_SIZE;
    const page = req.query.page || 1;
    try {
        let posts;
        if (tag) {
            posts = await Post.find({ tags: { $regex: tag },}).sort({ _id: -1 });
        }
        else {
            posts = await Post.find().sort({ _id: -1 }).skip(pageSize * (page - 1)).limit(pageSize);
        }
        const countPosts = await Post.countDocuments();
        res.status(200).json({
            posts,
            countPosts,
            page,
            pages: Math.ceil(countPosts / pageSize),
        })
    } 
    catch (error) {
        res.status(500).json(error)
    }
    
})

const getPostsWithMostLikes = asyncHandler(async (req, res) => {
    try {
        
        const posts = await Post.find().sort({ likeCount: -1 }).limit(5);
        
        res.status(200).json(posts)
    } 
    catch (error) {
        res.status(500).json(error)
    }
    
})

// Get all user post
const getUserPosts = asyncHandler(async (req, res) => {
    try {
        const user = await User.findOne({ userUrl: req.params.url })
        const posts = await Post.find({ creatorLink: req.params.url }).sort({ _id: -1 });
        res.status(200).json({user, posts});
    }
    catch (error) {
        res.status(500).json(error)
    }
    
})

// Get all user post
const getMyPosts = asyncHandler(async (req, res) => {
    try {
        const posts = await Post.find({ creatorId: req.params.id }).sort({ _id: -1 });
        res.status(200).json(posts);
    }
    catch (error) {
        res.status(500).json(error)
    }
    
})



// Update post :: PUT request : endpoint /api/posts/:id :: access private :: Verified user
const updatePost = asyncHandler(async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post.creator === req.body.creator) {
            try {
                const updatedPost = await Post.findByIdAndUpdate(
                    req.params.id,
                    {
                        $set: req.body,
                    },
                    { new: true }
                );
                // send updated post
                res.status(200).json(updatedPost);
            }
            catch (error) {
                res.status(500).json(error);
            }
        }
        else {
            res.status(401).json("You can only update your own post!");
        }
    } 
    catch (error) {
        res.status(500).json(error)
    }
})

// Delete post :: DELETE request : endpoint /api/posts/:id :: access private :: verified user
const deletePost = asyncHandler(async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (post.creator === req.body.creator) {
            try {
                // find the post by id and delete it
                await Post.findByIdAndDelete(req.params.id);
                res.status(200).json({message: `Post: ${req.params.id} deleted`})
            }
            catch (error) {
                res.status(500).json(error);
            }
        }
        else {
            res.status(401).json("You can only delete your own post!");
        }
        
    } 
    catch (error) {
        res.status(500).json(error)
    }
})


// Get a single product :: GET request : endpoint /api/products :: access public
const getPost = asyncHandler(async (req, res) => {
    try {
        // find user by id
        const post = await Post.findById(req.params.id)

        res.status(200).json(post);
    } 
    catch (error) {
        res.status(500).json(error)
    }
})

const getPostTags = asyncHandler(async (req, res) => {
    const postTags = await Post.aggregate([
        { "$unwind": "$tags" },
        {
            $group: {
                _id: '$tags',
                count: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
        {
            $group: {
                _id: 1,
                values: {
                    $push: {
                        _id: "$_id",
                        count: "$count"
                    }
                }
            }
        }
    ]);
    res.status(200).json({postTags})
})

const likePost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // console.log(id);
    try {
        const post = await Post.findById(id);
        if (post) {
            try {
                const updatedPost = await Post.findByIdAndUpdate(id, {likeCount: post.likeCount + 1},{ new: true });
                // send updated post
                res.status(200).json(updatedPost);
            }
            catch (error) {
                res.status(500).json(error);
            }
        }
        else {
            res.status(401).json("Post Not Found!");
        }
    } 
    catch (error) {
        res.status(500).json(error)
    }
})


const unLikePost = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // console.log(id);
    try {
        const post = await Post.findById(id);
        if (post) {
            try {
                const updatedPost = await Post.findByIdAndUpdate(id, {likeCount: post.likeCount - 1},{ new: true });
                // send updated post
                res.status(200).json(updatedPost);
            }
            catch (error) {
                res.status(500).json(error);
            }
        }
        else {
            res.status(401).json("Post Not Found!");
        }
    } 
    catch (error) {
        res.status(500).json(error)
    }
})

const postComments = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const value = req.body;
    // console.log(value);
    const post = await Post.findById(id);

    post.comments.push(value);

    const updatedPost = await Post.findByIdAndUpdate(id, post, { new: true })

    res.status(200).json(updatedPost);
})


module.exports = {
    createPost,
    getPosts,
    updatePost,
    deletePost,
    getPost,
    getUserPosts,
    getPostTags,
    likePost,
    unLikePost,
    postComments,
    getPostsWithMostLikes,
    getMyPosts
}


