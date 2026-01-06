const API_BASE_URL = 'http://localhost:3000';

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { 'Authorization': `Bearer ${token}` } : {})
});

export const recipeService = {
  getAll: async (token) => {
    const res = await fetch(`${API_BASE_URL}/recipes`, { headers: getHeaders(token) });
    if (!res.ok) throw new Error("Failed to fetch recipes");
    const data = await res.json();
    return Array.isArray(data) ? data : (data.recipes || []);
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
    return res.json();
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
  }
};