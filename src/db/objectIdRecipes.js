// Программа по перетворенню стрінгового id в Object.id
// "_id": "640c2dd963a319ea671e37aa"
// "_id": { "$oid": "60d0fe4f5311236168a109cf" },

import fs from 'node:fs';

// 1. Открытие и чтение файла
const fileData = fs.readFileSync('recipesOld.json', 'utf8');
const recipes = JSON.parse(fileData); // Превращаем строку JSON в объект JS

const newRecipes = [];
recipes.map((recipe) => {
  const newIngredients = [];
  recipe.ingredients.map((ingredient) => {
    const ingredientNew = { ...ingredient, id: { $oid: ingredient.id } };
    newIngredients.push(ingredientNew);
  });
  const recipeNew = { ...recipe, ingredients: newIngredients };
  newRecipes.push(recipeNew);
});

// Новий масив об'єктів
console.log(`newRecipes`, newRecipes);

// Запись измененных данных обратно в файл
// Последний аргумент (2) добавляет форматирование с отступами для читаемости
const newJsonString = JSON.stringify(newRecipes, null, 2);
fs.writeFileSync('recipes.json', newJsonString, 'utf8');

console.log('Файл оновлено!');
