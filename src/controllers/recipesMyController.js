// ===========================================================================================
// Контролер recipesMyController - для отримання власних рецептів
// -------------------------------------------------------------------------------------------

// Імпорт функції для створення помилок з пакету http-errors.
// Він дозволяє створювати помилки з потрібним статусом і повідомленням.
import createHttpError from 'http-errors';

// Імпорт моделей
import { Recipe } from '../models/recipe.js';

// GET /recipes/my
export const getMyRecipes = async (req, res, next) => {
  try {
    // Отримуємо параметри пагінації з query параметрів
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;

    // Отримуємо id користувача з req.user._id
    const userId = req.user._id;

    // Обчислюємо кількість документів для пропуску
    const skip = (page - 1) * limit;

    // Знаходимо всі рецепти, де owner дорівнює userId
    const recipes = await Recipe.find({ owner: userId })
      .skip(skip)
      .limit(limit);

    // Отримуємо загальну кількість рецептів користувача
    const totalItems = await Recipe.countDocuments({ owner: userId });

    // Обчислюємо загальну кількість сторінок
    const totalPages = Math.ceil(totalItems / limit);

    // У разі вдалої обробки запиту відповідь сервера має бути зі статусом 200
    res.status(200).json({
      status: 200,
      message: 'Successfully found own recipes!',
      data: recipes,
      totalPages,
      currentPage: page,
      totalItems,
    });
  } catch (error) {
    next(error);
  }
};
