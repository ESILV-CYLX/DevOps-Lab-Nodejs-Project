// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Home, Search, Calendar, List, Heart, Settings, PlusCircle, LogOut, ChefHat } from 'lucide-react';
import { AuthProvider, useAuth } from './AuthContext';
import Dashboard from './Dashboard';
import LoginPage from './LoginPage';
import RecipeDetail from './RecipeDetail';
import SettingsPage from './SettingsPage';
import './App.css';
import CreateRecipe from './CreateRecipe';
import MyRecipes from './MyRecipes';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth(); // On n'a plus besoin de 'user' ici
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="sidebar">
      {/* On a retiré le petit message "Bonjour" ici */}
      <div className="brand">Smart Meal 🥦</div>
      
      <div className="menu-group">
        <div className="menu-title">Découvrir</div>
        <Link to="/" className={`nav-link ${isActive('/')}`}>
          <Home size={20} /> Accueil
        </Link>
        <Link to="/browse" className={`nav-link ${isActive('/browse')}`}>
          <Search size={20} /> Explorer
        </Link>
        <Link to="/top" className={`nav-link ${isActive('/top')}`}>
          <Heart size={20} /> Top Recettes
        </Link>
      </div>

      <div className="menu-group">
        <div className="menu-title">Ton Espace</div>
        <Link to="/list" className={`nav-link ${isActive('/list')}`}>
          <List size={20} /> Liste de courses
        </Link>
        <Link to="/my-recipes" className={`nav-link ${isActive('/my-recipes')}`}>
          <ChefHat size={20} /> Mes Recettes
        </Link>
        <Link to="/planner" className={`nav-link ${isActive('/planner')}`}>
          <Calendar size={20} /> Calendrier
        </Link>
      </div>
      
      <div style={{marginTop: 'auto'}}>
        <Link to="/settings" className={`nav-link ${isActive('/settings')}`}>
            <Settings size={20} /> Paramètres
        </Link>
        <div onClick={handleLogout} className="nav-link" style={{cursor: 'pointer', color: '#d9534f'}}>
            <LogOut size={20} /> Déconnexion
        </div>
      </div>
    </nav>
  );
};

// Le reste du fichier (Layout, App...) ne change pas, mais je le remets pour que tu puisses tout copier d'un coup
const Layout = ({ children }) => {
  const { user, token } = useAuth();
  
  if (!user || !token) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/recipe/:id" element={<Layout><RecipeDetail /></Layout>} />
          <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />

          <Route path="/create-recipe" element={<Layout><CreateRecipe /></Layout>} />
          
          <Route path="/my-recipes" element={<Layout><MyRecipes /></Layout>} />
          <Route path="/list" element={<Layout><h2>Liste de courses (À venir)</h2></Layout>} />
          <Route path="/planner" element={<Layout><h2>Calendrier (À venir)</h2></Layout>} />
          <Route path="/browse" element={<Layout><h2>Explorer (À venir)</h2></Layout>} />
          <Route path="/top" element={<Layout><h2>Top Recettes (À venir)</h2></Layout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;