import { Recipe } from '../models/recipe.js';
import { Ingredient } from '../models/ingredient.js';

export const getAllRecipes = async (req, res) => {
  const { page = 1, perPage = 1, category, ingredients, search } = req.query;

  const skip = (page - 1) * perPage;

  const recipesQuery = Recipe.find();

  if (search) {
    recipesQuery.where({
      title: { $regex: search, $options: 'i' },
    });
  }

  if (category) {
    recipesQuery.where('category').equals(category);
  }

  const ingredient = await Ingredient.findOne({ name: ingredients });
  if (ingredient) {
    recipesQuery.where('ingredients.id').equals(ingredient._id);
  }

  const [totalItems, recipes] = await Promise.all([
    recipesQuery.clone().countDocuments(),
    recipesQuery.skip(skip).limit(perPage),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  res.status(200).json({
    page,
    perPage,
    totalItems,
    totalPages,
    recipes,
  });
};
