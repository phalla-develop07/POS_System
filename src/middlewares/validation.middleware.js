const { AppError } = require('../core/errors/AppError');

function validateBody(requiredFields) {
  return (req, _res, next) => {
    const missing = requiredFields.filter((field) => req.body?.[field] === undefined || req.body?.[field] === '');

    if (missing.length > 0) {
      return next(new AppError(`Missing fields: ${missing.join(', ')}`, 400));
    }

    return next();
  };
}

module.exports.validateBody = validateBody;
