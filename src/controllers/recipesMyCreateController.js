// ===========================================================================================
// POST /recipes - recipesMyCreateController - Створення власного рецепту
// ===========================================================================================

import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import createHttpError from 'http-errors';
import { Category } from '../models/category.js';
import * as recipesService from '../services/recipes.js';

// POST /recipes
export const createRecipe = async (req, res, next) => {
  try {
    let thumb = req.body.thumb ?? '';

    if (req.file) {
      const result = await saveFileToCloudinary(req.file.buffer, req.user._id);
      thumb = result.secure_url;
    }

    const ingredients =
      typeof req.body.ingredients === 'string'
        ? JSON.parse(req.body.ingredients)
        : req.body.ingredients;

    // ВИПРАВЛЕНИЙ ПОШУК КАТЕГОРІЇ:
    // Використовуємо trim() для видалення пробілів та $regex з 'i' для ігнорування регістру.
    // Тепер 'chicken', 'Chicken' або ' CHICKEN ' будуть працювати однаково успішно.
    const categoryName = req.body.category.trim();
    const category = await Category.findOne({
      name: { $regex: new RegExp(`^${categoryName}$`, 'i') },
    }).select('name');

    if (!category) {
      throw createHttpError(400, 'Invalid category');
    }

    const recipe = await recipesService.createRecipe({
      ...req.body,
      category: category.name, // Зберігаємо чисту назву з БД
      ingredients,
      thumb,
      owner: req.user._id,
    });

    res.status(201).json({ recipe });
  } catch (error) {
    next(error);
  }
};
