// ===========================================================================================
// Контролер recipesFavoritesAddController - для додавання рецепту до списку улюблених
// -------------------------------------------------------------------------------------------

// Імпорт функції для створення помилок з пакету http-errors.
// Він дозволяє створювати помилки з потрібним статусом і повідомленням.
import createHttpError from 'http-errors';

// Імпорт моделей
import { Recipe } from '../models/recipe.js';
import { User } from '../models/user.js';

// POST - /recipes/favorites/:recipeId
export const addFavorites = async (req, res, next) => {
  try {
    // Деструктуризація параметру - id рецепта
    const { recipeId } = req.params;
    // Деструктуризація id користувача (приходить в запиті)
    const { _id } = req.user;

    // Пошук в колекції рецептів за id
    const findRecipe = await Recipe.findById(recipeId);

    // Якщо в колекції немає рецепта - помилка
    if (!findRecipe) {
      throw createHttpError(404, 'Recipe not found');
    }

    // Якщо цей рецепт уже є в користувача
    if (req.user.favorites.some((f) => f.recipeId.toString() === recipeId)) {
      throw createHttpError(400, 'Recipe already in favorites');
    }

    // Додавання id рецепта у властивість favorites (масив) у поточного користувача
    await User.findByIdAndUpdate(_id, { $push: { favorites: { recipeId: recipeId } } });

    // Повернення успішної відповіді
    res.status(200).json({ message: 'Recipe added to favorites' });
  } catch (error) {
    next(error);
  }
};
