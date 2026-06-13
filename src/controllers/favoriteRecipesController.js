import createHttpError from 'http-errors';
import { Recipe } from '../models/recipe.js';
import { User } from '../models/user.js';

// GET /api/recipes/favorites
// Приватний ендпоінт — отримання улюблених рецептів поточного користувача
export const getFavoriteRecipes = async (req, res, next) => {
  try {
    const { _id } = req.user;

    // Пагінація
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    // Знаходимо юзера щоб отримати його список favorites
    const user = await User.findById(_id);
    if (!user) {
      throw createHttpError(401, 'User not found');
    }

    // Дістаємо масив id рецептів з favorites
    // favorites це [{ recipeId: ObjectId }]
    const favoriteIds = user.favorites.map((f) => f.recipeId);

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
