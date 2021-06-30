const { decodeAccessToken } = require('../../utils/jwtService');
const User = require('../../models/user');
const catchAsync = require('../../utils/catchAsync');
const CustomError = require('../../utils/errorMiddleware');

exports.protectRoute = catchAsync(async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization)
    return next(
      new CustomError(
        '401',
        'You do not have permission to perform this action. please logged in and try again.'
      )
    );
  const toekn = authorization.split(' ')[1];
  const decodedValue = decodeAccessToken(toekn);

  //check if userExist and token is not expired.
  const { id: _id, exp: tokenExpiry } = decodedValue;
  const user = await User.findById(_id);

  if (!user) return next(new CustomError('401', 'User does not exists.'));

  const currentTime = parseInt(new Date().getTime() / 1000);
  const isTokenExpired = tokenExpiry < currentTime;
  if (isTokenExpired) return next(new CustomError('401', 'Token is expired.'));

  req.user = user;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    const { user } = req;
    if (!user) return next(new CustomError(401, 'You are not logged in.'));

    if (!roles.includes(user.role))
      return next(
        new CustomError(401, 'You do not have permission to do this operation')
      );
    next();
  };
};
