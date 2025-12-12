// src/mockData.js

export const recipes = [
  { 
    id: 1, 
    title: 'Beef Tartar', 
    cuisine: 'France', 
    difficulty: 'Moyen', 
    image: 'https://images.unsplash.com/photo-1626804475297-411d635e7c8d?auto=format&fit=crop&w=800&q=80',
    prepTime: '20 min',
    ingredients: ['200g Bœuf haché', '1 Jaune d\'œuf', 'Câpres', 'Oignons', 'Sauce Worcestershire'],
    steps: ['Hacher la viande au couteau.', 'Mélanger avec les condiments.', 'Servir frais avec le jaune d\'œuf.']
  },
  { 
    id: 2, 
    title: 'Spaghetti Carbonara', 
    cuisine: 'Italy', 
    difficulty: 'Facile', 
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=800&q=80',
    prepTime: '15 min',
    ingredients: ['200g Spaghetti', '100g Guanciale', '2 Œufs', 'Pecorino Romano', 'Poivre'],
    steps: ['Cuire les pâtes al dente.', 'Faire revenir le guanciale.', 'Mélanger œufs et fromage.', 'Tout assembler hors du feu.']
  },
  { 
    id: 3, 
    title: 'Jajangmyeon', 
    cuisine: 'Korea', 
    difficulty: 'Difficile', 
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80',
    prepTime: '45 min',
    ingredients: ['Nouilles', 'Pâte de soja noire', 'Porc', 'Oignons', 'Courgettes'],
    steps: ['Faire frire la pâte de soja.', 'Cuire la viande et les légumes.', 'Mélanger avec la sauce.', 'Servir sur les nouilles.']
  },
  { 
    id: 4, 
    title: 'Bánh Xèo', 
    cuisine: 'Vietnam', 
    difficulty: 'Moyen', 
    image: 'https://images.unsplash.com/photo-1632288349277-22687c71d643?auto=format&fit=crop&w=800&q=80',
    prepTime: '30 min',
    ingredients: ['Farine de riz', 'Curcuma', 'Crevettes', 'Porc', 'Germes de soja'],
    steps: ['Préparer la pâte.', 'Cuire la crêpe avec la garniture.', 'Plier en deux et servir avec la sauce.']
  },
];

export const weeklyPlan = [
  { day: 'Lundi', lunch: 'Salade César', dinner: 'Paella' },
  { day: 'Mardi', lunch: 'Sandwich Thon', dinner: 'Steak Frites' },
  { day: 'Mercredi', lunch: 'Restes', dinner: 'Soupe à l\'oignon' },
  { day: 'Jeudi', lunch: 'Cantine', dinner: 'Curry Poulet' },
];