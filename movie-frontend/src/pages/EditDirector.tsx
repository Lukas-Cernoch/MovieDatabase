import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDirectorById, updateDirector } from '../api';

export default function EditDirector() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [nationality, setNationality] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getDirectorById(id)
      .then(data => {
        setName(data.name);
        setNationality(data.nationality);
        setDateOfBirth(data.dateOfBirth);
      })
      .catch(err => setError(err.message));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsSubmitting(true);

    const patchDoc = [
      { op: "replace", path: "/name", value: name },
      { op: "replace", path: "/nationality", value: nationality },
      { op: "replace", path: "/dateOfBirth", value: dateOfBirth }
    ];

    try {
      await updateDirector(id, patchDoc);
      navigate('/');
    } catch (err) {
      alert((err as Error).message);
      setIsSubmitting(false);
    }
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!name && !error) return <p>Načítám data k úpravě...</p>;

  return (
    <div className="form-container">
      <div className="card">
        <h2 style={{ marginBottom: '1.5rem' }}>Upravit režiséra</h2>
        <form onSubmit={handleSubmit} className="form-group">
          <input type="text" value={name} onChange={e => setName(e.target.value)} required className="form-input" />
          <input type="text" value={nationality} onChange={e => setNationality(e.target.value)} required className="form-input" />
          <input type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} required className="form-input" />
          
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