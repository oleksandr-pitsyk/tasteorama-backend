// ====================================================================
// Схеми валідації рецепта
// ====================================================================

// Імпорт бібліотеки валідації
import { Joi, Segments } from 'celebrate';

const recipeIngredientSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
  measure: Joi.string().trim().required(),
});

const ingredientsSchema = Joi.array()
  .items(recipeIngredientSchema)
  .min(2)
  .max(16)
  .unique('id')
  .messages({
    'array.unique': 'Ingredients must contain unique ids',
  });

export const createRecipeSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().trim().max(64).required(),
    category: Joi.string().hex().length(24).required(),
    instructions: Joi.string().trim().max(1200).required(),
    description: Joi.string().trim().max(200).required(),
    thumb: Joi.string().allow('').default(''),
    time: Joi.number().integer().min(1).max(360).required(),
    calories: Joi.number().integer().min(1).max(10000).optional(),
    ingredients: Joi.custom((value, helpers) => {
      // Перевірка данних, якщо прийшли як рядок (form-data) => парсимо в JSON
      if (typeof value === 'string') {
        try {
          value = JSON.parse(value);
        } catch {
          return helpers.message('Ingredients must be a valid JSON string or array');
        }
      }

      // Валідуємо розпарсений масив з обмеженням кількості та унікальності id
      const { error, value: validatedValue } = ingredientsSchema.validate(value);

      if (error) {
        return helpers.message(error.message);
      }

      // Повертаємо готовий/чистий масив об'єктів
      return validatedValue;
    }).required(),
  }).unknown(true),
};

export const getRecipesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(12),
    category: Joi.string(),
    ingredients: Joi.string(),
    search: Joi.string().trim().allow(''),
  }),
};
