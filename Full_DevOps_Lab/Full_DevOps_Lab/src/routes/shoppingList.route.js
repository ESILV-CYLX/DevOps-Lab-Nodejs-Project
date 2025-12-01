import express from 'express';
// Attention à l'extension .js à la fin, c'est OBLIGATOIRE en ES Modules
import shoppingController from '../controllers/shoppingList.controller.js';

const router = express.Router();

// CRUD COMPLET

// GET - Voir la liste
router.get('/', shoppingController.getShoppingList);

// POST - Générer depuis le planner
router.post('/generate', shoppingController.generateList);

// POST - Ajouter un item manuellement
router.post('/item', shoppingController.addItem);

// PUT - Modifier un item
router.put('/item/:itemId', shoppingController.updateItem);

// DELETE - Supprimer un item
router.delete('/item/:itemId', shoppingController.deleteItem);

// Export par défaut (ESM)
export default router;