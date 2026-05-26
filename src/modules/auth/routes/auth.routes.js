const { Router } = require('express');
const { AuthController } = require('../controllers/AuthController');
const { validateLogin, validateRegister } = require('../validators/auth.validator');

const router = Router();
const authController = new AuthController();

router.post('/register', validateRegister, authController.register.bind(authController));
router.post('/login', validateLogin, authController.login.bind(authController));

module.exports = router;
