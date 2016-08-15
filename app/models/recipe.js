var mongoose = require('mongoose');

var recipeSchema = mongoose.Schema({
    name: String,
    timeInMinutes: Number,
    portions: Number,
    ingredients: [{ description: String }],
    preparation: [{ step: String }],
    photo: Buffer
});

var Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;