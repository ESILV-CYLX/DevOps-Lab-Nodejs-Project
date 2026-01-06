import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Trash2, ShoppingCart, CheckSquare, Square, Eraser } from 'lucide-react';
import { shoppingListService } from '../services/api';

export default function ShoppingList() {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    try {
      const data = await shoppingListService.get(token);
      setItems(data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchList();
  }, [token]);

  const toggleCheck = async (itemId, currentStatus) => {
    // Optimistic Update
    setItems(items.map(item => item._id === itemId ? { ...item, checked: !currentStatus } : item));

    try {
      await shoppingListService.updateItem(token, itemId, { checked: !currentStatus });
    } catch (err) {
      console.error("Sync failed");
      fetchList(); // Revert en cas d'erreur
    }
  };

  const deleteItem = async (itemId) => {
    if (!window.confirm("Remove item?")) return;
    
    const previousItems = [...items];
    setItems(items.filter(i => i._id !== itemId));

    try {
      await shoppingListService.deleteItem(token, itemId);
    } catch (err) {
      setItems(previousItems); // Revert
    }
  };

  const clearAll = async () => {
    if (!window.confirm("Empty your entire shopping list?")) return;
    
    try {
      await shoppingListService.clearList(token);
      setItems([]); //Vide l'état local
    } catch (err) {
      alert("Error clearing shopping list");
    }
  };

  // Group Items by Category
  const groupedItems = items.reduce((acc, item) => {
    const cat = item.category || 'Divers';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  if (loading) return <div style={{padding:'40px'}}>Loading List...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
            <div style={{background: '#e3f2fd', padding: '12px', borderRadius: '12px'}}>
                <ShoppingCart size={32} color="#1976d2" />
            </div>
            <h1 style={{fontSize: '2rem', margin: 0}}>Shopping List</h1>
        </div>

        {items.length > 0 && (
            <button 
              onClick={clearAll}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '10px 16px', background: '#fff0f0', color: '#d32f2f',
                border: '1px solid #ffcdd2', borderRadius: '8px', cursor: 'pointer',
                fontWeight: '600', fontSize: '0.9rem'
              }}
            >
              <Eraser size={18} /> Clear List
            </button>
          )}
      </div>
      
      {items.length === 0 ? (
        <div style={{textAlign: 'center', padding: '60px', color: '#888', background: 'white', borderRadius: '16px'}}>
            <ShoppingCart size={48} style={{opacity: 0.2, marginBottom: '20px'}}/>
            <p>Your list is empty. Go to a recipe to add ingredients!</p>
        </div>
      ) : (
        
        Object.keys(groupedItems).sort().map(category => (
          <div key={category} style={{marginBottom: '30px', background: 'white', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.03)'}}>
            <h3 style={{
                background: '#f8f9fa', 
                margin: 0, 
                padding: '15px 20px', 
                fontSize: '1.1rem', 
                borderBottom: '1px solid #eee',
                color: '#555',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontWeight: 'bold'
            }}>
                {category}
            </h3>
            
            <div>
                {groupedItems[category].map(item => (
                    <div key={item._id} style={{
                        display: 'flex', 
                        alignItems: 'center', 
                        padding: '15px 20px', 
                        borderBottom: '1px solid #f5f5f5',
                        opacity: item.checked ? 0.5 : 1,
                        transition: 'opacity 0.2s'
                    }}>
                        {/* Checkbox */}
                        <div 
                            onClick={() => toggleCheck(item._id, item.checked)} 
                            style={{cursor: 'pointer', marginRight: '15px', display: 'flex', alignItems: 'center', color: item.checked ? '#4caf50' : '#ccc'}}
                        >
                            {item.checked ? <CheckSquare size={24} /> : <Square size={24} />}
                        </div>

                        {/* Name & Qty */}
                        <div style={{flex: 1, textDecoration: item.checked ? 'line-through' : 'none'}}>
                            <span style={{fontWeight: '500', fontSize: '1.05rem'}}>{item.name}</span>
                        </div>
                        
                        <div style={{fontWeight: 'bold', color: '#666', marginRight: '20px', background: '#f5f5f5', padding: '4px 10px', borderRadius: '20px', fontSize: '0.85rem'}}>
                            {item.quantity} {item.unit}
                        </div>

                        {/* Delete */}
                        <button 
                            onClick={() => deleteItem(item._id)}
                            style={{
                                border: 'none', 
                                background: 'transparent', 
                                color: '#ff5252', 
                                cursor: 'pointer',
                                padding: '5px',
                                display: 'flex', alignItems: 'center'
                            }}
                            title="Remove"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}