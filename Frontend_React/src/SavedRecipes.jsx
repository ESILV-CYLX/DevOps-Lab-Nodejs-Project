import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Clock, Heart } from 'lucide-react';

export default function SavedRecipes() {
  const { token } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch('http://localhost:3000/users/me/favorites', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setRecipes(data);
        }
      } catch (err) {
        console.error("Error fetching favorites:", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchFavorites();
  }, [token]);

  const removeFavorite = async (e, recipeId) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistic UI update
    setRecipes(currentRecipes => currentRecipes.filter(r => r.recipeId !== recipeId));

    try {
        const res = await fetch('http://localhost:3000/users/me/favorites', {
            method: 'POST', // Always use POST to toggle
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ recipeId })
        });

        if (!res.ok) {
            throw new Error("Failed to remove favorite");
        }
    } catch (err) {
        console.error(err);
    }
  };

  if (loading) return <div style={{padding:'40px'}}>Loading saved recipes...</div>;

  return (
    <div className="page-content">
      <h1 style={{ marginBottom: '30px', fontSize: '2rem' }}>Saved Recipes</h1>
      
      {recipes.length === 0 ? (
        <div style={{textAlign: 'center', padding: '60px', color: '#888', background: 'white', borderRadius: '16px'}}>
          <Heart size={48} style={{opacity: 0.2, marginBottom: '20px'}}/>
          <p>You haven't saved any recipes yet. Go find some you love!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px' }}>
          {recipes.map(recipe => (
            <div key={recipe.recipeId} style={{position: 'relative'}}>
              <Link to={`/recipe/${recipe.recipeId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', transition: 'transform 0.2s', height: '100%' }}
                     onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                     onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  
                  <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                    <img src={recipe.image} alt={recipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    
                    {/* LIKE BUTTON (Always Red here) */}
                    <button 
                        onClick={(e) => removeFavorite(e, recipe.recipeId)}
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'white',
                            border: 'none',
                            outline: 'none',
                            display: 'grid',
                            placeItems: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            padding: 0,
                            zIndex: 10
                        }}
                    >
                         <Heart 
                            size={20} 
                            color="#ff4d4d" 
                            fill="#ff4d4d" 
                            strokeWidth={2}
                         />
                    </button>
                  </div>
                  
                  <div style={{ padding: '15px' }}>
                    <div style={{fontSize: '0.8rem', color: '#888', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>{recipe.cuisineType}</div>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', fontWeight: '600' }}>{recipe.title}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', color: '#666', fontSize: '0.9rem' }}>
                      <Clock size={16} style={{ marginRight: '5px' }} />
                      <span>{recipe.prepTime + recipe.cookTime} min</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}