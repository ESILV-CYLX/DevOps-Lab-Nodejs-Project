import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Trash2, Save, Plus, X, UploadCloud, AlertCircle } from 'lucide-react';
import { recipeService, ingredientService } from '../services/api';

export default function ModifyRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [ingredientError, setIngredientError] = useState('');
  const [imageError, setImageError] = useState('');

  const [allIngredientsFromDB, setAllIngredientsFromDB] = useState([]);
  const [metadata, setMetadata] = useState({
    cuisineTypes: [],
    flavors: [],
    units: []
  });

  const [formData, setFormData] = useState({
    title: '',
    prepTime: '',
    cookTime: '',
    difficulty: 1,
    flavor: '',
    servings: 2,
    cuisineType: '',
    ingredients: [],
    description: '',
    instructions: [],
    image: '' 
  });

  // 1. Fetch Existing Data & Map Categories
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const [recipe, allIngredients, meta] = await Promise.all([
          recipeService.getById(token, id),
          ingredientService.getAll(token),
          recipeService.getMetadata(token)
        ]);

        setAllIngredientsFromDB(allIngredients);
        setMetadata(meta);

        if (user && recipe.userId !== user.userId) {
            alert("You are not the owner of this recipe!");
            navigate('/');
            return;
        }

        // --- REVERSE LOOKUP: FIND CATEGORY FOR EACH INGREDIENT ---
        const enrichedIngredients = recipe.ingredients.map(ing => {
          const found = allIngredients.find(dbIng => dbIng.name === ing.name);
          return { ...ing, category: found ? found.category : 'OTHER' };
        });

        setFormData({ ...recipe, ingredients: enrichedIngredients });
        if (recipe.image) setImagePreview(recipe.image);
      } catch (err) {
        console.error("Error fetching data:", err);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    
    if (token && user) fetchRecipe();
  }, [id, token, user, navigate]);

  const categories = [...new Set(allIngredientsFromDB.map(i => i.category))].sort();
  const getIngredientsByCategory = (categoryName) => {
    return allIngredientsFromDB
      .filter(i => i.category === categoryName)
      .map(i => i.name)
      .sort();
  };

  // --- HANDLERS ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageError('');
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
      ingredients: [...formData.ingredients, { category: '', name: '', quantity: '', unit: metadata.units[0] || 'g' }]
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

  // --- UPDATE ACTION ---

  const handleUpdate = async (e) => {
    e.preventDefault();

    // VALIDATION
    if (!formData.image) {
        setImageError("Please upload a photo of your dish.");
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    if (formData.ingredients.length === 0) {
        setIngredientError("Please add at least one ingredient.");
        document.getElementById('ingredients-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    for (let ing of formData.ingredients) {
        if (!ing.name || !ing.quantity || !ing.category) {
             setIngredientError("Please complete all ingredient fields.");
             document.getElementById('ingredients-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
             return;
        }
    }
    
    const payload = {
        ...formData,
        prepTime: parseInt(formData.prepTime) || 0,
        cookTime: parseInt(formData.cookTime) || 0,
        servings: parseInt(formData.servings) || 1,
        difficulty: parseInt(formData.difficulty) || 1,
        ingredients: formData.ingredients.map(ing => ({
            name: ing.name,
            quantity: ing.quantity,
            unit: ing.unit,
            ingredientId: ing.ingredientId
        }))
    };

    delete payload._id;
    delete payload.userId;
    delete payload.recipeId;

    try {
      await recipeService.update(token, id, payload);
      alert("Recipe updated!");
      navigate(`/recipe/${id}`);
    } catch (err) {
      alert("Error updating recipe");
    }
  };
  
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;

    try {
      await recipeService.delete(token, id);
      navigate('/');
    } catch (err) {
      alert("Failed to delete");
      console.error(err);
    }
  };

  if (loading) return <div style={{padding:'40px'}}>Loading...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '5px' }}>
        <ArrowLeft size={20} /> Cancel
      </button>

      <h1 style={{fontSize: '2rem', marginBottom: '30px', textAlign: 'center'}}>Modify Recipe</h1>

      <form onSubmit={handleUpdate} style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 2px 15px rgba(0,0,0,0.05)' }}>
        
        {/* IMAGE */}
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
                    {metadata.flavors.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
             </div>
             <div style={{flex: 1, minWidth: '180px'}}>
                <label style={{fontWeight: 'bold', display:'block', marginBottom:'8px'}}>Cuisine Type *</label>
                <select name="cuisineType" value={formData.cuisineType} onChange={handleChange} className="login-input">
                  {metadata.cuisineTypes.map(c => <option key={c} value={c}>{c}</option>)}        
                </select>
            </div>
        </div>

        {/* --- INGREDIENTS --- */}
        <div id="ingredients-section" style={{background: '#f8f9fa', padding: '25px', borderRadius: '12px', marginBottom: '30px', border: ingredientError ? '2px solid #ff4d4d' : '1px solid #eee'}}>
            <label style={{fontWeight: 'bold', display:'block', marginBottom:'20px', fontSize: '1.1rem'}}>Ingredients</label>
            
            {formData.ingredients.map((ing, index) => (
                <div key={index} style={{display: 'flex', gap: '10px', marginBottom: '15px', alignItems: 'center', flexWrap: 'wrap'}}>
                    
                    <select 
                        value={ing.category} 
                        onChange={(e) => handleIngredientChange(index, 'category', e.target.value)}
                        className="login-input" 
                        style={{flex: 2, minWidth: '120px', marginBottom: 0}}
                    >
                        <option value="">Category...</option>
                        {categories.map(cat => <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()}
                          </option>)}
                    </select>

                    <select 
                        value={ing.name} 
                        onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                        className="login-input" 
                        style={{flex: 3, minWidth: '150px', marginBottom: 0}}
                        disabled={!ing.category}
                    >
                        <option value="">Ingredient...</option>
                        {ing.category && getIngredientsByCategory(ing.category).map(name => (
                            <option key={name} value={name}>{name}</option>
                        ))}
                    </select>

                    <input 
                        type="number"
                        placeholder="Qty" 
                        value={ing.quantity} 
                        onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                        className="login-input" 
                        style={{flex: 1, minWidth: '70px', marginBottom: 0}}
                        min="0" step="0.1"
                    />

                    <select 
                        value={ing.unit} 
                        onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                        className="login-input" 
                        style={{flex: 1, minWidth: '70px', marginBottom: 0}}
                    >
                        {metadata.units.map(u => <option key={u} value={u}>{u}</option>)}
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

        {/* DESCRIPTION & INSTRUCTIONS */}
        <div style={{marginBottom: '25px'}}>
            <label style={{fontWeight: 'bold', display:'block', marginBottom:'8px'}}>Description (Optional)</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="login-input" rows={3} placeholder="Tell us a little bit about this dish..." style={{resize: 'vertical', fontFamily: 'inherit'}} />
        </div>

        <div style={{marginBottom: '30px'}}>
            <label style={{fontWeight: 'bold', display:'block', marginBottom:'8px'}}>Instructions * (one step per line)</label>
            <textarea value={formData.instructions.join('\n')} onChange={handleInstructionChange} className="login-input" rows={8} placeholder="Step 1:..." style={{resize: 'vertical', fontFamily: 'inherit', whiteSpace: 'pre-wrap'}} required />
        </div>
        
        {/* BUTTONS */}
        <div style={{ display: 'flex', gap: '20px', marginTop: '30px', paddingTop: '30px', borderTop: '2px solid #f0f0f0' }}>
            <button type="submit" className="btn-primary" style={{ flex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', fontSize: '1.1rem', padding: '15px' }}>
                <Save size={20} /> Update Recipe
            </button>

            <button type="button" onClick={handleDelete} style={{ flex: 1, background: 'white', color: '#d32f2f', border: '2px solid #d32f2f', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', transition: 'all 0.2s' }} onMouseOver={(e) => { e.currentTarget.style.background = '#d32f2f'; e.currentTarget.style.color = 'white'; }} onMouseOut={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#d32f2f'; }}>
                <Trash2 size={20} /> Delete
            </button>
        </div>
      </form>
    </div>
  );
}