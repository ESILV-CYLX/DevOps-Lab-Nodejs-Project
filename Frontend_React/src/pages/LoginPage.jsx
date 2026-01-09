import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { ArrowLeft } from 'lucide-react';

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
    try {
      if (isLoginMode) {
        const data = await authService.login(formData);
        login(data.user || { name: formData.username }, data.token);
        navigate('/');
      } else {
        await authService.signup(formData);
        setMessage('Account created successfully! Please log in.');
        setIsLoginMode(true);
        setFormData(prev => ({ ...prev, password: '' }));
      }
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="login-page-container">
      <button 
        onClick={() => navigate('/')}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#666',
          fontSize: '1rem',
          fontWeight: '500',
          transition: 'color 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#000'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
        title="Back to Dashboard"
      >
        <ArrowLeft size={20} /> 
        <span>Back to Dashboard</span>
      </button>



      <div className="login-card">
        <h1 style={{margin: '0 0 10px 0'}}>Smart Meal</h1>
        <p style={{marginBottom: '20px', color: '#666'}}>
          {isLoginMode ? 'Log in to your account' : 'Join the community'}
        </p>
        
        {message && (
          <div style={{
            color: message.includes('success') ? 'green' : 'red', 
            marginBottom: '15px', 
            padding: '10px',
            background: message.includes('success') ? '#e6fffa' : '#fff5f5',
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
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="login-input"
            required
          />

          {/* Champ Email (Visible SEULEMENT si inscrit) */}
          {!isLoginMode && (
            <input
              type="email"
              name="email" 
              placeholder="Your Email (e.g., me@test.com)"
              value={formData.email}
              onChange={handleChange}
              className="login-input"
              required
            />
          )}

          <input 
            type="password" 
            name="password"
            placeholder="Password" 
            value={formData.password}
            onChange={handleChange}
            className="login-input"
            required
          />
          
          <button type="submit" className="btn-primary" style={{width: '100%', marginBottom: '15px'}}>
            {isLoginMode ? 'Log in' : "Sign up"}
          </button>
        </form>

        <div style={{fontSize: '0.9rem', color: '#555'}}>
          {isLoginMode ? "Don't have an account yet? " : "Already have an account? "}
          <span 
            onClick={() => { setIsLoginMode(!isLoginMode); setMessage(''); }} 
            style={{color: 'black', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline'}}
          >
            {isLoginMode ? "Create an account" : "Log in"}
          </span>
        </div>
      </div>
    </div>
  );
}