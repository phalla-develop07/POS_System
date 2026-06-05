const { AuthService } = require('../services/AuthService');
const { successResponse } = require('../../../core/utils/response');

class AuthController {
  constructor(authService = new AuthService()) {
    this.authService = authService;
  }

  async register(req, res, next) {
    try {
      const { email, password, role } = req.body;
      const result = await this.authService.register(email, password, role);
      return successResponse(res, result, 'User registered', 201);
    } catch (error) {
      return next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      return successResponse(res, result, 'Login successful');
    } catch (error) {
      return next(error);
    }
  }
}

module.exports.AuthController = AuthController;
