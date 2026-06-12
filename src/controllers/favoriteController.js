import createHttpError from "http-errors";
import { Recipe } from '../models/recipe.js';
import { User } from '../models/user.js';


// Add to Favorites
export const addToFavorites = async (req, res, next) => {
  try {
    const { id } = req.params;
  const { _id } = req.user;

  const findRecipe = await Recipe.findById(id);

  if (!findRecipe) {
    throw createHttpError(404, "Recipe not found");
  }

  if(req.user.favorites.some(f => f.recipeId.toString() === id)) {
    throw createHttpError(400, "Recipe already in favorites");
  }

  await User.findByIdAndUpdate(_id, { $push: { favorites: {recipeId: id} } });
  res.status(200).json({ message: "Recipe added to favorites" });
  } catch (error) {
    next(error);
  }
};


// Delete Favorites
export const deleteToFavorites = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { _id } = req.user;

    const findRecipe = await Recipe.findById(id);
    if (!findRecipe) {
      throw createHttpError(404, "Recipe not in Favorites");
    }

     if(!req.user.favorites.some(f => f.recipeId.toString() === id)) {
      throw createHttpError(400, "Recipe not in favorites");
     }

    await User.findByIdAndUpdate(_id, { $pull: { favorites: {recipeId: id} } });
    res.status(200).json({ message: "Recipe removed from favorites" });
  } catch (error) {
    next(error);
  }
};
