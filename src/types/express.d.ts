import type { JwtPayload } from 'jsonwebtoken';

export interface AuthUserPayload extends JwtPayload {
  userId: number;
  email?: string | null;
  role?: string | null;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthUserPayload;
  }
}
