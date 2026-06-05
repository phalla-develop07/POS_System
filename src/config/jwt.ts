import type { Secret, SignOptions } from 'jsonwebtoken';
import { env } from './env';

export const jwtConfig: { secret: Secret; expiresIn: SignOptions['expiresIn'] } = {
  secret: env.JWT_SECRET,
  expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn']
};
