import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ArrowLeft, Clock, ChefHat, User, Flame } from 'lucide-react'; // Added Flame for cooking

export default function RecipeDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await fetch(`http://localhost:3000/recipes/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Recipe not found');
        
        const data = await response.json();
        setRecipe(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchRecipe();
  }, [id, token]);

  if (loading) return <div style={{padding: '40px'}}>Loading...</div>;
  if (error) return <div style={{padding: '40px', color: 'red'}}>Error: {error}</div>;
  if (!recipe) return null;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '50px' }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', color: '#666', textDecoration: 'none', marginBottom: '20px' }}>
        <ArrowLeft size={20} style={{marginRight: '5px'}}/> Back to Dashboard
      </Link>
      
      <div style={{ borderRadius: '16px', overflow: 'hidden', height: '350px', marginBottom: '30px', position: 'relative' }}>
        <img 
            src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'} 
            alt={recipe.title} 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, black)', padding: '20px', color: 'white'}}>
             <h1 style={{margin: 0, fontSize: '2.5rem'}}>{recipe.title}</h1>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '30px', color: '#555', marginBottom: '30px', background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        
        {/* CONDITIONAL: Cuisine Type */}
        <span style={{display: 'flex', alignItems: 'center'}}>
            <ChefHat size={20} style={{marginRight: '8px'}}/> 
            <strong>{recipe.cuisineType}</strong>
        </span>

        <span style={{display: 'flex', alignItems: 'center'}}>
            <Clock size={20} style={{marginRight: '8px'}}/> 
            Prep: {recipe.prepTime} min
        </span>
        <span style={{display: 'flex', alignItems: 'center'}}>
            <Flame size={20} style={{marginRight: '8px'}}/> 
            Cook: {recipe.cookTime} min
        </span>
        <span style={{display: 'flex', alignItems: 'center'}}>
            <User size={20} style={{marginRight: '8px'}}/> 
            {recipe.servings} Servings
        </span>
      </div>

      {/* CONDITIONAL: Description Section */}
      {recipe.description && (
          <div style={{marginBottom: '40px', background: '#f8f9fa', padding: '20px', borderRadius: '8px', borderLeft: '4px solid black'}}>
            <h3 style={{marginTop: 0}}>Description</h3>
            <p style={{lineHeight: '1.6', color: '#444'}}>{recipe.description}</p>
          </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '50px' }}>
        
        <div>
          <h3 style={{borderBottom: '2px solid #eee', paddingBottom: '10px'}}>Ingredients</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {recipe.ingredients && recipe.ingredients.map((ing, index) => (
                <li key={index} style={{ padding: '10px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{ing.name}</span>
                    <span style={{fontWeight: 'bold', color: '#666'}}>
                        {ing.quantity} {ing.unit}
                    </span>
                </li>
            ))}
            {(!recipe.ingredients || recipe.ingredients.length === 0) && <p>No ingredients listed.</p>}
          </ul>
        </div>

        <div>
          <h3 style={{borderBottom: '2px solid #eee', paddingBottom: '10px'}}>Instructions</h3>
          <div style={{ lineHeight: '1.8' }}>
            {recipe.instructions && recipe.instructions.length > 0 ? (
                recipe.instructions.map((step, index) => (
                    <div key={index} style={{marginBottom: '15px', display: 'flex'}}>
                        <div style={{fontWeight: 'bold', marginRight: '15px', background: 'black', color:'white', width:'25px', height:'25px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0}}>
                            {index + 1}
                        </div>
                        <span style={{marginTop: '2px'}}>{step}</span>
                    </div>
                ))
            ) : (
                <p>No instructions provided.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}