const express = require('express')

//controllers
const {
  getAllPosts,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/post.controller')

//Middlewares
const { postExists } = require('../middlewares/post.middleware')
const { protectSession, protectPostOwners } = require('../middlewares/auth.middleware')
const { createPostValidators } = require('../middlewares/validators.middlewares')



const { upload } = require('../utils/multer.util')

const postRouter = express.Router();


postRouter.use(protectSession)

postRouter.get('/', getAllPosts)

postRouter.post('/', upload.single('postImg'), createPost)

postRouter.patch('/:id', postExists, protectPostOwners, updatePost)

postRouter.delete('/:id', postExists, protectPostOwners, deletePost)

module.exports = { postRouter } 