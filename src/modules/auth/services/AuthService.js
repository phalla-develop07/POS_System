const { AppError } = require('../../../core/errors/AppError');
const { comparePassword, hashPassword } = require('../../../core/utils/hashPassword');
const { generateToken } = require('../../../core/utils/generateToken');
const { RoleList, Roles } = require('../../../constants/roles');
// const { Roles } = require('../../../constants/roles');
const { AuthRepository } = require('../repositories/AuthRepository');

class AuthService {
  constructor(authRepository = new AuthRepository()) {
    this.authRepository = authRepository;
  }

  async register(email, password, role = Roles.EMPLOYEE) {
    const existingUser = await this.authRepository.findByEmail(email);

    if (existingUser) {
      throw new AppError('Email already exists', 409);
    }

    const normalizedRole = String(role).trim().toUpperCase();

    if (!RoleList.includes(normalizedRole)) {
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

  async login(email, password) {
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

module.exports.AuthService = AuthService;
