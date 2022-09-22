const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
//Models

const { User } = require('../models/user.model')
//utils
const { catchAsync } = require('../utils/catchAsync.util')
const { AppError } = require('../utils/appError.util')
dotenv.config({ path: '../config.env' })

const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.findAll({
    where: { status: 'active' },
    attributes: { exclude: ['password'] },
  })


  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});
const createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  if (role !== 'admin' && role !== 'normal') {
    return next(new AppError('Invalid role', 400))
  }

  //Encrypt the password
  const salt = await bcrypt.genSalt(12)
  const hashedPassword = await bcrypt.hash(password, salt)

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role
  });

  //remove password from response
  newUser.password = undefined;

  //201 -< Success and a resourse has been created
  res.status(201).json({
    status: 'success',
    data: { newUser },
  });
})

const updatedUser = catchAsync(async (req, res) => {
  const { name } = req.body;
  const { user } = req


  await user.update({ name })

  res.status(200).json({
    status: 'success',
    data: { user }
  })
})

const deleteUser = async (req, res) => {
  try {
    const { user } = req;

    await user.update({ status: 'deleted' })

    res.status(204).json({ status: 'success' })
  } catch (error) {
    console.log(error)
  }
}

const login = catchAsync(async (req, res, next) => {

  const { email, password } = req.body

  const user = await User.findOne({
    where: { email, status: 'active' }
  })
  if (!user || (await bcrypt.compare(password, user.password))) {
    return next(new AppError('Wrong credentials', 400));
  }

  user.password = undefined

  const token = jwt.sign({ id: user.id },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    });

  res.status(200).json({
    status: 'success',
    data: { user, token },
  })
})

module.exports = {
  getAllUsers,
  createUser,
  updatedUser,
  deleteUser,
  login,
}

