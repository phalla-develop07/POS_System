import jwt from 'jsonwebtoken';
import { jwtConfig } from '../../config/jwt';

export function generateToken(payload: string | object | Buffer) {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn
  });
}
