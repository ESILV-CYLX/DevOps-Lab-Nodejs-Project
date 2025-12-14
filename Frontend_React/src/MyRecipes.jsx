import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function MyRecipes() {
  const { user, token } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUserId = user?.userId || user?.id; 

  useEffect(() => {
    const fetchMyRecipes = async () => {
        try {
            const response = await fetch('http://localhost:3000/recipes', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            
            // Filtre : uniquement mes recettes
            const myRecipes = data.filter(r => r.userId === currentUserId);
            setRecipes(myRecipes);
        } catch (error) {
            console.error("Erreur", error);
        } finally {
            setLoading(false);
        }
    };
    if (token) fetchMyRecipes();
  }, [token, currentUserId]);

  return (
    <div className="dashboard-container">
        <h1 style={{marginBottom: '30px'}}>My Recipes</h1>
        
        {loading && <p>Loading...</p>}
        
        {!loading && recipes.length === 0 && (
            <div style={{textAlign: 'center', marginTop: '50px', color: '#666'}}>
                <p>You haven't created any recipes yet.</p>
                <Link to="/create-recipe" className="btn-primary" style={{textDecoration: 'none', display: 'inline-block', marginTop: '20px'}}>
                    Create my first recipe
                </Link>
            </div>
        )}

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '25px'}}>
            {recipes.map((recipe) => (
                <Link to={`/recipe/${recipe.recipeId}`} key={recipe.recipeId} style={{textDecoration: 'none', color: 'inherit'}}>
                    <div className="recipe-card">
                        <div className="card-img" style={{
                            backgroundImage: `url(${recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=60'})`
                        }}></div>
                        <div className="card-info">
                            <span style={{color: '#888', fontSize: '12px', display: 'block'}}>
                                {recipe.cuisineType}
                            </span>
                            <div className="card-title">{recipe.title}</div>
                            <div className="card-meta">
                                {recipe.difficulty === 1 ? 'Easy' : 'Medium'} • {recipe.prepTime} min
                            </div>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    </div>
  );
}