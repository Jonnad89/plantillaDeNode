//Models

const { User } = require('../models/user.model')
const { catchAsync } = require('../utils/catchAsync.util')
const { AppError } = require('../utils/appError.util')
const userExists = catchAsync(async (req, res, next) => {
  const { id } = req.params
  // Check if user exists before deletion
  const user = await User.findOne({
    attributes:
      { exclude: ['password'] },
    where: { id }
  })

  //If user doesn't existm, send error message
  if (!user) {
    return next(new AppError('User not found', 404))
  }
  // req.anyPropName= 'anyValue' esta propiedad puede tener cualquier nombre por ejemplo req.user
  req.user = user;
  next();
})

module.exports = {
  userExists
}