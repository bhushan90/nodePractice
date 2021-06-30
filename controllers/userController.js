const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const CustomError = require('../utils/errorMiddleware');

const { omitParams } = require('../utils/constants');

exports.getAllUsers = catchAsync(async (_, res) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    data: {
      users,
      count: users.length || 0,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const { user } = req;

  if (!user)
    return next(
      new CustomError('401', 'You can not perform this action. token missing.')
    );

  if (req.body.password)
    return next(
      new CustomError('400', 'Password can not be change using this route.')
    );

  const filteredBody = omitParams(
    req.body,
    'role',
    'password',
    'passwordChangedAt'
  );

  const newUser = await User.findByIdAndUpdate(user._id, filteredBody, {
    new: true,
  });
  return res.status(200).json({
    status: 'success',
    data: {
      newUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const { user } = req;

  if (!user)
    return next(
      new CustomError('401', 'You can not perform this action. token missing.')
    );

  await User.findByIdAndUpdate(
    user._id,
    { isActive: false },
    {
      new: true,
    }
  );
  return res.status(204).json({
    status: 'success',
  });
});

exports.createUser = async (req, res) => {
  const body = req.body || {};
  const user = await User.create(body);

  return res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
};

exports.getUserById = catchAsync(async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const user = await User.findById(id);

  if (!user) {
    throw new Error('User does not exist.');
  }
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.deleteUser = async (req, res) => {
  const id = +req.params.id;
  const user = await User.findOneAndDelete(id);

  if (!user) {
    throw new Error('Invalid user id');
  }
  return res.status(204).json({
    status: 'success',
  });
};

// exports.checkBody = (req, res, next) => {
//   const body = req.body;
//   if (!body.name || !body.skills || !Array.isArray(body.skills)) {
//     return res.status(400).json({
//       status: 'error',
//       message: 'Name and skills are required and skills should be in array',
//     });
//   }
//   next();
// };
