import { AppError } from '../../../core/errors/AppError';
import { comparePassword, hashPassword } from '../../../core/utils/hashPassword';
import { generateToken } from '../../../core/utils/generateToken';
import { RoleList, Roles } from '../../../constants/roles';
import { AuthRepository } from '../repositories/AuthRepository';
import type { User } from '../models/User';

export class AuthService {
  authRepository: AuthRepository;

  constructor(authRepository = new AuthRepository()) {
    this.authRepository = authRepository;
  }

  async register(email: string, password: string, role = Roles.EMPLOYEE) {
    const existingUser = await this.authRepository.findByEmail(email);

    if (existingUser) {
      throw new AppError('Email already exists', 409);
    }

    const normalizedRole = String(role).trim().toUpperCase();

    if (!RoleList.includes(normalizedRole as (typeof RoleList)[number])) {
      throw new AppError('Invalid role', 400);
    }

    const passwordHash = await hashPassword(password);

    const user = await this.authRepository.createUser({
      email,
      passwordHash,
      role: normalizedRole
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };
  }

  async login(email: string, password: string) {
    const user = await this.authRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    };
  }
}
