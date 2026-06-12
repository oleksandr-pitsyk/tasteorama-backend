// ===========================================================================================
// POST /recipes - Створення власного рецепту
// -------------------------------------------------------------------------------------------
// Контролер — функція, яка відповідає за обробку запиту і формування відповіді.
// ===========================================================================================

// Імпорт функції запису файла в Cloudinary
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import * as recipesService from '../services/recipes.js';

export const createRecipe = async (req, res) => {
  let thumb = req.body.thumb ?? '';

  if (req.file) {
    const result = await saveFileToCloudinary(req.file.buffer, req.user._id);
    thumb = result.secure_url;
  }

  const ingredients =
    typeof req.body.ingredients === 'string'
      ? JSON.parse(req.body.ingredients)
      : req.body.ingredients;

  const recipe = await recipesService.createRecipe({
    ...req.body,
    ingredients,
    thumb,
    owner: req.user._id,
  });

  res.status(201).json({
    message: 'Recipe created successfully',
    recipe,
  });
};
