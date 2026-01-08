// src/App.jsx
import React, { use } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Home, Search, Calendar, List, Heart, Settings, PlusCircle, LogOut, LogIn, ChefHat } from 'lucide-react';
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
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (user) {
      logout();
      navigate('/');
    } else {
      navigate('/login');
    }
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
        {user && (
          <Link to="/saved" className={`nav-link ${isActive('/saved')}`}>
            <Heart size={20} /> Saved Recipes
          </Link>
        )}
      </div>
      
      {/* YOUR SPACE SECTION */}
      {user && (
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
      )}
      
      <div style={{marginTop: 'auto'}}>
        {user && (
          <Link to="/settings" className={`nav-link ${isActive('/settings')}`}>
              <Settings size={20} /> Settings
          </Link>
        )}
        <div onClick={handleAuthAction} className="nav-link" style={{cursor: 'pointer', color: user ? '#d9534f' : '#28a745'}}>
            {user ? <LogOut size={20} /> : <LogIn size={20} />}
            {user ? ' Logout' : ' Log In for more features...'}
        </div>
      </div>
    </nav>
  );
};

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

const PrivateRoute = ({ children }) => {
  const { user, token } = useAuth();
  if (!user || !token) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Public Routes */}
          <Route path="/" element={
            <Layout><Dashboard /></Layout>
          } />

          <Route path="/recipe/:id" element={
            <Layout><div className="scrollable-page"><RecipeDetail /></div></Layout>
          } />
          
          {/* Private Routes */}
          <Route path="/settings" element={
            <PrivateRoute><Layout><div className="scrollable-page"><SettingsPage /></div></Layout></PrivateRoute>
          } />

          <Route path="/create-recipe" element={
            <PrivateRoute><Layout><div className="scrollable-page"><CreateRecipe /></div></Layout></PrivateRoute>
          } />

          <Route path="/modify-recipe/:id" element={
            <PrivateRoute><Layout><div className="scrollable-page"><ModifyRecipe /></div></Layout></PrivateRoute>
          } />
          
          <Route path="/my-recipes" element={
            <PrivateRoute><Layout><div className="scrollable-page"><MyRecipes /></div></Layout></PrivateRoute>
          } />

          <Route path="/saved" element={
            <PrivateRoute><Layout><div className="scrollable-page"><SavedRecipes /></div></Layout></PrivateRoute>
          } />

          <Route path="/list" element={
            <PrivateRoute><Layout><div className="scrollable-page"><ShoppingList /></div></Layout></PrivateRoute>
          } />

          <Route path="/add-ingredient" element={
              <PrivateRoute><Layout><div className="page-content"><AddIngredient /></div></Layout></PrivateRoute>
          } />
          
          <Route path="/planner" element={
            <PrivateRoute><Layout><div className="scrollable-page"><CalendarPage /></div></Layout></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;