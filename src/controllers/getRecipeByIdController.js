import createHttpError from 'http-errors';
import { Recipe } from '../models/recipe.js';

export const getRecipeById = async (req, res) => {
  const { recipeId } = req.params;
  const recipe = await Recipe.findOne({ _id: recipeId });

  if (!recipe) {
    throw createHttpError(404, 'Recipe not found');
  }
  res.status(200).json(recipe);
};
