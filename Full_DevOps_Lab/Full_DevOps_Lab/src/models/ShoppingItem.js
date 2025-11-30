export class ShoppingItem {
  /**
   * @param {number} itemId
   * @param {Ingredient} ingredient
   * @param {RecipeIngredient[]} recipeIngredients
   * @param {number} quantity
   * @param {string} unit
   * @param {string|null} category
   * @param {boolean} isChecked
   * @param {number} shoppingListId
   */
  constructor(itemId, ingredient, recipeIngredients, quantity, unit, category = null, isChecked = false, shoppingListId) {
    this.itemId = itemId;
    this.ingredient = ingredient;
    this.recipeIngredients = recipeIngredients;
    this.quantity = quantity;
    this.unit = unit;
    this.category = category;
    this.isChecked = isChecked;
    this.shoppingListId = shoppingListId;
  }
}