// Маршрути для рецептів

import { Router } from 'express';
import { celebrate } from 'celebrate';

// Імпорт схем валідації
import { getRecipesSchema, createRecipeSchema } from '../validations/recipeValidation.js';

// Імпорт контролерів
import { getAllRecipes } from '../controllers/recipesSearchController.js';
import { getRecipeById } from '../controllers/recipesDetailsController.js';
import { createRecipe } from '../controllers/recipesMyCreateController.js';
import { getMyRecipes } from '../controllers/recipesMyController.js';
import { addFavorites } from '../controllers/recipesFavoritesAddController.js';
import { deleteFavorites } from '../controllers/recipesFavoritesDeleteController.js';
import { getFavoriteRecipes } from '../controllers/recipesFavoritesController.js';

// Імпорт middleware
import { authenticate } from '../middleware/authenticate.js';
import { upload } from '../middleware/multer.js';

// Створення роутеру
const router = Router();

// БЛОК ОБРАНОГО (FAVORITES)
router.get('/favorites', authenticate, getFavoriteRecipes);
router.post('/favorites/:recipeId', authenticate, addFavorites);
router.delete('/favorites/:recipeId', authenticate, deleteFavorites);

// ІНШІ МАРШРУТИ РЕЦЕПТІВ
router.get('/', celebrate(getRecipesSchema), getAllRecipes);

// POST /api/recipes - Створення власного рецепту
// upload.single, щоб дозволити створення без фото
router.post(
  '/',
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

router.get('/my', authenticate, celebrate(getRecipesSchema), getMyRecipes);

// ДИНАМІЧНІ МАРШРУТИ
router.get('/:recipeId', getRecipeById);

// Експорт роутера
export default router;
