module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'server error';
  err.status = err.status || 'failed';

  res.status(err.statusCode).json({
    status: err.status,
    error: err.message,
  });
  next();
};
