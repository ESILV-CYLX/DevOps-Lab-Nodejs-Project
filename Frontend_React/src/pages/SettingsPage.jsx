export default function SettingsPage() {
  return (
    <div>
      <h1>Settings</h1>
      <div style={{ background: 'white', padding: '30px', borderRadius: '12px', marginTop: '20px' }}>
        
        <h3>Préférences Alimentaires</h3>
        <p style={{color: '#666', marginBottom: '20px'}}>Ces filtres seront appliqués à vos recommandations.</p>
        
        <div style={styles.option}>
          <label>Végétarien</label>
          <input type="checkbox" />
        </div>
        <div style={styles.option}>
          <label>Sans Gluten</label>
          <input type="checkbox" />
        </div>
        <div style={styles.option}>
          <label>Sans Lactose</label>
          <input type="checkbox" defaultChecked />
        </div>

        <h3 style={{marginTop: '40px'}}>Compte</h3>
        <div style={styles.option}>
          <label>Notifications Email</label>
          <input type="checkbox" defaultChecked />
        </div>
        
        <button className="btn-primary" style={{marginTop: '20px'}}>Enregistrer</button>
      </div>
    </div>
  );
}

const styles = {
  option: { display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #eee' }
};