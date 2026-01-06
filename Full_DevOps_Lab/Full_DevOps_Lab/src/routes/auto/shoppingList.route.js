import express from 'express';
import shoppingController from '../../controllers/shoppingList.controller.js';
import authenticateToken from '../../middleware/auth.middleware.js';

const router = express.Router();

// Apply Auth Middleware to ALL shopping list routes
router.use(authenticateToken);

router.get('/', shoppingController.getShoppingList);
router.post('/item', shoppingController.addItem);
router.delete('/clear',shoppingController.clearList);
router.put('/item/:itemId', shoppingController.updateItem);
router.delete('/item/:itemId', shoppingController.deleteItem);

export default router;