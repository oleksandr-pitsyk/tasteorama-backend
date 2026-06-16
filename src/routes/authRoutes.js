// ==========================================================================================
// Маршрути аутентифікації
// ==========================================================================================

// Express Router — об'єкт, який дозволяє групувати маршрути та їх обробники у логічні блоки.
import { Router } from 'express';

// Імпорт бібліотеки валідації
import { celebrate } from 'celebrate';

// Імпорт middleware перевірки аутентифікації
import { authenticate } from '../middleware/authenticate.js';

// Імпорт схем валідації
import { registerUserSchema, loginUserSchema } from '../validations/authValidation.js';

// Імпорт контролерів
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUserSession,
} from '../controllers/authController.js';

// Створення роутеру
const router = Router();

// POST /auth/register - Реєстрація нового користувача.
// ==========================================================================================
router.post('/api/auth/register', celebrate(registerUserSchema), registerUser);

// POST /auth/login - Логін зареєстрованого користувача (Вхід в систему).
// ==========================================================================================
router.post('/api/auth/login', celebrate(loginUserSchema), loginUser);

// POST /auth/logout - Виход користувача із системи.
// ==========================================================================================
router.post('/api/auth/logout', authenticate, logoutUser);

// POST /auth/refresh - Оновлення сесії за наявності refreshToken.
// ==========================================================================================
router.post('/api/auth/refresh', refreshUserSession);

// Експорт роутера
export default router;
