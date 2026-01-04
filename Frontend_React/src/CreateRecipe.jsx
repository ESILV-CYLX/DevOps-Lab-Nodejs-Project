import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { ArrowLeft, ChefHat, Plus, X, UploadCloud, AlertCircle } from 'lucide-react';

// Temporarely left because databse not completed yet
const INGREDIENT_DATA = {
  "Vegetables & Greens": ["Tomato", "Onion", "Garlic", "Potato", "Carrot", "Bell Pepper", "Spinach", "Lettuce", "Cucumber", "Avocado", "Mushrooms", "Zucchini", "Broccoli", "Cauliflower", "Corn", "Green Beans", "Ginger"],
  "Fruits": ["Apple", "Banana", "Lemon", "Lime", "Orange", "Strawberry", "Blueberry", "Pineapple", "Mango", "Grapes"],
  "Meat & Poultry": ["Chicken Breast", "Chicken Thighs", "Ground Beef", "Steak", "Bacon", "Pork Chop", "Turkey", "Lamb", "Sausage", "Ham"],
  "Seafood": ["Salmon", "Tuna", "Shrimp", "Cod", "Crab", "Lobster", "Mussels", "Scallops"],
  "Dairy & Eggs": ["Butter", "Eggs", "Milk", "Cheese", "Cheddar", "Mozzarella", "Parmesan", "Yogurt", "Cream", "Sour Cream"],
  "Grains & Bread": ["Rice", "Pasta", "Spaghetti", "Noodles", "Bread", "Tortilla", "Quinoa", "Oats", "Flour", "Breadcrumbs"],
  "Pantry & Spices": ["Sugar", "Salt", "Olive Oil", "Vegetable Oil", "Soy Sauce", "Vinegar", "Honey", "Mustard", "Mayonnaise", "Ketchup", "Tomato Sauce", "Broth", "Black Pepper", "Chili Powder", "Cinnamon", "Vanilla Extract", "Baking Powder", "Cumin", "Paprika", "Turmeric"],
  "Herbs": ["Basil", "Oregano", "Parsley", "Thyme", "Cilantro", "Rosemary", "Mint", "Dill", "Chives"]
};

const PREDEFINED_UNITS = [
  "g", "kg", "ml", "cl", "L", "tbsp", "tsp", "cup", "pcs", "pinch", "slice", "clove", "can"
];

// Complete Cuisine List
const CUISINE_TYPES = [
  "African", "American", "Asian", "British", "Chinese", "French", "German", 
  "Greek", "Indian", "Italian", "Japanese", "Korean", "Mediterranean", 
  "Mexican", "Middle Eastern", "Spanish", "Thai", "Other"
];

