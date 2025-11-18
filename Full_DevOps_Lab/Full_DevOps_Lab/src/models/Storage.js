export class Storage {
  /**
   * @param {number} storageId
   * @param {number} userId
   * @param {string} type
   */
  constructor(storageId, userId, type) {
    this.storageId = storageId;
    this.userId = userId;
    this.type = type;
    this.items = [];
  }

  addItem(item) {}
  removeItem(itemId) {}
}