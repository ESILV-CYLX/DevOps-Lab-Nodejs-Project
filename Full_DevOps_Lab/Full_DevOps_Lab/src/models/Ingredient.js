export class Ingredient {
  /**
   * @param {number} ingredientId
   * @param {string} name
   * @param {string} category
   * @param {number} price
   */
  constructor(ingredientId, name, category, price) {
    this.ingredientId = ingredientId;
    this.name = name;
    this.category = category;
    this.price = price;
  }
}
