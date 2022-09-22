const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
//models
const { User } = require('../models/user.model')

//utils

const { catchAsync } = require('../utils/catchAsync.util')
const { AppError } = require('../utils/appError.util')
dotenv.config({ path: '../config.env' })



const protectSession = catchAsync(async (req, res, next) => {
  //get token console.log(req.headers)
  let token;

  if (req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    //extract token
    //req.headers.authorization = 'Bearer token'

    token = req.headers.authorization.split(' ')[1] // -> [Bearer, token]
  }
  //chek if the token was sent or not
  if (!token) {
    return next(new AppError('The token was invalid', 403))
  }
  //verify the token
  const decoded = jwt.verify(token, process.env.JWT_SECRET) //revisa si el token expiró o no, va a revisar si tiene la firma que se supone que debe tener

  console.log(decoded);


  //verify token's owner
  const user = await User.findOne({ where: { id: decoded.id, status: 'active' } })
  if (!user) {
    return next(new AppError('The owner of the session is no longer active', 403))
  }
  //Grant 
  req.sessionUser = user;
  next();

})
//Create a middleware to protect the users accounts

const protectUsersAccount = (req, res, next) => {
  //Check the sessionUser to compare to the one that wants to be updated/deleted
  const { sessionUser, user } = req;
  //If the users (ids) don't match, send an error, otherwise continue
  if (sessionUser.id !== user.id) {
    return res.status(403).json({
      status: 'error',
      message: 'You are not the owner of this account'
    })
  }
  //if the ids match, grant access
  next()
}

//Create middleware that only grants access to admin users

const adminAccess = (req, res, next) => {
  const { sessionUser } = req
  if (sessionUser.role !== 'admin') {
    return next(new AppError('You do not have the access level for this data', 403))
  }
  next()
}
module.exports = {
  protectSession,
  protectUsersAccount,
  adminAccess
}