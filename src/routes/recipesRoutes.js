// Маршрути для рецептів

import { Router } from 'express';
import { celebrate } from 'celebrate';

// Імпорт схем валідації
import {
  getRecipesSchema,
  getRecipesByIdSchema,
  createRecipeSchema,
} from '../validations/recipeValidation.js';

// Імпорт контролерів
import { getAllRecipes } from '../controllers/recipesSearchController.js';
import { getRecipeById } from '../controllers/recipesDetailsController.js';
import { createRecipe } from '../controllers/recipesMyCreateController.js';
import { getMyRecipes } from '../controllers/recipesMyController.js';
import { addFavorites } from '../controllers/recipesFavoritesAddController.js';
import { deleteFavorites } from '../controllers/recipesFavoritesDeleteController.js';
import { getFavoriteRecipes } from '../controllers/recipesFavoritesController.js';
import { deleteMyRecipeById } from '../controllers/recipesMyDeleteController.js';

// Імпорт middleware
import { authenticate } from '../middleware/authenticate.js';
import { upload } from '../middleware/multer.js';

// Створення роутеру
const router = Router();

// БЛОК ОБРАНОГО (FAVORITES)
// GET  /recipes/favorites - Отримання списку улюблених рецептів
router.get('/recipes/favorites', authenticate, celebrate(getRecipesSchema), getFavoriteRecipes);
// POST  /recipes/favorites - Додавання рецепту у список улюблених рецептів
router.post('/recipes/favorites/:recipeId', authenticate, addFavorites);
// DELETE  /favorites - Видалення рецепту зі списку улюблених рецептів
router.delete('/recipes/favorites/:recipeId', authenticate, deleteFavorites);

// GET  /recipes/my - Отримання списку своїх рецептів
router.get('/recipes/my', authenticate, celebrate(getRecipesSchema), getMyRecipes);

// GET  /recipes - Отримання списку всіх рецептів
router.get('/recipes', celebrate(getRecipesSchema), getAllRecipes);

// POST /api/recipes - Створення власного рецепту
// upload.single, щоб дозволити створення без фото
router.post(
  '/recipes',
  authenticate,
  (req, res, next) => {
    upload.single('image')(req, res, (err) => {
      if (err) return next(err);
      next();
    });
  },
  celebrate(createRecipeSchema),
  createRecipe,
);

// GET  /recipes/:recipeId - Отримання рецепту за Id
router.get('/recipes/:recipeId', celebrate(getRecipesByIdSchema), getRecipeById);

// DELETE  /recipes/:recipeId - Видалення рецепту за Id
router.delete(
  '/recipes/:recipeId',
  authenticate,
  celebrate(getRecipesByIdSchema),
  deleteMyRecipeById,
);

// Експорт роутера
export default router;
