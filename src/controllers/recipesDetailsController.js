// ===========================================================================================
// Контролер recipesDetailsController - для пошуку рецепта за id
// -------------------------------------------------------------------------------------------

// Імпорт функції для створення помилок з пакету http-errors.
// Він дозволяє створювати помилки з потрібним статусом і повідомленням.
import createHttpError from 'http-errors';

// Імпорт моделей
import { Recipe } from '../models/recipe.js';

// GET /recipes/:recipeId - отримання детальної інформації про рецепт за його id
export const getRecipeById = async (req, res, next) => {
  try {
    // Деструктуризація параметра з Id
    const { recipeId } = req.params;
    // Пошук рецепта
    const recipe = await Recipe.findOne({ _id: recipeId });
    // Якщо рецепта не знайшли - помилка
    if (!recipe) {
      throw createHttpError(404, 'Recipe not found');
    }

    // Відповідь сервера зі статусом 200 та рецептом
    res.status(200).json({
      message: 'Recipe Information',
      data: recipe,
    });
  } catch (error) {
    next(error);
  }
};
