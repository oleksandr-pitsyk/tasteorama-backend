// Программа по перетворенню стрінгового id в Object.id
// "_id": "640c2dd963a319ea671e37aa"
// "_id": { "$oid": "60d0fe4f5311236168a109cf" },

import fs from 'node:fs';

// 1. Открытие и чтение файла
const fileData = fs.readFileSync('ingredientsOld.json', 'utf8');
const ingredients = JSON.parse(fileData); // Превращаем строку JSON в объект JS

// console.log(`ingredients`, ingredients);

const newIngredients = [];
ingredients.map((ingredient) => {
  // console.log(`ingredient`, ingredient);
  const ingredientNew = { ...ingredient, _id: { $oid: ingredient._id } };
  // console.log(`ingredientNew`, ingredientNew);
  newIngredients.push(ingredientNew);
});

// Новий масив об'єктів
console.log(`newIngredients`, newIngredients);

// Запись измененных данных обратно в файл
// Последний аргумент (2) добавляет форматирование с отступами для читаемости
const newJsonString = JSON.stringify(newIngredients, null, 2);
fs.writeFileSync('ingredients.json', newJsonString, 'utf8');

console.log('Файл оновлено!');
