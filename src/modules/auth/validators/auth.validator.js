const { AppError } = require('../../../core/errors/AppError');

function validateLogin(req, _res, next) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return next(new AppError('Email and password are required', 400));
  }

  return next();
}

function validateRegister(req, _res, next) {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return next(new AppError('Email and password are required', 400));
  }

  return next();
}

module.exports = {
  validateLogin,
  validateRegister
};
