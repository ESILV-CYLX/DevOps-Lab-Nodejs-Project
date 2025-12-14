import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Heart } from 'lucide-react';

export default function SavedRecipes() {
  const { token, user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the saved recipes (full objects) from the backend
  useEffect(() => {
    const fetchSaved = async () => {
      try {
        const response = await fetch('http://localhost:3000/users/me/favorites', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
            const data = await response.json();
            setRecipes(data);
        }
      } catch (err) {
        console.error("Error fetching saved recipes:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchSaved();
  }, [token]);

  // Helper for difficulty text
  const getDifficultyText = (level) => {
    switch(level) {
      case 1: return "Easy";
      case 2: return "Medium";
      case 3: return "Hard";
      default: return "Medium";
    }
  };

  if (loading) return <div style={{padding: '40px'}}>Loading your favorites...</div>;

  return (
    <div style={{ padding: '40px' }}>
      <h1 style={{ marginBottom: '30px' }}>Saved Recipes</h1>
      
      {recipes.length === 0 ? (
        <p>You haven't saved any recipes yet. Go explore!</p>
      ) : (
        <div className="recipe-grid">
          {recipes.map((recipe) => (
            <Link to={`/recipe/${recipe.recipeId}`} key={recipe.recipeId} style={{textDecoration: 'none', color: 'inherit'}}>
              <div className="recipe-card">
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
      )}
    </div>
  );
}