import { Ingredient } from '../models/ingredient.js';


export const getIngredients = async (req, res, next) => {
    try {
        const ingredients = await Ingredient.find().sort({ name: 1 });

        res.status(200).json({
            status: 200,
            message: "List of ingredients",
            data: ingredients});

    } catch(error){
        console.log(error);
        next(error);
    }
};