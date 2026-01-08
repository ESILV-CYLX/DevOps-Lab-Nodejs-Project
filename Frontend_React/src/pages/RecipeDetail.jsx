import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Clock, ChefHat, User, Flame, Edit, ShoppingBag, CheckCircle, Check, Heart } from 'lucide-react'; 
import { recipeService, shoppingListService } from '../services/api';

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  
  const isLoggedIn = !!token && !!user;

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addedIngredients, setAddedIngredients] = useState({});
  const [addingAll, setAddingAll] = useState(false);
  const [allAdded, setAllAdded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const data = await recipeService.getById(token, id);
        setRecipe(data);

        if (isLoggedIn) {
          const favorites = await recipeService.getFavorites(token);
          const isFav = favorites.some(f => f.recipeId === data.recipeId);
          setIsLiked(isFav);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id, token, isLoggedIn]);

  const toggleLike = async () => {
      if (!isLoggedIn) return;
      
      const previousState = isLiked;
      setIsLiked(!previousState); 

      try {
        await recipeService.toggleFavorite(token, recipe.recipeId, !previousState);
      } catch (err) {
          setIsLiked(previousState); // Revert
          console.error(err);
      }
  };

  const addAllToShoppingList = async () => {
    if (!isLoggedIn || !recipe.ingredients || recipe.ingredients.length === 0) return;
    
    setAddingAll(true);
    try {
      const promises = recipe.ingredients.map(ing => 
        shoppingListService.addItem(token, {
          name: ing.name,
          quantity: ing.quantity,
          unit: ing.unit,
          category: ing.category || 'OTHER'
        })
      );

      await Promise.all(promises);
      setAllAdded(true);

      const allIndices = {};
      recipe.ingredients.forEach((_, i) => allIndices[i] = true);
      setAddedIngredients(allIndices);

      setTimeout(() => {
        setAllAdded(false);
        setAddingAll(false);
      }, 3000);
    } catch (err) {
      console.error(err);
      alert("Error adding all ingredients to shoppping list");
      setAddingAll(false);
    }
  };

  const addToShoppingList = async (ingredient, index) => {
    if (!isLoggedIn) return;
    try {
        await shoppingListService.addItem(token, {
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        category: ingredient.category || 'OTHER'
      });

      setAddedIngredients(prev => ({ ...prev, [index]: true }));
      setTimeout(() => setAddedIngredients(prev => ({ ...prev, [index]: false })), 2000);
    } catch (err) {
      alert("Error adding to shopping list");
    }
  };

  if (loading) return <div style={{padding: '40px'}}>Loading...</div>;
  if (error) return <div style={{padding: '40px', color: 'red'}}>Error: {error}</div>;
  if (!recipe) return null;

  const isOwner = isLoggedIn && recipe && user.userId === recipe.userId;

  return (
    <div className="page-content-limited">
      <Link to="/" style={{ display: 'flex', alignItems: 'center', color: '#666', textDecoration: 'none', marginBottom: '20px' }}>
        <ArrowLeft size={20} style={{marginRight: '5px'}}/> Back to Dashboard
      </Link>
      
      <div style={{ borderRadius: '16px', overflow: 'hidden', height: '350px', marginBottom: '30px', position: 'relative' }}>
         <img src={recipe.image} alt={recipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
         
         {isLoggedIn && (
          <button 
              onClick={toggleLike}
              style={{ position: 'absolute', top: '20px', right: '20px', width: '40px', height: '40px',
                  borderRadius: '50%', background: 'white', border: 'none', outline: 'none', display: 'grid',
                  placeItems: 'center', cursor: 'pointer',boxShadow: '0 2px 10px rgba(0,0,0,0.3)', padding: 0, zIndex: 10
              }}
          >
              <Heart 
                  size={22} 
                  color={isLiked ? "#ff4d4d" : "#000000"} 
                  fill={isLiked ? "#ff4d4d" : "none"} 
                  strokeWidth={2}
              />
          </button>
         )}
         <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, black)', padding: '20px', color: 'white'}}>
             <h1 style={{margin: 0, fontSize: '2.5rem'}}>{recipe.title}</h1>
         </div>
      </div>

      <div style={{ display: 'flex', gap: '30px', color: '#555', marginBottom: '30px', background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
         <span style={{display: 'flex', alignItems: 'center'}}><ChefHat size={20} style={{marginRight: '8px'}}/> <strong>{recipe.cuisineType}</strong></span>
         <span style={{display: 'flex', alignItems: 'center'}}><Clock size={20} style={{marginRight: '8px'}}/> Prep: {recipe.prepTime} min</span>
         <span style={{display: 'flex', alignItems: 'center'}}><Flame size={20} style={{marginRight: '8px'}}/> Cook: {recipe.cookTime} min</span>
         <span style={{display: 'flex', alignItems: 'center'}}><User size={20} style={{marginRight: '8px'}}/> {recipe.servings} Servings</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '50px' }}>
        
        <div>
          {/* TITRE ET BOUTON "ADD ALL" */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            borderBottom: '2px solid #eee', 
            paddingBottom: '10px',
            marginBottom: '15px' 
          }}>
            <h3 style={{ margin: 0 }}>Ingredients</h3>
            {isLoggedIn && (
              <button
                onClick={addAllToShoppingList}
                disabled={addingAll || allAdded}
                style={{
                  background: allAdded ? '#2e7d32' : 'black',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  cursor: addingAll ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.3s ease'
                }}
              >
                {allAdded ? (
                  <><CheckCircle size={14} /> Added!</>
                ) : (
                  <><ShoppingBag size={14} /> {addingAll ? 'Adding...' : 'Add all'}</>
                )}
              </button>
            )}
          </div>

          <ul style={{ listStyle: 'none', padding: 0 }}>
            {recipe.ingredients && recipe.ingredients.map((ing, index) => (
                <li key={index} style={{ padding: '15px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{flex: 1}}>
                        <span style={{display: 'block', fontSize: '1rem', fontWeight: '500'}}>{ing.name}</span>
                        <span style={{color: '#888', fontSize: '0.9rem'}}>
                            {ing.quantity} {ing.unit}
                        </span>
                    </div>

                    {isLoggedIn && (
                      <button 
                          onClick={() => addToShoppingList(ing, index)}
                          style={{
                              background: addedIngredients[index] ? '#e8f5e9' : 'white',
                              color: addedIngredients[index] ? '#2e7d32' : '#1976d2',
                              border: addedIngredients[index] ? '1px solid #a5d6a7' : '1px solid #bbdefb',
                              borderRadius: '8px',
                              padding: '8px 12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              cursor: 'pointer',
                              fontWeight: '600',
                              fontSize: '0.85rem',
                              transition: 'all 0.2s',
                              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                              outline: 'none'
                          }}
                      >
                          {addedIngredients[index] ? <><Check size={16} /> Added</> : <><ShoppingBag size={16} /> + Add</>}
                      </button>
                    )}
                </li>
            ))}
            {(!recipe.ingredients || recipe.ingredients.length === 0) && <p>No ingredients listed.</p>}
          </ul>
        </div>

        {/* INSTRUCTIONS */}
        <div>
          <h3 style={{borderBottom: '2px solid #eee', paddingBottom: '10px'}}>Instructions</h3>
          <div style={{ lineHeight: '1.8' }}>
            {recipe.instructions && recipe.instructions.map((step, index) => (
                 <div key={index} style={{marginBottom: '15px', display: 'flex'}}>
                    <div style={{fontWeight: 'bold', marginRight: '15px', background: 'black', color:'white', width:'25px', height:'25px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0}}>{index + 1}</div>
                    <span style={{marginTop: '2px'}}>{step}</span>
                </div>
            ))}
          </div>
        </div>
      </div>

      {isOwner && (
        <div style={{ marginTop: '50px', borderTop: '1px solid #eee', paddingTop: '30px', textAlign: 'center' }}>
            <button 
                onClick={() => navigate(`/modify-recipe/${recipe.recipeId}`)}
                className="btn-primary"
                style={{ width: '100%', background: '#333', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }} 
            >
                <Edit size={18} /> Modify / Delete this Recipe
            </button>
        </div>
      )}
    </div>
  );
}