import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Heart } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import { recipeService } from '../services/api';

export default function SavedRecipes() {
  const { token, user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const likedRecipeIds = new Set(recipes.map(r => r.recipeId));
  const isLoggedIn = !!token && !!user;

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const data = await recipeService.getFavorites(token);
        setRecipes(data);
      } catch (err) {
        console.error("Error fetching favorites:", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchFavorites();
  }, [token]);

  // Fonction pour gérer le retrait (appelée par le RecipeCard)
  const handleToggleLike = (recipeId, isLiked) => {
    if (!isLiked) {
      // Si l'utilisateur a cliqué pour retirer le favori, on l'enlève de la liste locale
      setRecipes(current => current.filter(r => r.recipeId !== recipeId));
    }
  };

  if (loading) return <div style={{padding:'40px'}}>Loading saved recipes...</div>;

  return (
    <div className="page-content" style={{maxWidth: '800px', margin: '0 auto' }}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <div style={{background: '#e3f2fd', padding: '12px', borderRadius: '12px'}}>
                <Heart size={32} color="#1976d2" />
            </div>
            <h1 style={{fontSize: '2rem', margin: 0}}>Saved Recipes</h1>
        </div>
      </div>
      
      {recipes.length === 0 ? (
        <div style={{textAlign: 'center', padding: '60px', color: '#888', background: 'white', borderRadius: '16px'}}>
          <Heart size={48} style={{opacity: 0.2, marginBottom: '20px'}}/>
          <p>You haven't saved any recipes yet. Go find some you love!</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '25px' 
        }}>
          {recipes.map(recipe => (
            <RecipeCard 
              key={recipe.recipeId} 
              recipe={recipe} 
              likedRecipeIds={likedRecipeIds}
              onToggleLike={handleToggleLike}
              isLoggedIn={isLoggedIn}
            />
          ))}
        </div>
      )}
    </div>
  );
}