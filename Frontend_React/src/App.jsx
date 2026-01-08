// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Home, Search, Calendar, List, Heart, Settings, PlusCircle, LogOut, ChefHat } from 'lucide-react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import RecipeDetail from './pages/RecipeDetail';
import SettingsPage from './pages/SettingsPage';
import './styles/App.css';
import CreateRecipe from './pages/CreateRecipe';
import MyRecipes from './pages/MyRecipes';
import SavedRecipes from './pages/SavedRecipes';
import ModifyRecipe from './pages/ModifyRecipe';
import ShoppingList from './pages/ShoppingList';
import AddIngredient from './pages/AddIngredient';
import CalendarPage from './pages/Calendar';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="sidebar">
      <div className="brand">Smart Meal Planner</div>
      
      <div className="menu-group">
        <div className="menu-title">Discover</div>
        <Link to="/" className={`nav-link ${isActive('/')}`}>
          <Home size={20} /> Home
        </Link>
        <Link to="/saved" className={`nav-link ${isActive('/saved')}`}>
          <Heart size={20} /> Saved Recipes
        </Link>
      </div>

      <div className="menu-group">
        <div className="menu-title">Your Space</div>
        <Link to="/list" className={`nav-link ${isActive('/list')}`}>
          <List size={20} /> Shopping List
        </Link>
        <Link to="/my-recipes" className={`nav-link ${isActive('/my-recipes')}`}>
          <ChefHat size={20} /> My Recipes
        </Link>
        <Link to="/planner" className={`nav-link ${isActive('/planner')}`}>
          <Calendar size={20} /> Calendar
        </Link>
      </div>
      
      <div style={{marginTop: 'auto'}}>
        <Link to="/settings" className={`nav-link ${isActive('/settings')}`}>
            <Settings size={20} /> Settings
        </Link>
        <div onClick={handleLogout} className="nav-link" style={{cursor: 'pointer', color: '#d9534f'}}>
            <LogOut size={20} /> Logout
        </div>
      </div>
    </nav>
  );
};

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
          
          {/* Dashboard manages its own scroll, so no wrapper needed here */}
          <Route path="/" element={<Layout><Dashboard /></Layout>} />

          {/* Wrap other pages so they scroll and have padding */}
          <Route path="/recipe/:id" element={
            <Layout><div className="scrollable-page"><RecipeDetail /></div></Layout>
          } />
          
          <Route path="/settings" element={
            <Layout><div className="scrollable-page"><SettingsPage /></div></Layout>
          } />

          <Route path="/create-recipe" element={
            <Layout><div className="scrollable-page"><CreateRecipe /></div></Layout>
          } />

          <Route path="/modify-recipe/:id" element={
            <Layout><div className="scrollable-page"><ModifyRecipe /></div></Layout>
          } />
          
          <Route path="/my-recipes" element={
            <Layout><div className="scrollable-page"><MyRecipes /></div></Layout>
          } />

          <Route path="/saved" element={
            <Layout><div className="scrollable-page"><SavedRecipes /></div></Layout>
          } />

          <Route path="/list" element={
            <Layout><div className="scrollable-page"><ShoppingList /></div></Layout>
          } />

          <Route path="/add-ingredient" element={
              <Layout><div className="page-content"><AddIngredient /></div></Layout>
          } />
          
          <Route path="/planner" element={
            <Layout><div className="scrollable-page"><CalendarPage /></div></Layout>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;