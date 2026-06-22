// ===========================================================================================
// DELETE  /recipes/:recipeId - recipesMyDeleteController - Видалення власного рецепту за Id
// ===========================================================================================

// Імпорт функції для створення помилок з пакету http-errors.
// Він дозволяє створювати помилки з потрібним статусом і повідомленням.
import createHttpError from 'http-errors';

// Імпорт моделей
import { Recipe } from '../models/recipe.js';

// DELETE  /recipes/:recipeId - Видалення власного рецепту за Id
export const deleteMyRecipeById = async (req, res, next) => {
  try {
    // Деструктуризація параметра з Id
    const { recipeId } = req.params;
    // Пошук рецепта за id
    const recipe = await Recipe.findOne({ _id: recipeId });
    // Якщо рецепта не знайшли - помилка
    if (!recipe) {
      throw createHttpError(404, 'Recipe not found');
    }

    // Видалення рецепта
    const deleted = await Recipe.deleteOne({ _id: recipeId });
    // Якщо не вдалося видалити рецепт
    if (!deleted) {
      throw createHttpError(400, 'Recipe cannot be deleted.');
    }

    // Відповідь сервера зі статусом 200 та інформацію про видалений рецепт
    res.status(200).json({ recipe });
  } catch (error) {
    next(error);
  }
};
