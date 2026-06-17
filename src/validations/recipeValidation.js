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
    title: Joi.string().max(64).required(),
    description: Joi.string().max(200).required(),
    time: Joi.number().min(1).max(360).required(),
    calories: Joi.number().integer().min(1).max(10000).optional(),

    category: Joi.string().required(),

    instructions: Joi.string().max(1200).required(),

    ingredients: Joi.custom((value, helpers) => {
      if (typeof value === 'string') {
        try {
          value = JSON.parse(value);
        } catch {
          return helpers.message('Ingredients must be a valid JSON string');
        }
      }

      const { error, value: validatedValue } = ingredientsSchema.validate(value);

      if (error) {
        return helpers.message(error.message);
      }

      return validatedValue;
    }).required(),
  }),
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
