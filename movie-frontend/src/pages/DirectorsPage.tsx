import AddDirector from '../components/AddDirector';

export default function DirectorsPage() {
  return (
    // Zabalíme to do flexboxu, který vše perfektně vycentruje a přidá odsazení odshora
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ width: '100%' }}>
        <AddDirector onDirectorAdded={() => alert('Režisér úspěšně přidán!')} />
      </div>
    </div>
  );
}