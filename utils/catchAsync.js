module.exports = (asyncFunc) => (req, res, next) =>
  asyncFunc(req, res, next).catch(next);
