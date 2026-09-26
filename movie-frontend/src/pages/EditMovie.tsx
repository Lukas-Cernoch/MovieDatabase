import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Director } from '../types/Director';
import { getMovieById, getDirectors, updateMovie } from '../api';

export default function EditMovie() {
  const { imdbId } = useParams<{ imdbId: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [releaseYear, setReleaseYear] = useState<number | ''>('');
  const [genre, setGenre] = useState('');
  const [runtimeMinutes, setRuntimeMinutes] = useState<number | ''>('');
  const [directorId, setDirectorId] = useState('');
  
  const [directors, setDirectors] = useState<Director[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!imdbId) return;
    
    getMovieById(imdbId)
      .then(data => {
        setTitle(data.title);
        setReleaseYear(data.releaseYear);
        setGenre(data.genre);
        setRuntimeMinutes(data.runtimeMinutes);
        setDirectorId(data.directorId);
      })
      .catch(err => setError(err.message));

    getDirectors()
      .then(setDirectors)
      .catch(err => console.error('Chyba načítání režisérů:', err));
  }, [imdbId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imdbId) return;
    setIsSubmitting(true);

    const patchDoc = [
      { op: "replace", path: "/title", value: title },
      { op: "replace", path: "/releaseYear", value: Number(releaseYear) },
      { op: "replace", path: "/genre", value: genre },
      { op: "replace", path: "/runtimeMinutes", value: Number(runtimeMinutes) },
      { op: "replace", path: "/directorId", value: directorId }
    ];

    try {
      await updateMovie(imdbId, patchDoc);
      navigate('/');
    } catch (err) {
      alert((err as Error).message);
      setIsSubmitting(false);
    }
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!title && !error) return <p>Načítám data k úpravě...</p>;

  return (
    <div className="form-container">
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem' }}>Upravit film</h2>
        <form onSubmit={handleSubmit} className="form-group">
          <input 
            type="text" 
            placeholder="Název filmu" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            required 
            className="form-input" 
          />
          <input 
            type="number" 
            placeholder="Rok vydání" 
            value={releaseYear} 
            onChange={e => setReleaseYear(Number(e.target.value))} 
            required 
            className="form-input" 
          />
          <input 
            type="text" 
            placeholder="Žánr" 
            value={genre} 
            onChange={e => setGenre(e.target.value)} 
            required 
            className="form-input" 
          />
          <input 
            type="number" 
            placeholder="Délka v minutách" 
            value={runtimeMinutes} 
            onChange={e => setRuntimeMinutes(Number(e.target.value))} 
            required 
            className="form-input" 
          />
          
          <select 
            value={directorId} 
            onChange={e => setDirectorId(e.target.value)} 
            required 
            className="form-input"
          >
            <option value="" disabled>-- Vyberte režiséra --</option>
            {directors.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          
          <div className="btn-group">
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? 'Ukládám...' : 'Uložit změny'}
            </button>
            <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">
              Zrušit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
