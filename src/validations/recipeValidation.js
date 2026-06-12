// ====================================================================
// Схеми валідації рецепта
// ====================================================================

// Імпорт бібліотеки валідації
import { Joi, Segments } from 'celebrate';

export const createRecipeSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().trim().required(),
    category: Joi.string().trim().required(),
    area: Joi.string().trim().required(),
    instructions: Joi.string().trim().required(),
    description: Joi.string().trim().required(),
    thumb: Joi.string().allow('').default(''),
    time: Joi.string().required(),
    ingredients: Joi.custom((value, helpers) => {
      // Перевірка данних, якщо прийшли як рядок (form-data) => парсимо в JSON
      if (typeof value === 'string') {
        try {
          value = JSON.parse(value);
        } catch {
          return helpers.message('Ingredients must be a valid JSON string or array');
        }
      }

      // валідуємо розпарсений масив станд. Joi
      const { error } = Joi.array()
        .items(
          Joi.object({
            // + перевіряємо, чи це валідний ObjectId рядок
            id: Joi.string().hex().length(24).required(),
            measure: Joi.string().trim().required(),
          }),
        )
        .min(1)
        .validate(value);

      if (error) {
        return helpers.message(error.message);
      }

      // Повертаємо готовий/чистий масив об'єктів
      return value;
    }).required(),
  }),
};
