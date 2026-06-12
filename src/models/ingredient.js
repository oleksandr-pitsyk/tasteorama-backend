// =========================================================================
// Схема та модель для колекції "ingredients" у MongoDB
// =========================================================================

// Імпорт Schema та model
import { Schema, model } from 'mongoose';

//  Cхема для моделі Ingredient із такими властивостями:
//    name — рядок, унікальне, обов’язкове поле, з параметром trim: true;
//    desc — рядок, НЕобов’язкове поле, з параметром trim: true;
//    img — рядок, з параметром trim: true;

const ingredientSchema = new Schema(
  {
    name: {
      type: String, // тип - рядок
      unique: true, // має бути унікальне значення в БД
      required: true, // поле обов'язкове для заповнення
      trim: true, // прибирає пробіли на початку та в кінці рядка
    },
    desc: {
      type: String, // тип - рядок
      required: false, // поле НЕобов'язкове для заповнення
      trim: true, // прибирає пробіли на початку та в кінці рядка
      default: '', // значення за замовчуванням, якщо поле не передано
    },
    img: {
      type: String, // тип - рядок
      required: false, // поле НЕобов'язкове для заповнення
      trim: true, // прибирає пробіли на початку та в кінці рядка
      default: 'https://ac.goit.global/fullstack/react/default-avatar.jpg', // значення за замовчуванням
    },
  },
  {
    timestamps: false, // автоматично додає createdAt і updatedAt - вимкнено
    versionKey: false, // вимикає службове поле __v
  },
);

// Индексація в моделі інгредієнтів
//    - по назві, сортування за зростанням
// ingredientSchema.index({ name: 1 });

// Створюємо модель згідно схеми
export const Ingredient = model('Ingredient', ingredientSchema);
