const express = require('express')

//Controllers
const {
  getAllUsers,
  createUser,
  updatedUser,
  deleteUser,
  login
} = require('../controllers/users.controller')


//Middlewares
const { userExists } = require('../middlewares/users.middleware')
const {
  protectSession,
  protectUsersAccount,
  adminAccess,
} = require('../middlewares/auth.middleware')
const { createUserValidators } = require('../middlewares/validators.middlewares')

const usersRouter = express.Router();

usersRouter.post('/', createUser);

usersRouter.post('/login', login)


// Protecting below endpoints
usersRouter.use(protectSession);

usersRouter.get('/', getAllUsers);

usersRouter.patch('/:id', userExists, protectUsersAccount, updatedUser);

usersRouter.delete('/:id', userExists, protectUsersAccount, deleteUser);

module.exports = { usersRouter } 