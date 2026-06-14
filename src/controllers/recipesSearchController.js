// ===========================================================================================
// Контролер recipesSearchController - для пошуку рецептів за категорією, інгредієнтом,
// входженням пошукового значення в назву рецепту (з урахуванням логіки пагінації)
// -------------------------------------------------------------------------------------------

// Імпорт функції для створення помилок з пакету http-errors.
// Він дозволяє створювати помилки з потрібним статусом і повідомленням.
// import createHttpError from 'http-errors';

// Імпорт моделей
import { Recipe } from '../models/recipe.js';
import { Ingredient } from '../models/ingredient.js';

// Контроллер GET - /recipes
export const getAllRecipes = async (req, res, next) => {
  try {
    // Деструктуризація параметрів рядка запиту
    const { page = 1, perPage = 12, category, ingredients, search } = req.query;

    // Розрахунок кількості запитів, які треба пропустити
    const skip = (page - 1) * perPage;

    // Створення основного запиту в БД
    const recipesQuery = Recipe.find();

    // Якщо є параметр запиту по пошуку слова або частині слова (пошук тільки в title)
    // Для $regex - індекс НЕ потрібний
    if (search) {
      recipesQuery.where({
        title: { $regex: search, $options: 'i' },
      });
    }

    // Якщо в параметрах є категорія
    if (category) {
      recipesQuery.where('category').equals(category);
    }

    // Якщо в параметрах є інгредієнт
    const ingredient = await Ingredient.findOne({ name: ingredients });
    if (ingredient) {
      recipesQuery.where('ingredients.id').equals(ingredient._id);
    }

    // Запуск запитів в БД на пошук :
    //    - Загальна кількість рецептів (склонованим запитом) методом countDocuments()
    //    - Список рецептів - skip(пропускаємо рецептів).limit(кількість на сторінці)
    const [totalItems, recipes] = await Promise.all([
      recipesQuery.clone().countDocuments(),
      recipesQuery.skip(skip).limit(perPage),
    ]);

    // Розрахунок загальної кількості сторінок (округлення вгору)
    const totalPages = Math.ceil(totalItems / perPage);

    // У разі вдалої обробки запиту відповідь сервера має бути зі статусом 200
    // та містити об’єкт із наступними властивостями:
    //    page - поточна сторінка
    //    perPage - кількість елементів в одній сторінці
    //    totalItems - загальна кількість рецептів в колекції
    //    totalPages - загальна кількість сторінок
    //    recipes - масив рецептів
    res.status(200).json({
      message: 'List of recipes',
      page,
      perPage,
      totalItems,
      totalPages,
      data: recipes,
    });
  } catch (error) {
    next(error);
  }
};
