import { useState, useEffect } from 'react';
import type { Director } from '../types/Director';
import { getDirectors, createMovie } from '../api';

export default function AddMovie() {
  const [imdbId, setImdbId] = useState('');
  const [title, setTitle] = useState('');
  const [releaseYear, setReleaseYear] = useState<number | ''>('');
  const [genre, setGenre] = useState('');
  const [runtimeMinutes, setRuntimeMinutes] = useState<number | ''>('');
  const [directorId, setDirectorId] = useState('');
  
  const [directors, setDirectors] = useState<Director[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getDirectors()
      .then(setDirectors)
      .catch(err => console.error('Chyba načítání režisérů:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createMovie({ imdbId, title, releaseYear: Number(releaseYear), genre, runtimeMinutes: Number(runtimeMinutes), directorId });
      alert('Film úspěšně přidán!');
      setImdbId(''); setTitle(''); setReleaseYear(''); setGenre(''); setRuntimeMinutes(''); setDirectorId('');
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="card">
        <h2 style={{ marginBottom: '1.5rem' }}>Nový film</h2>
        <div className="form-group">
          <input type="text" placeholder="IMDB ID (např. tt0816692)" value={imdbId} onChange={e => setImdbId(e.target.value)} required className="form-input" />
          <input type="text" placeholder="Název filmu" value={title} onChange={e => setTitle(e.target.value)} required className="form-input" />
          <input type="number" placeholder="Rok vydání" value={releaseYear} onChange={e => setReleaseYear(Number(e.target.value))} required className="form-input" />
          <input type="text" placeholder="Žánr" value={genre} onChange={e => setGenre(e.target.value)} required className="form-input" />
          <input type="number" placeholder="Délka v minutách" value={runtimeMinutes} onChange={e => setRuntimeMinutes(Number(e.target.value))} required className="form-input" />
          <select value={directorId} onChange={e => setDirectorId(e.target.value)} required className="form-input">
            <option value="" disabled>-- Vyberte režiséra --</option>
            {directors.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <div className="btn-group">
          <button type="submit" disabled={isSubmitting} className="btn btn-primary">
            {isSubmitting ? 'Ukládám...' : 'Přidat film'}
          </button>
        </div>
      </form>
    </div>
  );
}