const jwt = require('jsonwebtoken');
const { getConfValue } = require('../utils/confService');
const crypto = require('crypto-js');

exports.createAccessToken = (id) => {
  const token = jwt.sign({ id }, getConfValue('JWT_SECRET_KEY'), {
    expiresIn: 1 * getConfValue('JWT_EXPIRY'),
  });
  return token;
};

exports.decodeAccessToken = (token) => {
  return jwt.verify(token, getConfValue('JWT_SECRET_KEY'));
};

exports.createPasswordResetToken = (id) => {
  const resetToken = jwt.sign({ id }, getConfValue('JWT_SECRET_KEY'));
  const encryptedToken = this.encryptToken(resetToken);
  console.log({encryptedToken});
  return { resetToken, encryptedToken };
};

exports.encryptToken = (token) => {
  return crypto.HmacSHA1(token, getConfValue('SECRET_KEY')).toString();
};
