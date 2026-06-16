// =========================================================================
// Схема та модель для колекції "recipes" у MongoDB
// =========================================================================

// Імпорт Schema та model
import { Schema, model } from 'mongoose';

//  Cхема для моделі Recipe із такими властивостями:

// title "Battenberg Cake"
// category "Beef"
// owner - ObjectId;
// area - "British"
// instructions - "Heat oven to 180C/160C fan/gas 4 and line the base and sides of a 20cm…"
// description - "A classic British cake made with almond sponge cake and covered with m…"
// thumb - "https://ftp.goit.study/img/so-yummy/preview/Battenberg%20Cake.jpg"
// time - "60"
// ingredients - Array [{
//      id - ObjectId;
//      measure - "175g";
// }]

const recipeSchema = new Schema(
  {
    title: {
      type: String,
      required: true, // робить поле обов'язковим для заповнення
      trim: true, // прибирає пробіли на початку та в кінці рядка
    },
    category: {
      type: String,
      required: true, // робить поле обов'язковим для заповнення
      trim: true, // прибирає пробіли на початку та в кінці рядка
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User', // поле owner посилається на інший документ у колекції users.
      // Це дозволяє виконувати запити з використанням методу populate
      // (наприклад, отримати нотатку разом з інформацією про користувача, якому вона належить)
      required: true,
    },
    area: {
      type: String,
      required: false, // поле не передається у create payload
      default: '',
      trim: true, // прибирає пробіли на початку та в кінці рядка
    },
    instructions: {
      type: String,
      required: true, // робить поле обов'язковим для заповнення
      trim: true, // прибирає пробіли на початку та в кінці рядка
    },
    description: {
      type: String,
      required: true, // робить поле обов'язковим для заповнення
      trim: true, // прибирає пробіли на початку та в кінці рядка
    },
    thumb: {
      type: String,
      required: false, // робить поле HEобов'язковим для заповнення
      default: '', // значення за замовчуванням, якщо поле не передано
    },
    time: {
      type: String,
      required: true, // робить поле обов'язковим для заповнення
      trim: true, // прибирає пробіли на початку та в кінці рядка
    },
    calories: {
      type: Number,
      required: false,
      min: 1,
      max: 10000,
    },
    ingredients: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: 'Ingredient', // поле owner посилається на інший документ у колекції ingredient.
          required: true,
        },
        measure: {
          type: String,
          required: true, // робить поле обов'язковим для заповнення
          trim: true, // прибирає пробіли на початку та в кінці рядка
        },
      },
    ],
  },
  {
    timestamps: true, // автоматично додає createdAt і updatedAt
    versionKey: false, // вимикає службове поле __v
  },
);

// Индексація в моделі
//    - за назвою, сортування за зростанням
//    - за категорією, сортування за зростанням
recipeSchema.index({ title: 1, category: 1 });

// Текстовий індекс - за назвою та описом
// text index може бути тільки один на колекцію, але він може включати кілька полів.
// recipeSchema.index({ title: 'text', description: 'text' });

// Створюємо модель згідно схеми
export const Recipe = model('Recipe', recipeSchema);
