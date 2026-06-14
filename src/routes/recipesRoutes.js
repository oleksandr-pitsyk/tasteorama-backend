// ==========================================================================================
// Маршрути для рецептів
// ==========================================================================================

// Express Router — об'єкт, який дозволяє групувати маршрути та їх обробники у логічні блоки.
import { Router } from 'express';

// Імпорт бібліотеки валідації
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

// Імпорт middleware перевірки аутентифікації
import { authenticate } from '../middleware/authenticate.js';

// Імпорт multer для завантаження файлів
import { upload } from '../middleware/multer.js';

// Створення роутеру
const router = Router();

// ===========================================================================================
// GET /recipes - Пошук рецептів за категорією, інгредієнтом, входженням пошукового значення в назву рецепту (з урахуванням логіки пагінації)
// Публічний маршрут
// -------------------------------------------------------------------------------------------
router.get('/recipes', celebrate(getRecipesSchema), getAllRecipes);

// POST /recipes/favorites/:recipeId
// Додавання рецепту до списку улюблених
// Приватний маршрут
// -------------------------------------------------------------------------------------------
router.post('/recipes/favorites/:recipeId', authenticate, addFavorites);

// ===========================================================================================
// DELETE /recipes/favorites/:recipeId
// Видалення рецепту зі списку улюблених
// Приватний маршрут
// -------------------------------------------------------------------------------------------
router.delete('/recipes/favorites/:recipeId', authenticate, deleteFavorites);

// ===========================================================================================
// POST /recipes - Створення власного рецепту
// Приватний маршрут
// -------------------------------------------------------------------------------------------
router.post(
  '/recipes/my',
  authenticate,
  upload.single('thumb'),
  celebrate(createRecipeSchema),
  createRecipe,
);

// ===========================================================================================
// GET - /recipes/my - Отримання власних рецептів
// Приватний маршрут
// -------------------------------------------------------------------------------------------
router.get('/recipes/my', authenticate, getMyRecipes);

// ===========================================================================================
// GET /recipes/favorites - Отримання улюблених рецептів користувача
// Приватний маршрут
// -------------------------------------------------------------------------------------------
router.get('/recipes/favorites', authenticate, getFavoriteRecipes);
// ===========================================================================================

// ===========================================================================================
// GET /recipes/:recipeId - отримання детальної інформації про рецепт за його id
// Публічний маршрут
// -------------------------------------------------------------------------------------------
router.get('/recipes/:recipeId', getRecipeById);

// ===========================================================================================

// Експорт роутера
export default router;
