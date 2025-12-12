import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Heart } from 'lucide-react';

// 1. Define the Category Groups and their mapping
const cuisineGroups = [
  { name: "Occidental", types: ["French", "Italian", "Spanish", "American"] },
  { name: "Mediterranean", types: ["Mediterranean"] },
  { name: "Asian", types: ["Asian", "Korean", "Japanese", "Chinese"] },
  { name: "Exotic", types: ["Exotic", "Indian", "Mexican"] },
  { name: "Miscellaneous", types: ["Other"] }
];

export default function Dashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorite = (e, recipeId) => {
    e.preventDefault();
    let newFavs;
    if (favorites.includes(recipeId)) {
        newFavs = favorites.filter(id => id !== recipeId);
    } else {
        newFavs = [...favorites, recipeId];
    }
    setFavorites(newFavs);
    localStorage.setItem('favorites', JSON.stringify(newFavs));
  };

  const getDifficultyText = (level) => {
    switch(level) {
      case 1: return "Easy";
      case 2: return "Medium";
      case 3: return "Hard";
      default: return "Medium";
    }
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      if (!token) return; 
      try {
        const response = await fetch('http://localhost:3000/recipes', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const data = await response.json();
            setRecipes(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [token]);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="header-section" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px'}}>
        <div>
          <h1 style={{margin: '0 0 5px 0', fontSize: '2.5rem'}}>Welcome, {user?.username || 'Chef'} 👋</h1>
          <p style={{margin: 0, color: '#666'}}>Discover the latest community recipes</p>
        </div>
        <button className="btn-primary" style={{height: 'fit-content'}} onClick={() => navigate('/create-recipe')}>
          Create a Recipe
        </button>
      </div>

      {!loading && (
        <div className="recommendations">
          {/* 2. Loop through the groups */}
          {cuisineGroups.map((group) => {
            // Filter recipes belonging to this group
            const groupRecipes = recipes.filter(r => group.types.includes(r.cuisineType));
            
            // If no recipes in this group, don't display the section
            if (groupRecipes.length === 0) return null;

            return (
              <div key={group.name} style={{marginBottom: '40px'}}>
                <h2 className="section-title" style={{marginTop: 0, marginBottom: '20px'}}>{group.name}</h2>
                
                <div className="horizontal-scroll">
                  {groupRecipes.map((recipe) => (
                    <Link to={`/recipe/${recipe.recipeId}`} key={recipe.recipeId || recipe._id} style={{textDecoration: 'none', color: 'inherit', position: 'relative'}}>
                      <div className="recipe-card">
                        
                        {/* Heart Button */}
                        <div 
                            onClick={(e) => toggleFavorite(e, recipe.recipeId)}
                            style={{
                                position: 'absolute', top: '10px', right: '10px', 
                                background: 'white', borderRadius: '50%', padding: '8px', 
                                boxShadow: '0 2px 5px rgba(0,0,0,0.2)', cursor: 'pointer', zIndex: 10
                            }}
                        >
                            <Heart 
                                size={18} 
                                color={favorites.includes(recipe.recipeId) ? "red" : "black"} 
                                fill={favorites.includes(recipe.recipeId) ? "red" : "none"} 
                            />
                        </div>

                        {/* Image */}
                        <div className="card-img" style={{
                            backgroundImage: `url(${recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=60'})`
                        }}></div>
                        
                        {/* Info */}
                        <div className="card-info">
                            <span style={{color: '#888', fontSize: '12px', display: 'block'}}>
                                {recipe.cuisineType}
                            </span>
                            <div className="card-title">{recipe.title}</div>
                            <div className="card-meta">
                                Difficulty: {getDifficultyText(recipe.difficulty)} • {recipe.prepTime} min
                            </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Static Planning (Unchanged) */}
      <h2 className="section-title">Current Plan</h2>
      <div className="planning-grid">
         <div className="day-card">
            <div className="day-header">Monday</div>
            <div className="meal-slot">☀️ Caesar Salad</div>
            <div className="meal-slot">🌙 Paella</div>
          </div>
          <div className="day-card">
            <div className="day-header">Tuesday</div>
            <div className="meal-slot">☀️ Tuna Sandwich</div>
            <div className="meal-slot">🌙 Steak & Fries</div>
          </div>
      </div>
    </div>
  );
}