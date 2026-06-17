// ==========================================================================================
// Маршрути для рецептів
// ==========================================================================================

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

// ===========================================================================================
// БЛОК ОБРАНОГО (FAVORITES) - ПЕРЕНЕСЕНО НА САМИЙ ВЕРХ
// Статичні роути мають перевірятися першими, щоб Express не сплутав їх з динамічним :recipeId
// ===========================================================================================

// GET /api/recipes/favorites
// Отримання списку улюблених рецептів користувача (Приватний маршрут)
router.get('/favorites', authenticate, getFavoriteRecipes);

// POST /api/recipes/favorites/:recipeId
// Додавання рецепту до списку улюблених (Приватний маршрут)
router.post('/favorites/:recipeId', authenticate, addFavorites);

// DELETE /api/recipes/favorites/:recipeId
// Видалення рецепту зі списку улюблених (Приватний маршрут)
router.delete('/favorites/:recipeId', authenticate, deleteFavorites);

// ===========================================================================================
// ІНШІ МАРШРУТИ РЕЦЕПТІВ
// ===========================================================================================

// GET /api/recipes
// Пошук рецептів за категорією, інгредієнтом або пошуковим запитом (з пагінацією)
// Публічний маршрут
router.get('/', celebrate(getRecipesSchema), getAllRecipes);

// POST /api/recipes
// Створення власного рецепту
// Приватний маршрут (Мультер очікує файл у полі 'image')
router.post('/', authenticate, upload.single('image'), celebrate(createRecipeSchema), createRecipe);

// GET /api/recipes/my
// Отримання власних рецептів поточного користувача (Приватний маршрут)
router.get('/my', authenticate, celebrate(getRecipesSchema), getMyRecipes);

// ===========================================================================================
// ДИНАМІЧНІ МАРШРУТИ (МАЮТЬ ЙТИ В САМОМУ КІНЦІ)
// ===========================================================================================

// GET /api/recipes/:recipeId
// Отримання детальної інформації про рецепт за його id (Публічний маршрут)
router.get('/:recipeId', getRecipeById);

// Експорт роутера
export default router;
