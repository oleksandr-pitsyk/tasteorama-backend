// ==========================================================================================
// Маршрути для рецептів
// ==========================================================================================

// Express Router — об'єкт, який дозволяє групувати маршрути та їх обробники у логічні блоки.
import { Router } from 'express';

// Імпорт бібліотеки валідації
import { celebrate } from 'celebrate';

// Імпорт схем валідації
import { createRecipeSchema } from '../validations/recipeValidation.js';

import { addToFavorites } from '../controllers/favoriteController.js';
import { deleteToFavorites } from '../controllers/favoriteController.js';
// Імпорт контролерів
import { createRecipe } from '../controllers/createRecipeController.js';

// Імпорт middleware перевірки аутентифікації
import { authenticate } from '../middleware/authenticate.js';

// Імпорт multer для завантаження файлів
import { upload } from '../middleware/multer.js';

// Створення роутеру
const router = Router();

// ===========================================================================================
// GET /recipes - Пошук рецептів за категорією, інгредієнтом, входженням пошукового значення в назву рецепту (з урахуванням логіки пагінації)

// ===========================================================================================

// ===========================================================================================
// POST /recipes - Створення власного рецепту (приватний маршрут)
// -------------------------------------------------------------------------------------------
router.post('/', authenticate, upload.single('thumb'), celebrate(createRecipeSchema), createRecipe);
// ===========================================================================================

// POST /:id/favorite - Пошук рецептів за категорією, інгредієнтом, входженням пошукового значення в назву рецепту (з урахуванням логіки пагінації)
// -------------------------------------------------------------------------------------------
router.post('/:id/favorite', authenticate, addToFavorites);
router.delete('/:id/favorite', authenticate, deleteToFavorites);
// ===========================================================================================

// Експорт роутера
export default router;
