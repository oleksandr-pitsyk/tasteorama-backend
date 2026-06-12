// src/db/connectMongoDB.js
// Функція для підключення до бази даних MongoDB за допомогою бібліотеки Mongoose.
import mongoose from 'mongoose';

// Імпорт моделів за схемою
// *****************************************************
import { Category } from '../models/category.js';
import { Ingredient } from '../models/ingredient.js';
import { Recipe } from '../models/recipe.js';
import { User } from '../models/user.js';

export const connectMongoDB = async () => {
  try {
    // Отримуємо URL для підключення до MongoDB з змінних оточення
    const mongoUrl = process.env.MONGO_URL;

    // Підключаємося до MongoDB за допомогою Mongoose
    await mongoose.connect(mongoUrl);

    // Переіндексація БД - гарантуємо, що індекси в БД відповідають схемі
    // Це доповнення:
    //    прочитає індекси зі схеми Mongoose;
    //    порівняє їх з індексами у базі;
    //    створить відсутні індекси;
    //    видалить зайві.
    // *****************************************************
    await Category.syncIndexes();
    await Ingredient.syncIndexes();
    await Recipe.syncIndexes();
    await User.syncIndexes();

    // у разі успіху виводимо повідомлення, що підключення встановлено
    console.log('✅ MongoDB connection established successfully');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    process.exit(1); // аварійне завершення програми
  }
};
