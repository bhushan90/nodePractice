const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const {
  createAccessToken,
  createPasswordResetToken,
  encryptToken,
} = require('../utils/jwtService');

const CustomError = require('../utils/errorMiddleware');
const { sendEmail } = require('../utils/services/emailService');
const { composeUrl } = require('../utils/constants');

exports.signUp = catchAsync(async (req, res) => {
  const user = await User.create(req.body);
  const token = createAccessToken(user._id);
  return res.status(200).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // Check If email and password are in req
  if (!email || !password) {
    return new next(new CustomError(404, 'Email and passowrd is required.'));
  }

  const user = await User.findSingleUserWithPassword({ email });

  // check if there is user with email and password is valid
  if (!user || !(await user.validatePassword(password, user.password)))
    return new next(new CustomError(401, 'Invalid Email or passowrd'));

  // create access token
  const token = createAccessToken(user._id);

  return res.status(200).json({
    status: 'success',
    token,
  });
});

// Forgot password functionality

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new CustomError('400', 'Email is required.'));

  const user = await User.findOne({ email });
  if (!user) return next(new CustomError('400', 'Invalid email id.'));

  //create restToken
  const { resetToken, encryptedToken } = createPasswordResetToken(user._id);

  user.passwordResetToken = encryptedToken;
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = composeUrl(
    req,
    `api/v1/users/set-password/${resetToken}`
  );
  const html = `<p>your reset password link is <a href=${resetPasswordUrl}/>link</a></P>`;
  const subject = `Reset Your Password`;
  const emailObject = { reciever: email, html, subject };
  try {
    await sendEmail(emailObject);
  } catch (e) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new CustomError('404', 'Email service is not working.'));
  }

  res.status(200).json({
    status: 'success',
    data: {
      resetToken
    },
    message: 'The reset password link is sent on your email Id.',
  });
});

exports.setPassword = catchAsync(async (req, res, next) => {
  const { token: resetToken } = req.params;
  const { password, confirmPassword } = req.body;
  if (!password || !confirmPassword)
    return next(
      new CustomError('400', 'Password and confirm password are required.')
    );
  const encryptedToken = encryptToken(resetToken);

  const user = await User.findSingleUserWithPassword({
    passwordResetToken: encryptedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user)
    return next(new CustomError('401', 'Token is invalid or expired.'));

  user.password = password;
  user.confirmPassword = confirmPassword;

  await user.save();

  return res.status(200).json({
    status: 'success',
    data: {
      message: 'Password change successfully.',
    },
  });
});
