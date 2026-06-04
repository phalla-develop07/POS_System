const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config/jwt');
const { AppError } = require('../core/errors/AppError');

function authMiddleware(req, _res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized', 401));
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, jwtConfig.secret);
    req.user = payload;
    return next();
  } catch {
    return next(new AppError('Invalid or expired token', 401));
  }
}

module.exports.authMiddleware = authMiddleware;
