// =======================================================================================
// middleware authentificateRefresh
// ---------------------------------------------------------------------------------------

// Перевіряє наявність кукі refreshToken.
//    Якщо refreshToken відсутній — повертає через createHttpError помилку зі статусом 401 і повідомленням 'Missing access token'.
//    Якщо присутній — шукає у базі даних сесію за цим токеном. Якщо така сесія відсутня — повертає через createHttpError помилку зі статусом 401 і повідомленням 'Session not found';
// Перевіряє, чи не прострочений refreshToken.
// Якщо прострочений :
//    повертає через createHttpError помилку зі статусом 401 і повідомленням 'Access token expired';
// Якщо не прострочение :
//    Шукає користувача, пов’язаного з цією сесією.
//    Якщо такий користувач не знайдено — повертає через createHttpError помилку зі статусом 401 без повідомлення;
// У разі успіху додає об’єкт знайденого користувача в req.user і викликає next().
// =======================================================================================

import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const authentificateRefresh = async (req, res, next) => {
  // Отримуємо дані з кукі запиту
  const { sessionId, refreshToken } = req.cookies;

  // Перевіряємо наявність кукі

  if (!sessionId || !refreshToken) {
    throw createHttpError(401, 'Missing session credentials');
  }

  // Якщо все ок, шукаємо сесію
  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  // Якщо такої сесії нема, повертаємо помилку
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  // Перевіряємо термін дії refreshToken
  const isRefreshTokenExpired = session.refreshTokenValidUntil < new Date();

  // Якщо термін дії refreshToken закінчився
  if (isRefreshTokenExpired) {
    throw createHttpError(401, 'Refresh token expired');
  }

  // Якщо з токеном все добре і сесія існує, шукаємо користувача
  const user = await User.findById(session.userId);

  // Якщо користувача не знайдено
  if (!user) {
    throw createHttpError(401, '');
  }

  // Якщо користувач існує, додаємо його до запиту
  req.user = user;

  // Передаємо управління далі
  next();
};
