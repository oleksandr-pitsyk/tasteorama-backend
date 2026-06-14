// ===========================================================================================
// Контролер recipesFavoritesDeleteController - для видалення рецепту зі списку улюблених
// -------------------------------------------------------------------------------------------

// Імпорт функції для створення помилок з пакету http-errors.
// Він дозволяє створювати помилки з потрібним статусом і повідомленням.
import createHttpError from 'http-errors';

// Імпорт моделей
import { Recipe } from '../models/recipe.js';
import { User } from '../models/user.js';

// Контролер Delete Favorites
export const deleteFavorites = async (req, res, next) => {
  try {
    // Деструктуризація параметру - id рецепта
    const { recipeId } = req.params;
    // Деструктуризація id користувача (приходить в запиті)
    const { _id } = req.user;

    // Пошук в колекції рецептів за id
    const findRecipe = await Recipe.findById(recipeId);
    // Якщо в колекції немає рецепта - помилка
    if (!findRecipe) {
      throw createHttpError(404, 'Recipe not in Favorites');
    }

    // Пошук у користувача рецепта в улюблених та перевірка наявності
    if (!req.user.favorites.some((f) => f.recipeId.toString() === recipeId)) {
      // Якщо рецепта немає у колистувача в властивості favorites
      throw createHttpError(400, 'Recipe not in favorites');
    }

    // Видалення з улюблених рецепта за id
    await User.findByIdAndUpdate(_id, { $pull: { favorites: { recipeId: recipeId } } });

    // Повернення успішної відповіді
    res.status(200).json({ message: 'Recipe removed from favorites' });
  } catch (error) {
    next(error);
  }
};
