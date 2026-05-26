const { AppError } = require('../../../core/errors/AppError');

function validateCreateCategory(req, _res, next) {
  const { name } = req.body || {};

  if (!name) {
    return next(new AppError('Name is required', 400));
  }

  return next();
}

function validateUpdateCategory(req, _res, next) {
  const { name, description, isActive } = req.body || {};

  if (name === undefined && description === undefined && isActive === undefined) {
    return next(new AppError('At least one field is required', 400));
  }

  return next();
}

module.exports = {
  validateCreateCategory,
  validateUpdateCategory
};
