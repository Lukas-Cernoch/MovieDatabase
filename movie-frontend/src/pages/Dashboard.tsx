import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Director } from '../types/Director';
import type { Movie } from '../types/Movie';
// Importujeme naše nově vytvořené API funkce
import { getDirectors, getMovies, deleteDirector, deleteMovie } from '../api';

export default function Dashboard() {
  const [directors, setDirectors] = useState<Director[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Elegantnější zápis načítání přes náš centrální API modul
    getDirectors()
      .then(setDirectors)
      .catch(err => setError(err.message));

    getMovies()
      .then(setMovies)
      .catch(err => setError(err.message));
  }, []);

  const handleDeleteDirector = async (id: string) => {
    if (!window.confirm('Opravdu chcete smazat tohoto režiséra? Smažou se i všechny jeho filmy!')) return;

    try {
      await deleteDirector(id); // Voláme centralizovanou funkci
      
      // Místo ručního filtrování stavu prostě znovu stáhneme čerstvá data ze serveru.
      // Je to bezpečnější, protože frontend a backend budou 100% synchronizované.
      const freshDirectors = await getDirectors();
      const freshMovies = await getMovies();
      setDirectors(freshDirectors);
      setMovies(freshMovies);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleDeleteMovie = async (imdbId: string) => {
    if (!window.confirm('Opravdu chcete smazat tento film?')) return;

    try {
      await deleteMovie(imdbId); // Voláme centralizovanou funkci
      const freshMovies = await getMovies();
      setMovies(freshMovies);
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div>
      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
      <div className="dashboard-grid">
        <section className="card">
          <h2>Režiséři</h2>
          <ul className="data-list">
            {directors.map(d => (
              <li key={d.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span className="item-title">{d.name}</span>
                  <span className="item-meta">Národnost: {d.nationality} | Narozen: {d.dateOfBirth}</span>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link 
                    to={`/directors/edit/${d.id}`}
                    style={{ textDecoration: 'none', color: 'white', backgroundColor: 'var(--primary-color)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}
                  >
                    Upravit
                  </Link>
                  <button 
                    onClick={() => handleDeleteDirector(d.id)}
                    style={{ color: 'white', backgroundColor: '#ef4444', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Smazat
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h2>Filmy</h2>
          <ul className="data-list">
            {movies.map(m => (
              <li key={m.imdbId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span className="item-title">{m.title}</span>
                  <span className="item-meta">Žánr: {m.genre} | Rok: {m.releaseYear}</span>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link 
                    to={`/movies/edit/${m.imdbId}`}
                    style={{ textDecoration: 'none', color: 'white', backgroundColor: 'var(--primary-color)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.875rem' }}
                  >
                    Upravit
                  </Link>
                  <button 
                    onClick={() => handleDeleteMovie(m.imdbId)}
                    style={{ color: 'white', backgroundColor: '#ef4444', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Smazat
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}