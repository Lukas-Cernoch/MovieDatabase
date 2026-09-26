import AddMovie from '../components/AddMovie';

export default function MoviesPage() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ width: '100%' }}>
        <AddMovie />
      </div>
    </div>
  );
}