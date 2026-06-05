import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validateLogin, validateRegister } from '../validators/auth.validator';

const router = Router();
const authController = new AuthController();

router.post('/register', validateRegister, authController.register.bind(authController));
router.post('/login', validateLogin, authController.login.bind(authController));

export default router;
