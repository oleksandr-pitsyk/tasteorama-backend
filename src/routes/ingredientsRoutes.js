// ==========================================================================================
// Маршрути для інгредієнтів
// ==========================================================================================

import { Router } from 'express';
import { getIngredients } from '../controllers/ingredientsController.js';

const router = Router();

router.get('/api/ingredients', getIngredients);

export default router;
