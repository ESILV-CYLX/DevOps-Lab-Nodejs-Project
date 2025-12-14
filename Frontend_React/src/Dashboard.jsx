import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Heart } from 'lucide-react';

export default function Dashboard() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // FIX 1: Start with an EMPTY array. Do NOT read from localStorage.
  const [favorites, setFavorites] = useState([]);

  // Configuration for dashboard rows
  const dashboardSections = [
    { 
      id: "occidental",
      title: "Occidental", 
      // Added: British, German
      filter: (r) => ["American", "British", "French", "German", "Italian", "Spanish"].includes(r.cuisineType) 
    },
    { 
      id: "mediterranean",
      title: "Mediterranean", 
      // Added: Greek
      filter: (r) => ["Greek", "Mediterranean"].includes(r.cuisineType) 
    },
    { 
      id: "asian",
      title: "Asian", 
      // Added: Thai
      filter: (r) => ["Asian", "Chinese", "Japanese", "Korean", "Thai"].includes(r.cuisineType) 
    },
    { 
      id: "sweet",
      title: "Sweet Tooth", 
      filter: (r) => r.flavor === "Sweet" 
    },
    { 
      id: "exotic",
      title: "Exotic & Spicy", 
      // Added: African, Middle Eastern
      filter: (r) => ["African", "Exotic", "Indian", "Mexican", "Middle Eastern"].includes(r.cuisineType) 
    },
    { 
      id: "misc",
      title: "Miscellaneous", 
      filter: (r) => ["Other"].includes(r.cuisineType) 
    }
  ];

  const toggleFavorite = async (e, recipeId) => {
    e.preventDefault();
    
    // 1. Optimistic UI Update (Make it snappy)
    let newFavs;
    const isCurrentlyFavorite = favorites.includes(recipeId);
    
    if (isCurrentlyFavorite) {
        newFavs = favorites.filter(id => id !== recipeId);
    } else {
        newFavs = [...favorites, recipeId];
    }
    setFavorites(newFavs);

    // FIX 2: Do NOT save to localStorage here. Only DB.

    // 2. Send to Backend
    try {
        await fetch('http://localhost:3000/users/me/favorites', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ recipeId })
        });
        // If success, do nothing (UI is already updated)
    } catch (err) {
        console.error("Failed to sync favorite", err);
        // If error, revert the UI change (optional safety)
        setFavorites(isCurrentlyFavorite ? [...favorites] : favorites.filter(id => id !== recipeId));
    }
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
    const fetchData = async () => {
      if (!token) return; 
      
      try {
        // 1. Get All Recipes (The Menu)
        const recipesResponse = await fetch('http://localhost:3000/recipes', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (recipesResponse.ok) {
            const recipesData = await recipesResponse.json();
            setRecipes(recipesData);
        }

        // 2. Get User's Saved Recipes (The Hearts)
        // We use the SAME endpoint as the Saved page to ensure they are always in sync.
        const favResponse = await fetch('http://localhost:3000/users/me/favorites', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (favResponse.ok) {
            const favData = await favResponse.json();
            // The API returns full recipe objects, we just need the list of IDs for the hearts
            const favIds = favData.map(recipe => recipe.recipeId);
            setFavorites(favIds);
        }

      } catch (err) {
        console.error("Error loading dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, user]); // Re-runs when you login/logout

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="header-section">
        <div>
          <h1 style={{margin: '0 0 5px 0', fontSize: '2.5rem', whiteSpace: 'nowrap'}}>
            Welcome, {user?.username || 'Chef'}
          </h1>
          <p style={{margin: 0, color: '#666'}}>Discover the latest community recipes</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/create-recipe')}>
          Create a Recipe
        </button>
      </div>

      {!loading && (
        <div className="recommendations">
          
          {dashboardSections.map((section) => {
            const sectionRecipes = recipes.filter(section.filter);
            if (sectionRecipes.length === 0) return null;

            return (
              <div key={section.id} style={{marginBottom: '40px'}}>
                <h2 className="section-title" style={{marginTop: 0, marginBottom: '20px'}}>{section.title}</h2>
                
                <div className="horizontal-scroll">
                  {sectionRecipes.map((recipe) => (
                    <Link to={`/recipe/${recipe.recipeId}`} key={`${section.id}-${recipe.recipeId}`} style={{textDecoration: 'none', color: 'inherit', position: 'relative'}}>
                      <div className="recipe-card">
                        
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

                        <div className="card-img" style={{
                            backgroundImage: `url(${recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=60'})`
                        }}></div>
                        
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

      {/* Static Planning */}
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