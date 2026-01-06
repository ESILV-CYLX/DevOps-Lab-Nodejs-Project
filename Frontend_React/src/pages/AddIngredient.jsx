import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, ShoppingBasket } from 'lucide-react';
import { ingredientService } from '../services/api';

export default function AddIngredient() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: ''
  });

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await ingredientService.getCategories(token);
        setCategories(data);
        // Définit la première catégorie comme valeur par défaut
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, category: data[0] }));
        }
      } catch (err) {
        console.error("Could not load categories", err);
      }
    };
    if (token) fetchCats();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await ingredientService.create(token, {
        ...formData,
        price: parseFloat(formData.price)
      });
      alert("Ingredient added to catalog!");
      navigate('/');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px' }}>
        <ArrowLeft size={20} /> Back
      </button>

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontSize: '2rem', margin: '0 0 10px 0' }}>Add New Ingredient</h1>
        <p style={{ color: '#666' }}>Expand the global catalog for everyone.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        
        <div style={{ marginBottom: '25px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Ingredient Name *</label>
          <input 
            className="login-input"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="e.g. Saffron"
            required
          />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Category *</label>
          <select 
            className="login-input"
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            required
          >
            {/* Si les catégories ne sont pas encore chargées */}
            {categories.length === 0 && <option value="">Loading categories...</option>}
            
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0) + cat.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Estimated Price (€) *</label>
          <input 
            type="number"
            step="0.01"
            className="login-input"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            placeholder="0.00"
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn-primary"
          disabled={loading}
          style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontSize: '1.1rem', padding: '15px' }}
        >
          <ShoppingBasket size={20} /> {loading ? 'Adding...' : 'Add to Catalog'}
        </button>

      </form>
    </div>
  );
}