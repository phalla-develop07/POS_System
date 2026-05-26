const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../../config/jwt');

function generateToken(payload) {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn
  });
}

module.exports.generateToken = generateToken;
