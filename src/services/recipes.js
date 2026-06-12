// payload — це об’єкт з даними рецепта
// бере модель Recipe з файлу models/recipe.js
import { Recipe } from '../models/recipe.js';

// створюю функцію, яку потім викличе контролер
export const createRecipe = async (payload) => {
  // додає новий рецепт у MongoDB
  return Recipe.create(payload);
};
