export class StorageItem {
  /**
   * @param {number} storageItemId
   * @param {Ingredient} ingredient
   * @param {number} quantity
   * @param {string} unit
   * @param {boolean} isLeftover
   */
  constructor(storageItemId, ingredient, quantity, unit, isLeftover) {
    this.storageItemId = storageItemId;
    this.ingredient = ingredient;
    this.quantity = quantity;
    this.unit = unit;
    this.isLeftover = isLeftover;
  }
}