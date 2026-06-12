// Імпорт функції для створення помилок з пакету http-errors.
// Він дозволяє створювати помилки з потрібним статусом і повідомленням.
import createHttpError from 'http-errors';

// Імпорт моделі користувача User
import { User } from '../models/user.js';

// Імпорт моделі сесії Session
// import { Session } from '../models/session.js';

// Імпорт бібліотеки хешування паролів
import bcrypt from 'bcrypt';

// Імпорт функції створення сесії
import { createSession, setSessionCookies } from '../services/auth.js';

// =======================================================================================
// POST /auth/register - Реєстрація нового користувача.
// ---------------------------------------------------------------------------------------
// Дані приходять у тілі запиту - Тіло запиту має містити:
//    email — рядок, email, обов’язкове;
//    password — рядок, мінімум 8 символів, обов’язкове (на сервері хешується через bcrypt).
// ---------------------------------------------------------------------------------------
// Контролер registerUser :
//    Перевіряє, чи користувач із таким email вже існує. Якщо так — повертає через createHttpError помилку зі статусом 400 і повідомленням 'Email in use'
//    Хешує пароль за допомогою bcrypt
//    Створює нового користувача в базі
//    Створює нову сесію (createSession) і додає кукі (setSessionCookies) до відповіді
// У разі вдалої обробки запиту повертає відповідь зі статусом 201
// і об’єктом створеного користувача (без пароля завдяки методу схеми toJSON) — res.status(201).json(user).
// ---------------------------------------------------------------------------------------

export const registerUser = async (req, res) => {
  const { email, password, username } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(400, 'Email in use');
  }

  // Хешуємо пароль
  const hashedPassword = await bcrypt.hash(password, 10);

  // Створення користувача
  const newUser = await User.create({
    email: email,
    username: username,
    password: hashedPassword,
  });

  // Після реєстрації створюємо нову сесію для нового користувача.
  const newSession = await createSession(newUser._id);
  // Додаємо у відповідь 3 куки - Викликаємо, передаємо об'єкт відповіді та сесію
  setSessionCookies(res, newSession);

  // Відправляємо дані користувача (без пароля) у відповіді
  res.status(201).json(newUser);
};
