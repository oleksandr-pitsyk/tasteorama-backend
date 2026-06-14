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
    const perPage = parseInt(req.query.perPage) || 12;

    // Отримуємо id користувача з req.user._id
    const userId = req.user._id;

    // Обчислюємо кількість документів для пропуску
    const skip = (page - 1) * perPage;

    // Знаходимо всі рецепти, де owner дорівнює userId
    const recipes = await Recipe.find({ owner: userId }).skip(skip).limit(perPage);

    // Отримуємо загальну кількість рецептів користувача
    const totalItems = await Recipe.countDocuments({ owner: userId });

    // Якщо рецепти не знайдено
    if (totalItems === 0) {
      throw createHttpError(404, 'Recipes not found');
    }

    // Обчислюємо загальну кількість сторінок
    const totalPages = Math.ceil(totalItems / perPage);

    // У разі вдалої обробки запиту відповідь сервера має бути зі статусом 200
    res.status(200).json({
      message: 'List of my own recipes',
      page,
      perPage,
      totalItems,
      totalPages,
      data: recipes,
    });
  } catch (error) {
    next(error);
  }
};
