export class RecipeIngredient {
  /**
   * @param {number} recipeIngredientId
   * @param {Ingredient} ingredient
   * @param {string} unit
   * @param {number} quantity
   * @param {string} category
   */
  constructor(recipeIngredientId, ingredient, unit, quantity, category) {
    this.recipeIngredientId = recipeIngredientId;
    this.ingredient = ingredient;
    this.unit = unit;
    this.quantity = quantity;
    this.category = category;
  }
}