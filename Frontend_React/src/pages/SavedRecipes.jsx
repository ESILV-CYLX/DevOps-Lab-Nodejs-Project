import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Heart } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import { recipeService } from '../services/api';

export default function SavedRecipes() {
  const { token } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const likedRecipeIds = new Set(recipes.map(r => r.recipeId));

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
    <div className="page-content" style={{ padding: '30px' }}>
      <h1 style={{ marginBottom: '30px', fontSize: '2rem' }}>Saved Recipes</h1>
      
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
            />
          ))}
        </div>
      )}
    </div>
  );
}