export class User {
    /** 
     * @param {number} userId
     * @param {string} username
     * @param {string} email
     * @param {string} password
     * @param {string[]} dietaryPreferences
     * @param {number} servingSize
     */
    constructor(userId, username, email, password, dietaryPreferences, servingSize){
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.password = password;
        this.dietaryPreferences = dietaryPreferences;
        this.servingSize = servingSize;
    }
    
    //TODO
    login(){}
    logout(){}
    updateProdile(){}
}