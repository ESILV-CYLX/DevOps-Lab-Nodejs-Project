import { Link } from 'react-router-dom';
import { Heart, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const RecipeCard = ({ recipe, likedRecipeIds, onToggleLike }) => {
  const { token, user } = useAuth();
  const isLiked = likedRecipeIds.has(recipe.recipeId);

  const toggleLike = async (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    if (!user) return; 

    const newLiked = !isLiked;
    onToggleLike?.(recipe.recipeId, newLiked);

    try {
      const url = newLiked 
        ? `http://localhost:3000/users/me/favorites` 
        : `http://localhost:3000/users/me/favorites/${recipe.recipeId}`;

      const res = await fetch(url, {
        method: newLiked ? 'POST' : 'DELETE',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: newLiked ? JSON.stringify({ recipeId: recipe.recipeId }) : null
      });

      if (!res.ok) throw new Error("Failed to toggle favorite");
    } catch (err) {
      console.error(err);
      onToggleLike?.(recipe.recipeId, isLiked); 
    }
  };

  return (
    <div style={{ minWidth: '280px', maxWidth: '300px', flex: '0 0 auto', position: 'relative' }}>
      <Link to={`/recipe/${recipe.recipeId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ 
          background: 'white', 
          borderRadius: '16px', 
          overflow: 'hidden', 
          boxShadow: '0 4px 15px rgba(0,0,0,0.05)', 
          transition: 'transform 0.2s', 
          height: '100%' 
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          
          <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
             <img src={recipe.image} alt={recipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             
             <button 
                onClick={toggleLike}
                style={{
                  position: 'absolute', top: '10px', right: '10px',
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'white', border: 'none', outline: 'none',
                  display: 'grid', placeItems: 'center', cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)', padding: 0, zIndex: 10
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
            <div style={{fontSize: '0.8rem', color: '#888', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.5px'}}>
                {recipe.cuisineType}
            </div>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', fontWeight: '600' }}>{recipe.title}</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', color: '#666', fontSize: '0.9rem' }}>
              <span style={{ marginRight: '15px' }}>
                {recipe.difficulty === 1 ? 'Easy' : recipe.difficulty === 2 ? 'Medium' : 'Hard'}
              </span>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Clock size={16} style={{ marginRight: '5px' }} />
                <span>{recipe.prepTime + recipe.cookTime} min</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default RecipeCard;