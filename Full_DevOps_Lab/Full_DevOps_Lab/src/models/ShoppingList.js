export class ShoppingList {
  /**
   * @param {number} shoppingListId
   * @param {number} userId
   * @param {Date} updatedAt
   * @param {Date} dateCreated
   */
  constructor(shoppingListId, userId, dateCreated, updatedAt = new Date()) {
    this.shoppingListId = shoppingListId;
    this.userId = userId;
    this.dateCreated = dateCreated;
    this.updatedAt = updatedAt;
    this.items = [];
  }

  addItem(item) {}
  removeItem(itemId) {}
  checkOffItem(itemId) {}
}