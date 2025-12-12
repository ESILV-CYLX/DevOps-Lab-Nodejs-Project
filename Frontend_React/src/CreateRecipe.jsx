import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ArrowLeft, Trash2, Plus, AlertCircle } from 'lucide-react'; // Added AlertCircle icon
import { ingredientsDB, categories, units } from './ingredientsDB';

// Define cuisine type options
const cuisineOptions = [
  "Other",
  "French",
  "Italian",
  "Spanish",
  "American",
  "Mediterranean",
  "Asian",
  "Korean",
  "Japanese",
  "Chinese",
  "Exotic",
  "Indian",
  "Mexican"
];

export default function CreateRecipe() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // New state for handling errors cleanly on the page
  const [formError, setFormError] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    prepTime: 15,
    cookTime: 30,
    difficulty: 1,
    cuisineType: 'Other',
    servings: 2,
    instructionsText: '',
    image: ''
  });

  const [selectedIngredients, setSelectedIngredients] = useState([]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData({ ...formData, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const addIngredient = () => {
    // Clear error when user adds an ingredient
    setFormError(null);
    setSelectedIngredients([...selectedIngredients, { 
        tempCategory: categories[0], 
        ingredientId: '', 
        name: '', 
        quantity: 100, 
        unit: 'g' 
    }]);
  };

  const updateIngredient = (index, field, value) => {
    const newList = [...selectedIngredients];
    newList[index][field] = value;
    if (field === 'tempCategory') {
        newList[index].ingredientId = '';
        newList[index].name = '';
    }
    if (field === 'ingredientId') {
        const found = ingredientsDB.find(i => i.ingredientId === parseInt(value));
        if (found) newList[index].name = found.name;
    }
    setSelectedIngredients(newList);
  };

  const removeIngredient = (index) => {
    setSelectedIngredients(selectedIngredients.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null); // Reset errors

    // 1. VALIDATION: Check ingredients list inside the page
    if (selectedIngredients.length === 0) {
        setFormError("Please add at least one ingredient to your recipe.");
        return;
    }

    setLoading(true);

    const payload = {
      ...formData,
      recipeId: Math.floor(Math.random() * 1000000),
      prepTime: parseInt(formData.prepTime), 
      cookTime: parseInt(formData.cookTime),
      difficulty: parseInt(formData.difficulty),
      servings: parseInt(formData.servings),
      instructions: formData.instructionsText.split('\n').filter(line => line.trim() !== ''),
      tags: ['New'],
      ingredients: selectedIngredients.map(ing => ({
          ingredientId: parseInt(ing.ingredientId),
          name: ing.name,
          quantity: parseFloat(ing.quantity),
          unit: ing.unit
      })),
      privacy: false
    };

    try {
      const response = await fetch('http://localhost:3000/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/');
      } else {
         if (response.status === 401 || response.status === 403) {
            setFormError("Session expired. Please Log In again.");
        } else {
            setFormError(`Error: ${data.error || "Unknown error"}`);
        }
      }
    } catch (error) {
      console.error(error);
      setFormError("Server Error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', paddingBottom: '50px' }}>
      <button onClick={() => navigate(-1)} style={styles.backBtn}>
        <ArrowLeft size={20} style={{marginRight: '5px'}}/> Cancel
      </button>

      <h1>Create a Recipe 🍳</h1>
      
      <form onSubmit={handleSubmit} style={styles.formCard}>
        
        {/* IMAGE UPLOAD (Mandatory) */}
        <div>
            <label style={styles.label}>Dish Photo *</label>
            <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                style={styles.input} 
                required 
            />
            {formData.image && (
                <img src={formData.image} alt="Preview" style={styles.previewImg} />
            )}
        </div>

        {/* DETAILS */}
        <div>
          <label style={styles.label}>Recipe Title *</label>
          <input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} style={styles.input} />
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
             <div>
                <label style={styles.label}>Prep Time (minutes) *</label>
                <input type="number" min="0" required value={formData.prepTime} onChange={(e) => setFormData({...formData, prepTime: e.target.value})} style={styles.input} />
            </div>
            <div>
                <label style={styles.label}>Cook Time (minutes) *</label>
                <input type="number" min="0" required value={formData.cookTime} onChange={(e) => setFormData({...formData, cookTime: e.target.value})} style={styles.input} />
            </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px'}}>
            <div>
                <label style={styles.label}>Difficulty *</label>
                <select value={formData.difficulty} onChange={(e) => setFormData({...formData, difficulty: e.target.value})} style={styles.input}>
                    <option value="1">Easy</option>
                    <option value="2">Medium</option>
                    <option value="3">Hard</option>
                </select>
            </div>
            <div>
                <label style={styles.label}>Servings *</label>
                <input type="number" min="1" required value={formData.servings} onChange={(e) => setFormData({...formData, servings: e.target.value})} style={styles.input} />
            </div>
            <div>
                <label style={styles.label}>Cuisine Type *</label>
                <select 
                    value={formData.cuisineType} 
                    onChange={(e) => setFormData({...formData, cuisineType: e.target.value})} 
                    style={styles.input}
                >
                    {cuisineOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
            </div>
        </div>

        {/* INGREDIENTS */}
        <div style={{background: '#f9f9f9', padding: '15px', borderRadius: '8px', border: formError && selectedIngredients.length === 0 ? '2px solid #ff4d4d' : 'none'}}>
            <label style={styles.label}>Ingredients *</label>
            {selectedIngredients.map((ing, index) => (
                <div key={index} style={{display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center'}}>
                    <select style={{...styles.select, width: '120px'}} value={ing.tempCategory} onChange={(e) => updateIngredient(index, 'tempCategory', e.target.value)}>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>

                    <select style={{...styles.select, flex: 1}} value={ing.ingredientId} onChange={(e) => updateIngredient(index, 'ingredientId', e.target.value)} required>
                        <option value="">-- Select --</option>
                        {ingredientsDB
                            .filter(dbIng => dbIng.category === ing.tempCategory)
                            .map(dbIng => <option key={dbIng.ingredientId} value={dbIng.ingredientId}>{dbIng.name}</option>)
                        }
                    </select>

                    <input type="number" min="0" style={{...styles.input, width: '70px'}} value={ing.quantity} onChange={(e) => updateIngredient(index, 'quantity', e.target.value)} required />
                    
                    <select style={{...styles.select, width: '80px'}} value={ing.unit} onChange={(e) => updateIngredient(index, 'unit', e.target.value)}>
                        {units.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>

                    <button type="button" onClick={() => removeIngredient(index)} style={{color: 'red', border: 'none', background: 'none', cursor: 'pointer'}}><Trash2 size={18} /></button>
                </div>
            ))}
            <button type="button" onClick={addIngredient} style={styles.addBtn}>
                <Plus size={16} /> Add Ingredient
            </button>
        </div>

        {/* DESCRIPTION - Optional now */}
        <div>
          <label style={styles.label}>Description</label>
          <textarea 
            value={formData.description} 
            onChange={(e) => setFormData({...formData, description: e.target.value})} 
            style={{...styles.input, height: '60px'}} 
          />
        </div>

        <div>
          <label style={styles.label}>Instructions (one per line) *</label>
          <textarea required value={formData.instructionsText} onChange={(e) => setFormData({...formData, instructionsText: e.target.value})} style={{...styles.input, height: '120px'}} />
        </div>

        {/* CLEAN ERROR MESSAGE DISPLAY */}
        {formError && (
            <div style={styles.errorBox}>
                <AlertCircle size={20} />
                <span>{formError}</span>
            </div>
        )}

        <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Publishing...' : 'Publish Recipe'}
        </button>
      </form>
    </div>
  );
}

const styles = {
    backBtn: {background:'none', border:'none', cursor:'pointer', display: 'flex', alignItems: 'center', marginBottom: '20px', color: '#666'},
    formCard: {display: 'flex', flexDirection: 'column', gap: '25px', background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'},
    label: { fontWeight: '600', display: 'block', marginBottom: '5px', fontSize: '0.9rem' },
    input: { padding: '10px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box', width: '100%' },
    select: { padding: '10px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: 'white' },
    previewImg: {width: '100%', height: '200px', objectFit: 'cover', marginTop: '10px', borderRadius: '8px'},
    addBtn: {display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.9rem', color: 'black', background: 'white', border: '1px solid black', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer'},
    errorBox: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '15px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #fca5a5' }
};