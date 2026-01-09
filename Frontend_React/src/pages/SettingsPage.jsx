import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/api';

export default function SettingsPage() {
  const { user, token, login } = useAuth();

  const [preferences, setPreferences] = useState({
    vegetarian: false,
    glutenFree: false,
    lactoseFree: false,
    notifications: true
  });

  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user.dietaryPreferences) {
      setPreferences({
        vegetarian: user.dietaryPreferences.includes('vegetarian'),
        glutenFree: user.dietaryPreferences.includes('glutenFree'),
        lactoseFree: user.dietaryPreferences.includes('lactoseFree'),
        notifications: user.notifications ?? true
      });
    }
  }, [user]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setPreferences(prev => ({ ...prev, [name]: checked }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const dietaryPreferences = [];
      if (preferences.vegetarian) dietaryPreferences.push('vegetarian');
      if (preferences.glutenFree) dietaryPreferences.push('glutenFree');
      if (preferences.lactoseFree) dietaryPreferences.push('lactoseFree');

      const updateData = {
        dietaryPreferences,
        notifications: preferences.notifications,
        username: user.username,
        email: user.email
      };

      const updatedUser = await userService.update(token, user.userId, updateData);
      login(updatedUser, token); 
      setMessage({ text: 'Settings updated successfully!', type: 'success' });
    } catch (err) {
      setMessage({ text: 'Error updating settings. Please try again.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Settings</h1>
      <div style={{ background: 'white', padding: '30px', borderRadius: '12px', marginTop: '20px' }}>
        
        {/* Notification Message */}
        {message.text && (
          <div style={{
            padding: '15px',
            marginBottom: '20px',
            borderRadius: '8px',
            backgroundColor: message.type === 'success' ? '#d4edda' : '#f8d7da',
            color: message.type === 'success' ? '#155724' : '#721c24',
            border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
          }}>
            {message.text}
          </div>
        )}

        <h3>Food Preferences</h3>
        <p style={{color: '#666', marginBottom: '20px'}}>These filters will be applied to your recommendations.</p>

        <div style={styles.option}>
          <label>Vegetarian</label>
          <input type="checkbox" checked={preferences.vegetarian} onChange={handleCheckboxChange} name="vegetarian" />
        </div>
        <div style={styles.option}>
          <label>Gluten-Free</label>
          <input type="checkbox" checked={preferences.glutenFree} onChange={handleCheckboxChange} name="glutenFree" />
        </div>
        <div style={styles.option}>
          <label>Lactose-Free</label>
          <input type="checkbox" checked={preferences.lactoseFree} onChange={handleCheckboxChange} name="lactoseFree" />
        </div>

        <h3 style={{marginTop: '40px'}}>Account</h3>
        <div style={styles.option}>
          <label>Email Notifications</label>
          <input type="checkbox" checked={preferences.notifications} onChange={handleCheckboxChange} name="notifications" />
        </div>

        <button className="btn-primary" style={{marginTop: '20px'}} onClick={handleSave} disabled={loading || !user}>
          {loading ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  option: { display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #eee' }
};