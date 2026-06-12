// =========================================================================
// Схема та модель для колекції "categories" у MongoDB
// =========================================================================

// Імпорт Schema та model
import { Schema, model } from 'mongoose';

//  Cхема для моделі Category із такими властивостями:
//    name — рядок, унікальне, обов’язкове поле, з параметром trim: true;

const categorySchema = new Schema(
  {
    name: {
      type: String, // тип - рядок
      unique: true, // має бути унікальне значення в БД
      required: true, // поле обов'язкове для заповнення
      trim: true, // прибирає пробіли на початку та в кінці рядка
    },
  },
  {
    timestamps: false, // автоматично додає createdAt і updatedAt - вимкнено
    versionKey: false, // вимикає службове поле __v
  },
);

// Индексація в моделі категорій
//    - по назві, сортування за зростанням
// categorySchema.index({ name: 1 });

// Створюємо модель згідно схеми
export const Category = model('Category', categorySchema);
