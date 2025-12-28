// src/LoginPage.jsx
import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    username: '', 
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const endpoint = isLoginMode 
      ? 'http://localhost:3000/auth/login' 
      : 'http://localhost:3000/auth/signup';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLoginMode) {
          // On passe l'objet User complet ET le Token
          // Le backend renvoie { message, token, user }
          const userData = data.user || { name: formData.username }; // Fallback si user vide
          login(userData, data.token); 
          navigate('/');
        } else {
          setMessage('Compte créé avec succès ! Connectez-vous.');
          setIsLoginMode(true);
          // On vide le mot de passe mais on garde le reste pour faciliter la connexion
          setFormData(prev => ({ ...prev, password: '' })); 
        }
      } else {
        setMessage(data.error || 'Une erreur est survenue');
      }
    } catch (error) {
      console.error(error);
      setMessage("Impossible de contacter le serveur (Vérifie qu'il tourne sur le port 3000 !)");
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <h1 style={{margin: '0 0 10px 0'}}>Smart Meal</h1>
        <p style={{marginBottom: '20px', color: '#666'}}>
          {isLoginMode ? 'Connectez-vous à votre espace' : 'Rejoignez la communauté'}
        </p>
        
        {message && (
          <div style={{
            color: message.includes('succès') ? 'green' : 'red', 
            marginBottom: '15px', 
            padding: '10px',
            background: message.includes('succès') ? '#e6fffa' : '#fff5f5',
            borderRadius: '5px'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Champ Username */}
          <input
            type="text"
            name="username" 
            placeholder="Nom d'utilisateur"
            value={formData.username}
            onChange={handleChange}
            className="login-input"
            required
          />

          {/* Champ Email (Visible SEULEMENT si on s'inscrit) */}
          {!isLoginMode && (
            <input
              type="email"
              name="email" 
              placeholder="Votre Email (ex: moi@test.com)"
              value={formData.email}
              onChange={handleChange}
              className="login-input"
              required
            />
          )}

          <input 
            type="password" 
            name="password"
            placeholder="Mot de passe" 
            value={formData.password}
            onChange={handleChange}
            className="login-input"
            required
          />
          
          <button type="submit" className="btn-primary" style={{width: '100%', marginBottom: '15px'}}>
            {isLoginMode ? 'Se connecter' : "S'inscrire"}
          </button>
        </form>

        <div style={{fontSize: '0.9rem', color: '#555'}}>
          {isLoginMode ? "Pas encore de compte ? " : "Déjà un compte ? "}
          <span 
            onClick={() => { setIsLoginMode(!isLoginMode); setMessage(''); }} 
            style={{color: 'black', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline'}}
          >
            {isLoginMode ? "Créer un compte" : "Se connecter"}
          </span>
        </div>
      </div>
    </div>
  );
}