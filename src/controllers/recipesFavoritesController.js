// ===========================================================================================
// Контролер recipesFavoritesAddController - для отримання улюблених рецептів
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

    // Пагінація - отримання з запиту
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 12;

    // Розрахунок кількості запитів, які треба пропустити
    const skip = (page - 1) * perPage;

    // Знаходимо користувача, щоб отримати його список favorites
    const user = await User.findById(_id);
    // Якщо користувача немає - помилка
    if (!user) {
      throw createHttpError(404, 'User not found');
    }

    // Дістаємо масив id рецептів з favorites
    // favorites це [{ recipeId: ObjectId }]
    const favoriteIds = user.favorites.map((f) => f.recipeId);

    // Знаходимо рецепти по цим id з пагінацією
    const [totalItems, recipes] = await Promise.all([
      Recipe.countDocuments({ _id: { $in: favoriteIds } }),
      Recipe.find({ _id: { $in: favoriteIds } })
        .skip(skip)
        .limit(perPage),
    ]);

    // Розрахунок загальної кількості сторінок (округлення вгору)
    const totalPages = Math.ceil(totalItems / perPage);

    // У разі вдалої обробки запиту відповідь сервера має бути зі статусом 200
    // та містити об’єкт із наступними властивостями:
    //    page - поточна сторінка
    //    perPage - кількість елементів в одній сторінці
    //    totalItems - загальна кількість рецептів в колекції
    //    totalPages - загальна кількість сторінок
    //    recipes - масив рецептів
    res.status(200).json({
      message: 'List of favorite recipes',
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
