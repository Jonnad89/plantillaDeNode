const { ref, uploadBytes } = require('firebase/storage')

const { Post } = require('../models/post.models')

const { User } = require('../models/user.model')

//utils
const { catchAsync } = require('../utils/catchAsync.util')
const { storage } = require('../utils/firebase.util')

const getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.findAll({
    attributes: ['id', 'title', 'content', 'createdAt'],
    include: [{ model: User, attributes: ['id', 'name'] }, { model: Comment },
    {
      model: Comment,
      require: false,
      where: { status: 'active' },
      attributes: ['id', 'comment', 'createdAt']

    }
    ],

  })

  res.status(200).json({
    status: 'success',
    data: {
      posts,
    },
  });
});

const createPost = catchAsync(async (req, res, next) => {

  const { title, content } = req.body
  const { sessionUser } = req;

  const newPost = await Post.create({
    title,
    content,
    userId: sessionUser.id,
  })

  //Create firebase reference

  const [originalName, ext] = req.file.originalname.split('.') // -> [goku-ultra-instinto.jpg]

  const filename = `${originalName}-${Date.now()}.${ext}`;
  const imgRef = ref(storage, filename);

  //upload image to firebase
  const result = await uploadBytes(imgRef, req.file.buffer)

  console.log(result);

  res.status(201).json({
    status: 'success',
    data: { newPost }
  });
})

const updatePost = catchAsync(async (req, res, next) => {
  const { title, content } = req.body

  const { post } = req

  await post.update({ title, content })

  res.status(200).json({
    status: 'success',
    data: { post },
  })
})

const deletePost = catchAsync(async (req, res, next) => {
  const { post } = req;

  await post.uptdate({ status: 'deleted' })

  res.status(200).json({
    status: 'succes'
  })
})

module.exports = {
  getAllPosts,
  createPost,
  updatePost,
  deletePost
}