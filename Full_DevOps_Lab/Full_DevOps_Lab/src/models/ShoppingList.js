export class ShoppingList {
  /**
   * @param {number} shoppingListId
   * @param {number} userId
   * @param {Date} dateCreated
   */
  constructor(shoppingListId, userId, dateCreated) {
    this.shoppingListId = shoppingListId;
    this.userId = userId;
    this.dateCreated = dateCreated;
    this.items = [];
  }

  addItem(item) {}
  removeItem(itemId) {}
  checkOffItem(itemId) {}
}