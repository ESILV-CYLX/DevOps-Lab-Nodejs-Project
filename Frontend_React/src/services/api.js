const API_BASE_URL = 'http://localhost:3000';

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { 'Authorization': `Bearer ${token}` } : {})
});

// Fonction utilitaire pour décoder le JWT et obtenir l'ID de l'utilisateur
const getUserIdFromToken = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(window.atob(base64));
    return payload.userId;
  } catch (e) {
    return null;
  }
};

export const recipeService = {
  getAll: async (token) => {
    const res = await fetch(`${API_BASE_URL}/recipes`, { headers: getHeaders(token) });
    if (!res.ok) throw new Error("Failed to fetch recipes");
    const data = await res.json();
    const recipesArray = Array.isArray(data) ? data : (data.recipes || []);
    const currentUserId = getUserIdFromToken(token);

    return recipesArray.filter(recipe => {
      if (recipe.privacy === false || recipe.privacy === undefined) return true;      
      if (currentUserId && recipe.userId === currentUserId) return true; // pour recettes privées
      return false;
    });
  },
  
  create: async (token, recipeData) => {
    const res = await fetch(`${API_BASE_URL}/recipes`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(recipeData)
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create recipe");
    }
    return res.json();
  },

  getFavorites: async (token) => {
    const res = await fetch(`${API_BASE_URL}/users/me/favorites`, { headers: getHeaders(token) });
    if (!res.ok) throw new Error("Failed to fetch favorites");
    return res.json();
  },

  getUserRecipes: async (token, userId) => {
    const allRecipes = await recipeService.getAll(token);
    const recipesArray = Array.isArray(allRecipes) ? allRecipes : [];
    return recipesArray.filter(r => r.userId === userId);
  },

  toggleFavorite: async (token, recipeId, isAdding) => {
    const url = isAdding 
      ? `${API_BASE_URL}/users/me/favorites` 
      : `${API_BASE_URL}/users/me/favorites/${recipeId}`;
    const res = await fetch(url, {
      method: isAdding ? 'POST' : 'DELETE',
      headers: getHeaders(token),
      body: isAdding ? JSON.stringify({ recipeId }) : null
    });
    if (!res.ok) throw new Error("Failed to update favorite");
    return res.json();
  },

  getById: async (token, id) => {
    const res = await fetch(`${API_BASE_URL}/recipes/${id}`, { headers: getHeaders(token) });
    if (!res.ok) throw new Error("Recipe not found");
    const recipe = await res.json();

    // Protection supplémentaire pour l'accès direct par ID
    const currentUserId = getUserIdFromToken(token);
    const isPublic = recipe.privacy === false || recipe.privacy === undefined;
    const isOwner = currentUserId && recipe.userId === currentUserId;

    if (!isPublic && !isOwner) {
        throw new Error("Unauthorized: This recipe is private.");
    }

    return recipe;
  },

  update: async (token, id, recipeData) => {
    const res = await fetch(`${API_BASE_URL}/recipes/${id}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(recipeData)
    });
    if (!res.ok) throw new Error("Failed to update recipe");
    return res.json();
  },

  delete: async (token, id) => {
    const res = await fetch(`${API_BASE_URL}/recipes/${id}`, {
      method: 'DELETE',
      headers: getHeaders(token)
    });
    if (!res.ok) throw new Error("Failed to delete recipe");
    return true;
  },

  getMetadata: async (token) => {
    const res = await fetch(`${API_BASE_URL}/recipes/metadata`, { headers: getHeaders(token) });
    if (!res.ok) throw new Error("Failed to fetch recipe metadata");
    return res.json(); 
    // Doit retourner : { cuisineTypes: [], flavors: [], units: [] }
  }
};

export const ingredientService = {
  getAll: async (token) => {
    const res = await fetch(`${API_BASE_URL}/ingredients`, { headers: getHeaders(token) });
    if (!res.ok) throw new Error("Failed to fetch ingredients");
    return res.json();
  },
  
  create: async (token, ingredientData) => {
    const res = await fetch(`${API_BASE_URL}/ingredients`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(ingredientData)
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to add ingredient");
    }
    return res.json();
  },

  getCategories: async (token) => {
    const res = await fetch(`${API_BASE_URL}/ingredients/categories`, { 
      headers: getHeaders(token) 
    });
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  }
};

export const authService = {
  login: async (credentials) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    return data;
  },
  
  signup: async (userData) => {
    const res = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Signup failed");
    return data;
  }
};

export const shoppingListService = {
  get: async (token) => {
    const res = await fetch(`${API_BASE_URL}/shopping-list`, { headers: getHeaders(token) });
    if (!res.ok) throw new Error("Failed to fetch shopping list");
    return res.json();
  },

  addItem: async (token, itemData) => {
    const res = await fetch(`${API_BASE_URL}/shopping-list/item`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(itemData)
    });
    if (!res.ok) throw new Error("Failed to add item to shopping list");
    return res.json();
  },

  updateItem: async (token, itemId, updateData) => {
    const res = await fetch(`${API_BASE_URL}/shopping-list/item/${itemId}`, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(updateData)
    });
    if (!res.ok) throw new Error("Failed to update item to shopping list");
    return res.json();
  },

  deleteItem: async (token, itemId) => {
    const res = await fetch(`${API_BASE_URL}/shopping-list/item/${itemId}`, {
      method: 'DELETE',
      headers: getHeaders(token)
    });
    if (!res.ok) throw new Error("Failed to delete item from shopping list");
    return true;
  },

  clearList: async (token) => {
    const response = await fetch(`${API_BASE_URL}/shopping-list/clear`, {
        method: 'DELETE',
        headers: getHeaders(token)
    });
    if (!response.ok) throw new Error('Failed to clear the shopping list');
    return response.json();
  },
  
  updateFromCalendar: async (token, ingredients) => {
    const response = await fetch(`${API_BASE_URL}/planner/sync`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify({ ingredients })
    });
    if (!response.ok) throw new Error('Failed to sync shopping list');
    return response.json();
  },
};

export const calendarService = {
  // Sauvegarder un calendrier complet (jours + recettes)
  save: async (token, calendarData) => {
    const response = await fetch(`${API_BASE_URL}/planner/`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(calendarData)
    });
    if (!response.ok) throw new Error('Failed to save calendar');
    return response.json();
  },

  // Récupérer les calendriers favoris/sauvegardés
  getSavedCalendars: async (token) => {
    const response = await fetch(`${API_BASE_URL}/planner/`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch calendars');
    return response.json();
  },

  deleteSavedCalendar: async (token, id) => {
    const response = await fetch(`${API_BASE_URL}/planner/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to delete calendar');
    return true;
  }
};