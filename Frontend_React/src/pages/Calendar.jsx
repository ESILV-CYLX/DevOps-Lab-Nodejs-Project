import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Calendar as CalendarIcon, Download, Star, Plus, X, ShoppingCart, ChefHat, Save } from 'lucide-react';
import { recipeService, shoppingListService, calendarService } from '../services/api';
import { Day } from '../../../Full_DevOps_Lab/Full_DevOps_Lab/src/models/enums/Day';
import { MealType } from '../../../Full_DevOps_Lab/Full_DevOps_Lab/src/models/enums/MealType';
import html2pdf from 'html2pdf.js';

export default function CalendarPage() {
  const { token, user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [calendar, setCalendar] = useState(Object.keys(Day).reduce((acc, day) => ({ ...acc, [day]: [] }), {}));
  const [savedPlanners, setSavedPlanners] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showSelector, setShowSelector] = useState(null);
  const [draggedOverDay, setDraggedOverDay] = useState(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        if (!user?.userId) return;
        const [myOnes, favs, savedData] = await Promise.all([
          recipeService.getUserRecipes(token, user.userId),
          recipeService.getFavorites(token),
          calendarService.getSavedCalendars(token)
        ]);
        const all = [...myOnes, ...favs];
        const unique = all.filter((v, i, a) => a.findIndex(t => t.recipeId === v.recipeId) === i);
        
        setRecipes(unique);
        setSavedPlanners(Array.isArray(savedData) ? savedData : []);
      } catch (err) {
        console.error("Error loading recipes", err);
      }
    };
    if (token && user) loadInitialData();
  }, [token, user]);

  const toggleFavoritePlanner = async () => {
    const totalMeals = Object.values(calendar).flat().length;

    if (totalMeals === 0) {
      alert("Your calendar is empty. Add some meals before saving!");
      setIsFavorite(false);
      return;
    }
    try {
      const newStatus = !isFavorite;
      setIsFavorite(newStatus);

      if (newStatus) {
        const name = prompt("Enter a name for this weekly planner:", `Planner ${new Date().toLocaleDateString()}`);
        if (!name) {
          setIsFavorite(false);
          return;
        }

        const payload = {
          name,
          content: calendar,
          weekStartDate: new Date(),
          weekEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          isFavorite: true
        };

        const saved = await calendarService.save(token, payload);
        setSavedPlanners(prev => [saved, ...prev]);
        setIsFavorite(true);
        alert("Planner saved to favorites!");
      }
    } catch (err) {
      console.error("Error saving planner", err);
      alert("Failed to save planner");
    }
  };

  const deletePlanner = async (e, plannerId) => {
    e.stopPropagation(); // Empêche le chargement du plan quand on clique sur la croix
    if (!window.confirm("Delete this saved planner?")) return;
    
    try {
      await calendarService.deleteSavedCalendar(token, plannerId);
      setSavedPlanners(prev => prev.filter(p => p._id !== plannerId));
    } catch (err) {
      alert("Error deleting planner");
    }
  };

  const loadSavedPlanner = (planner) => {
    if (window.confirm(`Load "${planner.name}"? This will replace your current view.`)) {
      setCalendar(planner.content);
      setIsFavorite(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // --- DRAG AND DROP ---
  const onDragStart = (e, sourceDay, index) => {
    const mealData = { sourceDay, index, item: calendar[sourceDay][index] };
    e.dataTransfer.setData("mealData", JSON.stringify(mealData));
    e.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = (e, day) => {
    e.preventDefault();
    setDraggedOverDay(day);
  };

  const onDrop = (e, targetDay, targetIndex = null) => {
    e.preventDefault();
    setDraggedOverDay(null);
    const dataJSON = e.dataTransfer.getData("mealData");
    if (!dataJSON) return;

    const { sourceDay, index: sourceIndex, item } = JSON.parse(dataJSON);

    // Validation des types restreints (uniquement si on change de jour)
    if (sourceDay !== targetDay) {
      const restrictedTypes = ['BREAKFAST', 'LUNCH', 'DINNER'];
      if (restrictedTypes.includes(item.mealType)) {
        if (calendar[targetDay].some(m => m.mealType === item.mealType)) {
          alert(`You already have a ${item.mealType.toLowerCase()} planned for ${targetDay.toLowerCase()}.`);
          return;
        }
      }
    }

    setCalendar(prev => {
      const newCal = { ...prev };
      
      // Retire d'abord l'élément de sa position d'origine
      const sourceList = [...newCal[sourceDay]];
      const [removedItem] = sourceList.splice(sourceIndex, 1);
      newCal[sourceDay] = sourceList;

      // Insertion de l'élément
      const targetList = [...newCal[targetDay]];
      const finalPosition = targetIndex !== null ? targetIndex : targetList.length;
      targetList.splice(finalPosition, 0, removedItem);
      
      newCal[targetDay] = targetList;
      return newCal;
    });
  };

  // --- ACTIONS ---
  const addMeal = (day, mealType, recipe) => {
    const restrictedTypes = ['BREAKFAST', 'LUNCH', 'DINNER'];
    if (restrictedTypes.includes(mealType)) {
      if (calendar[day].some(item => item.mealType === mealType)) {
        alert(`You already planned a ${mealType.toLowerCase()} for ${day.toLowerCase()}.`);
        return;
      }
    }
    setCalendar(prev => ({
      ...prev,
      [day]: [...prev[day], { mealType, recipe, id: Date.now().toString() }]
    }));
    setShowSelector(null);
  };

  const removeMeal = (day, index) => {
    setCalendar(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index)
    }));
  };

  const exportToPDF = () => {
    const element = document.getElementById('printable-calendar');
    const opt = {
      margin: 10,
      filename: 'weekly-meal-plan.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        useCORS: true, 
        logging: true, 
        scale: 2
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(element).save();
  };

  /***
   * Update the shopping list based on the current calendar meals (verifies ingredients duplicates)
   */
  const updateShoppingList = async () => {
    try {
      const allMeals = Object.values(calendar).flat();
      if (allMeals.length === 0) return alert("Calendar is empty: No meals/recipes found!");

      const allIngredients = allMeals.flatMap(item => {
        return (item.recipe.ingredients || []).map(ing => {
        return typeof ing === 'object' ? ing : { name: ing, quantity: 1, unit: 'g', category: 'OTHER' };
      });
      });
      if (allIngredients.length === 0) return alert("Calendar is empty: No ingredients found!");
      //console.log("Ingredients list to add to the shopping list:", allIngredients);

      await shoppingListService.updateFromCalendar(token, allIngredients);      
      alert("Shopping list updated successfully!");
    } catch (err) {
      console.error("Sync error :", err);
      alert("Failed to sync. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '20px' }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '2.2rem', fontWeight: 'bold' }}>
          <CalendarIcon size={35} /> Weekly Meal Plan
        </h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={updateShoppingList} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f0f7ff', color: '#007bff', border: '1px solid #007bff', padding: '10px 18px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
            <ShoppingCart size={18} /> Sync Shopping List
          </button>
          <button onClick={toggleFavoritePlanner} style={{ border: 'none', background: isFavorite ? '#fff9c4' : '#f5f5f5', color: isFavorite ? '#fbc02d' : '#999', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}>
            <Star size={22} fill={isFavorite ? "#fbc02d" : "none"} />
          </button>
          <button onClick={exportToPDF} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#000', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
            <Download size={18} /> Export PDF
          </button>
        </div>
      </div>

      {/* CALENDAR GRID */}
      <div id="printable-calendar" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '12px' }}>
        {Object.keys(Day).map((day) => (
          <div 
            key={day} 
            onDragOver={(e) => onDragOver(e, day)}
            onDrop={(e) => onDrop(e, day)}
            onDragLeave={() => setDraggedOverDay(null)}
            style={{ 
              background: draggedOverDay === day ? '#f0f7ff' : '#fff', 
              borderRadius: '12px', padding: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
              minHeight: '300px', border: draggedOverDay === day ? '2px solid #007bff' : '1px solid #eee',
              display: 'flex', flexDirection: 'column', transition: '0.2s'
            }}
          >
            <h3 style={{ textAlign: 'center', fontSize: '1.1rem', color: '#1a1a1a', borderBottom: '2px solid #f8f9fa', paddingBottom: '10px', marginBottom: '15px', fontWeight: '800', textTransform: 'uppercase' }}>
              {day}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1 }}>
              {calendar[day].map((item, idx) => (
                <div 
                  key={item.id || idx} 
                  draggable
                  onDragStart={(e) => onDragStart(e, day, idx)}
                  onDrop={(e) => {
                    e.stopPropagation(); // Empêche le déclenchement du onDrop du parent (la colonne)
                    onDrop(e, day, idx);
                  }}
                  style={{ 
                    background: '#f9f9f9', borderRadius: '12px', borderLeft: '5px solid #000', 
                    position: 'relative', display: 'flex', flexDirection: 'column', 
                    overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', cursor: 'grab'
                  }}
                >
                  <button 
                    onClick={(e) => { e.stopPropagation(); removeMeal(day, idx); }} 
                    style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(255,255,255,0.85)', border: 'none', borderRadius: '50%', color: '#ff4d4d', cursor: 'pointer', padding: '4px', zIndex: 2, display: 'flex' }}
                  >
                    <X size={16} strokeWidth={3} />
                  </button>

                  <img src={item.recipe.image || 'https://via.placeholder.com/150'} alt={item.recipe.title} style={{ width: '100%', height: '85px', objectFit: 'cover', pointerEvents: 'none' }} />

                  <div style={{ padding: '10px', pointerEvents: 'none' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '900', color: '#444', textTransform: 'uppercase' }}>{item.mealType}</span>
                    <p style={{ margin: '2px 0 0', fontSize: '0.95rem', fontWeight: '600', color: '#1a1a1a', lineHeight: '1.2' }}>{item.recipe.title}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => setShowSelector({ day, mealType: 'LUNCH' })}
              style={{ width: '100%', marginTop: '15px', padding: '10px', border: '2px dashed #ddd', borderRadius: '8px', background: 'none', color: '#888', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
            >
              <Plus size={16} /> Add Meal
            </button>
          </div>
        ))}
      </div>

        <hr style={{ border: 'none', borderTop: '1px solid #eee', marginBottom: '40px' }} />

      {/* SAVED PLANNERS SECTION */}
      <section style={{ marginBottom: '50px' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Save size={28} /> Saved Planners
        </h2>
        
        {savedPlanners.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', background: '#f9f9f9', borderRadius: '15px', color: '#888' }}>
            No saved planners yet.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {savedPlanners.map((planner) => (
              <div 
                key={planner._id} 
                onClick={() => loadSavedPlanner(planner)}
                style={{ 
                    background: '#fff', 
                    padding: '20px', 
                    borderRadius: '15px', 
                    border: '1px solid #eee', 
                    cursor: 'pointer', 
                    position: 'relative',
                    transition: '0.2s', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)' 
                }}
              >
                <button
                onClick={(e) => deletePlanner(e, planner._id)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  background: 'transparent',
                  color: '#ff4d4d',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <X size={20} strokeWidth={3} />
              </button>

                <div style={{ marginBottom: '10px', paddingRight: '20px' }}>
                  <h4 style={{ margin: 0, fontWeight: 'bold', color: '#1a1a1a' }}>{planner.name}</h4>
                </div>

                <div style={{ display: 'flex', gap: '5px' }}>
                   <div style={{ background: '#f0f7ff', color: '#007bff', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                     {planner.content ? Object.values(planner.content).flat().length : 0} Meals
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SELECTOR MODAL*/}
      {showSelector && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', width: '90%', maxWidth: '500px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontWeight: 'bold' }}>Add to {showSelector.day[0]+showSelector.day.slice(1).toLowerCase()}</h3>
            </div>
            <select 
              value={showSelector.mealType} 
              onChange={(e) => setShowSelector({...showSelector, mealType: e.target.value})}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '20px' }}
            >
              {Object.values(MealType).map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            <div style={{ flexGrow: 1, overflowY: 'auto' }}>
              {recipes.length > 0 ? (
                recipes.map(r => (
                  <div key={r.recipeId} onClick={() => addMeal(showSelector.day, showSelector.mealType, r)} style={{ padding: '12px', border: '1px solid #eee', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <img src={r.image || 'https://via.placeholder.com/50'} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600' }}>{r.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#888' }}>{r.cuisineType}</div>
                    </div>
                    <Plus size={18} color="#007bff" />
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '30px', color: '#666', background: '#f8f9fa', borderRadius: '12px', border: '1px dashed #ccc' }}>
                    <ChefHat size={40} style={{ marginBottom: '10px', opacity: 0.5 }} />
                    <p style={{ margin: 0, fontWeight: '500' }}>No recipes found.</p>
                    <p style={{ margin: '5px 0 0', fontSize: '0.9rem', color: '#888' }}>
                      Add recipes to favorite or create your own to start planning your week!
                    </p>
                </div>
              )}
            </div>
            <button onClick={() => setShowSelector(null)} style={{ marginTop: '20px', width: '100%', padding: '12px', background: '#c9c6c6ff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}