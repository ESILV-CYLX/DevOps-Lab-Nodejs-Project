export class RetailCompany {
  /**
   * @param {number} retailId
   * @param {string} name
   * @param {string} password
   * @param {Ingredient[]} availability
   */
  constructor(retailId, name, password, availability = []) {
    this.retailId = retailId;
    this.name = name;
    this.password = password;
    this.availability = availability;
  }

  addProduct(product) {}
  removeProduct(productId) {}
}