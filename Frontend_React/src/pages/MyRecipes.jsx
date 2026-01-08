import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Clock, Heart, ChefHat, Lock, Globe } from 'lucide-react';
import { recipeService } from '../services/api';

export default function MyRecipes() {
  const { token, user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [likedRecipeIds, setLikedRecipeIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
     try {
      const [allRecipes, favorites] = await Promise.all([
        recipeService.getAll(token),
        recipeService.getFavorites(token)
      ]);

      setRecipes(allRecipes.filter(r => r.userId === user.userId));
      setLikedRecipeIds(new Set(favorites.map(f => f.recipeId)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  if (token && user) fetchData();
}, [token, user]);

const toggleLike = async (e, recipeId) => {
  e.preventDefault();
  e.stopPropagation();

  const isCurrentlyLiked = likedRecipeIds.has(recipeId);
  const newSet = new Set(likedRecipeIds);
  isCurrentlyLiked ? newSet.delete(recipeId) : newSet.add(recipeId);
  setLikedRecipeIds(newSet);

  try {
    await recipeService.toggleFavorite(token, recipeId, !isCurrentlyLiked);
  } catch (err) {
      console.error("Failed to toggle like");
      setLikedRecipeIds(likedRecipeIds); //rollback
  }
};

if (loading) return <div style={{padding:'40px'}}>Loading your recipes...</div>;

return (
  <div className="page-content"  style={{maxWidth: '800px', margin: '0 auto' }}>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ background: '#e3f2fd', padding: '12px', borderRadius: '12px' }}>
          <ChefHat size={32} color="#1976d2" />
        </div>
        <h1 style={{ fontSize: '2rem', margin: 0 }}>My Recipes</h1>
      </div>
      <Link to="/create-recipe" className="btn-primary" style={{textDecoration: 'none'}}>+ Create Recipe</Link>
    </div>
    
    {recipes.length === 0 ? (
      <div style={{textAlign: 'center', padding: '60px', color: '#888', background: 'white', borderRadius: '16px'}}>
          <ChefHat size={48} style={{opacity: 0.2, marginBottom: '20px'}}/>
          <p>You haven't created any recipes yet. Start cooking!</p>
      </div>
    ) : (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '25px' }}>
        {recipes.map(recipe => {
          const isLiked = likedRecipeIds.has(recipe.recipeId);
          return (
              <div key={recipe.recipeId} style={{position: 'relative'}}>
              <Link to={`/recipe/${recipe.recipeId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', transition: 'transform 0.2s', height: '100%' }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  
                  <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
                      <img src={recipe.image} alt={recipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        left: '10px',
                        background: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        backdropFilter: 'blur(4px)'
                      }}>
                        {recipe.privacy ? <Lock size={12} /> : <Globe size={12} />}
                        {recipe.privacy ? 'Private' : 'Public'}
                      </div>
                      
                      <button 
                          onClick={(e) => toggleLike(e, recipe.recipeId)}
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
                              color={isLiked ? "#ff4d4d" : "#000000"} 
                              fill={isLiked ? "#ff4d4d" : "none"} 
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
          );
        })}
      </div>
    )}
  </div>
);
}