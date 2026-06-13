// ===========================================================================================
// Контролер recipesFavoritesAddController - для додавання рецепту до списку улюблених
// -------------------------------------------------------------------------------------------

// Імпорт функції для створення помилок з пакету http-errors.
// Він дозволяє створювати помилки з потрібним статусом і повідомленням.
import createHttpError from 'http-errors';

// Імпорт моделей
import { Recipe } from '../models/recipe.js';
import { User } from '../models/user.js';

// GET /recipes/favorites
// Приватний ендпоінт — отримання улюблених рецептів поточного користувача
export const getFavoriteRecipes = async (req, res, next) => {
  try {
    // Деструктуризація id користувача (приходить в запиті)
    const { _id } = req.user;

    // Пагінація
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Знаходимо користувача, щоб отримати його список favorites
    const user = await User.findById(_id);
    // Якщо користувача немає - помилка
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    // Дістаємо масив id рецептів з favorites
    // favorites це [{ recipeId: ObjectId }]
    const favoriteIds = user.favorites.map((f) => f.recipeId);
    console.log('favoriteIds', favoriteIds);

    // Знаходимо рецепти по цим id з пагінацією
    const [recipes, total] = await Promise.all([
      Recipe.find({ _id: { $in: favoriteIds } })
        .skip(skip)
        .limit(limit),
      Recipe.countDocuments({ _id: { $in: favoriteIds } }),
    ]);

    res.status(200).json({
      status: 200,
      data: recipes,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    next(error);
  }
};
