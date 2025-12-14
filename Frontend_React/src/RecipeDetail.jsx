import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
// Added ShoppingBag icon
import { ArrowLeft, Clock, ChefHat, User, Flame, Edit, ShoppingBag, Check } from 'lucide-react'; 

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Track which ingredients were just added for visual feedback
  const [addedIngredients, setAddedIngredients] = useState({}); 

  // ... fetchRecipe useEffect remains the same ...
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:3000/recipes/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Recipe not found');
        const data = await response.json();
        setRecipe(data);
      } catch (err) { setError(err.message); } 
      finally { setLoading(false); }
    };
    if (token) fetchRecipe();
  }, [id, token]);

  // --- NEW: Add to Shopping List Function ---
  const addToShoppingList = async (ingredient, index) => {
    try {
        const res = await fetch('http://localhost:3000/shopping-list/item', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: ingredient.name,
                quantity: ingredient.quantity,
                unit: ingredient.unit,
                category: ingredient.category || "Divers"
            })
        });

        if (res.ok) {
            // Visual feedback: Toggle state for this specific index
            setAddedIngredients(prev => ({ ...prev, [index]: true }));
            // Remove the checkmark after 2 seconds
            setTimeout(() => {
                setAddedIngredients(prev => ({ ...prev, [index]: false }));
            }, 2000);
        } else {
            alert("Failed to add to list");
        }
    } catch (err) {
        console.error(err);
    }
  };

  if (loading) return <div style={{padding: '40px'}}>Loading...</div>;
  if (error) return <div style={{padding: '40px', color: 'red'}}>Error: {error}</div>;
  if (!recipe) return null;

  const isOwner = user && recipe && user.userId === recipe.userId;

  return (
    <div className="page-content-limited">
      <Link to="/" style={{ display: 'flex', alignItems: 'center', color: '#666', textDecoration: 'none', marginBottom: '20px' }}>
        <ArrowLeft size={20} style={{marginRight: '5px'}}/> Back to Dashboard
      </Link>
      
      {/* ... Image and Info Section (Keep same as before) ... */}
      <div style={{ borderRadius: '16px', overflow: 'hidden', height: '350px', marginBottom: '30px', position: 'relative' }}>
         <img src={recipe.image} alt={recipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
         <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, black)', padding: '20px', color: 'white'}}>
             <h1 style={{margin: 0, fontSize: '2.5rem'}}>{recipe.title}</h1>
         </div>
      </div>

      {/* ... Info Stats (Prep, Cook, etc) ... */}
      <div style={{ display: 'flex', gap: '30px', color: '#555', marginBottom: '30px', background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
         <span style={{display: 'flex', alignItems: 'center'}}><ChefHat size={20} style={{marginRight: '8px'}}/> <strong>{recipe.cuisineType}</strong></span>
         <span style={{display: 'flex', alignItems: 'center'}}><Clock size={20} style={{marginRight: '8px'}}/> Prep: {recipe.prepTime} min</span>
         <span style={{display: 'flex', alignItems: 'center'}}><Flame size={20} style={{marginRight: '8px'}}/> Cook: {recipe.cookTime} min</span>
         <span style={{display: 'flex', alignItems: 'center'}}><User size={20} style={{marginRight: '8px'}}/> {recipe.servings} Servings</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '50px' }}>
        
        {/* === INGREDIENTS LIST (UPDATED) === */}
        <div>
          <h3 style={{borderBottom: '2px solid #eee', paddingBottom: '10px'}}>Ingredients</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {recipe.ingredients && recipe.ingredients.map((ing, index) => (
                <li key={index} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    
                    {/* Ingredient Info */}
                    <div style={{flex: 1}}>
                        <span style={{display: 'block', fontSize: '1rem', fontWeight: '500'}}>{ing.name}</span>
                        <span style={{color: '#888', fontSize: '0.9rem'}}>
                            {ing.quantity} {ing.unit}
                        </span>
                    </div>

                    {/* IMPROVED BUTTON */}
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
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}
                    >
                        {addedIngredients[index] ? (
                            <>
                                <Check size={16} /> Added
                            </>
                        ) : (
                            <>
                                <ShoppingBag size={16} /> + Add
                            </>
                        )}
                    </button>

                </li>
            ))}
            {(!recipe.ingredients || recipe.ingredients.length === 0) && <p>No ingredients listed.</p>}
          </ul>
        </div>

        {/* Instructions (Keep same) */}
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

      {/* Modify Button (Keep same) */}
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