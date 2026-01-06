import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import { recipeService } from '../services/api';

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
        const [recipesData, favoritesData] = await Promise.all([ //chargement en parallèle
          recipeService.getAll(token),
          token ? recipeService.getFavorites(token) : Promise.resolve([])
        ]);

        setRecipes(recipesData);

        if (token && Array.isArray(favoritesData)) {
          const ids = favoritesData.map(f => f.recipeId);
          setLikedRecipeIds(new Set(ids));
        }
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
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
          if (!r || !r.title) return false;
          const matchesSection = r.cuisineType ? section.filter(r) : false;
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
                likedRecipeIds={likedRecipeIds}
                onToggleLike={(recipeId, liked) => {
                  setLikedRecipeIds(prev => {
                    const newSet = new Set(prev);
                    if (liked) newSet.add(recipeId);
                    else newSet.delete(recipeId);
                    return newSet;
                  });
                }}
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