import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Heart, Clock, Search, ChevronLeft, ChevronRight } from 'lucide-react';

// --- INTERNAL COMPONENT: RECIPE CARD ---
const RecipeCard = ({ recipe, isLikedInitial }) => {
  const { token, user } = useAuth();
  const [isLiked, setIsLiked] = useState(isLikedInitial);

  useEffect(() => { setIsLiked(isLikedInitial); }, [isLikedInitial]);

  const toggleLike = async (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    
    if (!user) return; 

    const previousState = isLiked;
    setIsLiked(!previousState); 

    try {
      const method = !previousState ? 'POST' : 'DELETE';
      const res = await fetch(`http://localhost:3000/users/me/favorites`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ recipeId: recipe.recipeId })
      });
      if (!res.ok) throw new Error("Failed");
    } catch (err) {
      setIsLiked(previousState); 
      console.error(err);
    }
  };

  return (
    <div style={{ minWidth: '280px', maxWidth: '300px', flex: '0 0 auto', position: 'relative' }}>
      <Link to={`/recipe/${recipe.recipeId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', transition: 'transform 0.2s', height: '100%' }}
             onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
             onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
          
          <div style={{ height: '180px', overflow: 'hidden', position: 'relative' }}>
             <img src={recipe.image} alt={recipe.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             
             {/* LIKE BUTTON */}
             <button 
                onClick={toggleLike}
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
              <span style={{ marginRight: '15px' }}>{recipe.difficulty === 1 ? 'Easy' : recipe.difficulty === 2 ? 'Medium' : 'Hard'}</span>
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

// --- INTERNAL COMPONENT: DASHBOARD SECTION ---
const DashboardSection = ({ title, children }) => {
  const scrollRef = React.useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ marginBottom: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{title}</h2>
        <div>
          <button onClick={() => scroll('left')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}><ChevronLeft size={24} /></button>
          <button onClick={() => scroll('right')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '5px' }}><ChevronRight size={24} /></button>
        </div>
      </div>
      <div ref={scrollRef} style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px', scrollbarWidth: 'none' }}>
        {children}
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [likedRecipeIds, setLikedRecipeIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const dashboardSections = [
    { id: "occidental", title: "Occidental", filter: (r) => ["American", "British", "French", "German", "Italian", "Spanish"].includes(r.cuisineType) },
    { id: "mediterranean", title: "Mediterranean", filter: (r) => ["Greek", "Mediterranean"].includes(r.cuisineType) },
    { id: "asian", title: "Asian", filter: (r) => ["Asian", "Chinese", "Japanese", "Korean", "Thai"].includes(r.cuisineType) },
    { id: "sweet", title: "Sweet Tooth", filter: (r) => r.flavor === "Sweet" },
    { id: "exotic", title: "Exotic & Spicy", filter: (r) => ["African", "Exotic", "Indian", "Mexican", "Middle Eastern"].includes(r.cuisineType) },
    { id: "misc", title: "Miscellaneous", filter: (r) => ["Other"].includes(r.cuisineType) }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recipesRes = await fetch('http://localhost:3000/recipes', {
             headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        
        if (recipesRes.ok) {
            const recipesData = await recipesRes.json();
            if (Array.isArray(recipesData)) {
                setRecipes(recipesData);
            } else {
                setRecipes([]);
            }
        }

        if (token) {
            const favRes = await fetch('http://localhost:3000/users/me/favorites', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (favRes.ok) {
                const favData = await favRes.json();
                const ids = favData.map(f => f.recipeId);
                setLikedRecipeIds(new Set(ids));
            }
        }
      } catch (err) {
        console.error("Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (loading) return <div style={{padding:'40px'}}>Loading...</div>;

  return (
    <div className="dashboard-container" style={{ 
        width: '100%', 
        minHeight: '100vh', 
        paddingBottom: '100px',
        padding: '30px'
    }}>
      
      <div className="header-section">
        <div>
          <h1 style={{margin: '0 0 5px 0', fontSize: '2.5rem', whiteSpace: 'nowrap'}}>
            Welcome, {user?.username || 'Chef'}
          </h1>
          <p style={{margin: 0, color: '#666'}}>What are you cooking today?</p>
        </div>
        
        <div style={{display: 'flex', gap: '15px'}}>
            <button className="btn-primary" onClick={() => navigate('/add-ingredient')} style={{background: 'white', color: 'black', border: '1px solid #ddd'}}>
                + Add Ingredient
            </button>
            <button className="btn-primary" onClick={() => navigate('/create-recipe')}>
                + Create Recipe
            </button>
        </div>
      </div>

      <div className="search-bar" style={{marginBottom: '40px', width: '100%'}}>
          <Search size={20} color="#666" />
          <input 
            type="text" 
            placeholder="Search recipes..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{border:'none', outline:'none', fontSize:'1rem', width:'100%'}}
          />
      </div>

      {dashboardSections.map(section => {
        const sectionRecipes = recipes.filter(r => {
          const matchesSection = section.filter(r);
          const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase());
          return matchesSection && matchesSearch;
        });

        if (sectionRecipes.length === 0) return null;

        return (
          <DashboardSection key={section.id} title={section.title}>
            {sectionRecipes.map(recipe => (
              <RecipeCard 
                key={recipe.recipeId} 
                recipe={recipe} 
                isLikedInitial={likedRecipeIds.has(recipe.recipeId)}
              />
            ))}
          </DashboardSection>
        );
      })}
      
      {recipes.length === 0 && !loading && (
          <div style={{textAlign: 'center', marginTop: '50px'}}>No recipes available.</div>
      )}
    </div>
  );
}