export default function CreateRecipe() {
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Specific Error States
  const [ingredientError, setIngredientError] = useState('');
  const [imageError, setImageError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    prepTime: '',
    cookTime: '',
    difficulty: 1,
    flavor: 'Salty',
    servings: 2,
    cuisineType: 'Other',
    ingredients: [],
    description: '',
    instructions: [],
    image: '' 
  });

  // HANDLERS

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageError(''); // Clear error
      setImagePreview(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => {
          setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...formData.ingredients];
    
    // If changing category, reset the name
    if (field === 'category') {
        newIngredients[index].category = value;
        newIngredients[index].name = '';
    } else {
        newIngredients[index][field] = value;
    }
    
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const addIngredient = () => {
    setIngredientError('');
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { category: '', name: '', quantity: '', unit: 'g' }]
    });
  };

  const removeIngredient = (index) => {
    const newIngredients = formData.ingredients.filter((_, i) => i !== index);
    setFormData({ ...formData, ingredients: newIngredients });
  };

  const handleInstructionChange = (e) => {
    const text = e.target.value;
    const steps = text.split('\n');
    setFormData({ ...formData, instructions: steps });
  };

  // CREATE ACTION

  const handleCreate = async (e) => {
    e.preventDefault();
    
    // Check image
    if (!formData.image) {
        setImageError("Please upload a photo of your dish.");
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    // Check ingredients
    if (formData.ingredients.length === 0) {
        setIngredientError("Please add at least one ingredient.");
        const element = document.getElementById('ingredients-section');
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    
    // Check for empty fields
    for (let ing of formData.ingredients) {
        if (!ing.name || !ing.quantity || !ing.category) {
             setIngredientError("Please complete all ingredient fields (Category, Name, Quantity).");
             const element = document.getElementById('ingredients-section');
             if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
             return;
        }
    }

    setLoading(true);

    // Prepare payload
    const payload = {
        ...formData,
        prepTime: parseInt(formData.prepTime) || 0,
        cookTime: parseInt(formData.cookTime) || 0,
        servings: parseInt(formData.servings) || 1,
        difficulty: parseInt(formData.difficulty) || 1,
        
        ingredients: formData.ingredients.map(ing => ({
            name: ing.name,
            quantity: ing.quantity,
            unit: ing.unit
        }))
    };

    try {
      const res = await fetch('http://localhost:3000/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("Recipe published successfully! 🎉");
        navigate('/'); 
      } else {
        const errData = await res.json();
        alert(`Failed to create: ${errData.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error creating recipe.");
    } finally {
        setLoading(false);
    }
  };

  if (loading) return <div style={{padding:'40px', textAlign:'center'}}>Publishing...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px' }}>
        <ArrowLeft size={20} /> Cancel
      </button>

      <h1 style={{fontSize: '2rem', marginBottom: '30px', textAlign: 'center'}}>Create a Recipe</h1>

      <form onSubmit={handleCreate} style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 2px 15px rgba(0,0,0,0.05)' }}>
        
        {/* IMAGE UPLOAD */}
        <div style={{marginBottom: '30px', textAlign: 'center', border: imageError ? '2px solid red' : 'none', borderRadius: '12px', padding: imageError ? '10px' : '0'}}>
           <label style={{fontWeight: 'bold', display:'block', marginBottom:'15px'}}>Dish Photo *</label>
           
           <input type="file" id="imageUpload" accept="image/*" onChange={handleImageChange} style={{display: 'none'}} />
           
           <label htmlFor="imageUpload" style={{cursor: 'pointer', display: 'inline-block'}}>
              {imagePreview ? (
                  <div style={{position: 'relative', width: '100%', maxWidth: '500px', margin: '0 auto'}}>
                      <img src={imagePreview} alt="Preview" style={{width: '100%', height: '300px', objectFit: 'cover', borderRadius: '12px'}} />
                      <div style={{position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '8px 15px', borderRadius: '20px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '5px'}}>
                          <UploadCloud size={16}/> Change Photo
                      </div>
                  </div>
              ) : (
                  <div style={{border: '2px dashed #ccc', padding: '40px', borderRadius: '12px', background: '#f9f9f9', color: '#888'}}>
                      <UploadCloud size={40} style={{marginBottom: '10px'}}/>
                      <p>Click to upload an image</p>
                  </div>
              )}
           </label>
           {imageError && <div style={{color: 'red', marginTop: '10px', fontWeight: 'bold'}}>{imageError}</div>}
        </div>

        {/* TITLE */}
        <div style={{marginBottom: '25px'}}>
            <label style={{fontWeight: 'bold', display:'block', marginBottom:'8px'}}>Recipe Title *</label>
            <input name="title" value={formData.title} onChange={handleChange} className="login-input" required placeholder="e.g., Grandma's Lasagna" />
        </div>

        {/* TIMES & SERVINGS */}
        <div style={{display: 'flex', gap: '20px', marginBottom: '25px', flexWrap: 'wrap'}}>
            <div style={{flex: 1, minWidth: '150px'}}>
                <label style={{fontWeight: 'bold', display:'block', marginBottom:'8px'}}>Prep Time (min) *</label>
                <input type="number" name="prepTime" value={formData.prepTime} onChange={handleChange} className="login-input" required />
            </div>
            <div style={{flex: 1, minWidth: '150px'}}>
                <label style={{fontWeight: 'bold', display:'block', marginBottom:'8px'}}>Cook Time (min) *</label>
                <input type="number" name="cookTime" value={formData.cookTime} onChange={handleChange} className="login-input" required />
            </div>
            <div style={{flex: 1, minWidth: '150px'}}>
                <label style={{fontWeight: 'bold', display:'block', marginBottom:'8px'}}>Servings *</label>
                <input type="number" name="servings" value={formData.servings} onChange={handleChange} className="login-input"/>
             </div>
        </div>

        {/* DROPDOWNS */}
        <div style={{display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap'}}>
             <div style={{flex: 1, minWidth: '180px'}}>
                <label style={{fontWeight: 'bold', display:'block', marginBottom:'8px'}}>Difficulty</label>
                <select name="difficulty" value={formData.difficulty} onChange={handleChange} className="login-input">
                    <option value={1}>Easy</option>
                    <option value={2}>Medium</option>
                    <option value={3}>Hard</option>
                </select>
             </div>
             <div style={{flex: 1, minWidth: '180px'}}>
                <label style={{fontWeight: 'bold', display:'block', marginBottom:'8px'}}>Flavor</label>
                <select name="flavor" value={formData.flavor} onChange={handleChange} className="login-input">
                    <option value="Salty">Salty</option>
                    <option value="Sweet">Sweet</option>
                </select>
             </div>
             <div style={{flex: 1, minWidth: '180px'}}>
                <label style={{fontWeight: 'bold', display:'block', marginBottom:'8px'}}>Cuisine Type *</label>
                <select name="cuisineType" value={formData.cuisineType} onChange={handleChange} className="login-input">
                    {CUISINE_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
        </div>

        {/* INGREDIENTS SECTION */}
        <div id="ingredients-section" style={{background: '#f8f9fa', padding: '25px', borderRadius: '12px', marginBottom: '30px', border: ingredientError ? '2px solid #ff4d4d' : '1px solid #eee'}}>
            <label style={{fontWeight: 'bold', display:'block', marginBottom:'20px', fontSize: '1.1rem'}}>Ingredients</label>
            
            {formData.ingredients.map((ing, index) => (
                <div key={index} style={{display: 'flex', gap: '10px', marginBottom: '15px', alignItems: 'center', flexWrap: 'wrap'}}>
                    
                    {/* 1. SELECT CATEGORY */}
                    <select 
                        value={ing.category} 
                        onChange={(e) => handleIngredientChange(index, 'category', e.target.value)}
                        className="login-input" 
                        style={{flex: 2, minWidth: '120px', marginBottom: 0}}
                    >
                        <option value="">Category...</option>
                        {Object.keys(INGREDIENT_DATA).map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    {/* 2. SELECT INGREDIENT (Based on Category) */}
                    <select 
                        value={ing.name} 
                        onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                        className="login-input" 
                        style={{flex: 3, minWidth: '150px', marginBottom: 0}}
                        disabled={!ing.category} // Disable if no category picked
                    >
                        <option value="">Ingredient...</option>
                        {ing.category && INGREDIENT_DATA[ing.category].sort().map(item => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>

                    {/* 3. QUANTITY */}
                    <input 
                        type="number"
                        placeholder="Qty" 
                        value={ing.quantity} 
                        onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                        className="login-input" 
                        style={{flex: 1, minWidth: '70px', marginBottom: 0}}
                        min="0" step="0.1"
                    />

                    {/* 4. UNIT */}
                    <select 
                        value={ing.unit} 
                        onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                        className="login-input" 
                        style={{flex: 1, minWidth: '70px', marginBottom: 0}}
                    >
                        {PREDEFINED_UNITS.map(u => (
                            <option key={u} value={u}>{u}</option>
                        ))}
                    </select>

                    <button type="button" onClick={() => removeIngredient(index)} style={{border: 'none', background: '#ffebee', color: '#d32f2f', padding: '8px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <X size={18} />
                    </button>
                </div>
            ))}
            
            <button type="button" onClick={addIngredient} style={{background: 'black', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', marginTop: '10px'}}>
                <Plus size={18} /> Add Ingredient
            </button>

            {ingredientError && (
                <div style={{color: '#d32f2f', marginTop: '15px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', background: '#fff0f0', padding: '10px', borderRadius: '8px'}}>
                    <AlertCircle size={18} /> {ingredientError}
                </div>
            )}
        </div>

        {/* INSTRUCTIONS */}
        <div style={{marginBottom: '25px'}}>
            <label style={{fontWeight: 'bold', display:'block', marginBottom:'8px'}}>Description (Optional)</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="login-input" rows={3} placeholder="Tell us a little bit about this dish..." style={{resize: 'vertical', fontFamily: 'inherit'}} />
        </div>

        <div style={{marginBottom: '30px'}}>
            <label style={{fontWeight: 'bold', display:'block', marginBottom:'8px'}}>Instructions * (one step per line)</label>
            <textarea value={formData.instructions.join('\n')} onChange={handleInstructionChange} className="login-input" rows={8} placeholder="Step 1:..." style={{resize: 'vertical', fontFamily: 'inherit', whiteSpace: 'pre-wrap'}} required />
        </div>
        
        {/* BUTTON */}
        <div style={{ marginTop: '30px', paddingTop: '30px', borderTop: '2px solid #f0f0f0' }}>
            <button type="submit" className="btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontSize: '1.2rem', padding: '15px' }}>
                <ChefHat size={24} /> Publish Recipe
            </button>
        </div>
      </form>
    </div>
  );
}