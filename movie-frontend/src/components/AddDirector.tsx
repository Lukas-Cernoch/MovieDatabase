import { useState } from 'react';
import { createDirector } from '../api';

interface Props {
  onDirectorAdded: () => void;
}

export default function AddDirector({ onDirectorAdded }: Props) {
  const [name, setName] = useState('');
  const [nationality, setNationality] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createDirector({ name, nationality, dateOfBirth });
      setName(''); setNationality(''); setDateOfBirth('');
      onDirectorAdded();
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="card">
        <h2 style={{ marginBottom: '1.5rem' }}>Nový režisér</h2>
        <div className="form-group">
          <input 
            type="text" 
            placeholder="Jméno režiséra" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
            className="form-input" 
          />
          <input 
            type="text" 
            placeholder="Země (např. US)" 
            value={nationality} 
            onChange={e => setNationality(e.target.value)} 
            required 
            className="form-input" 
          />
          <input 
            type="date" 
            value={dateOfBirth} 
            onChange={e => setDateOfBirth(e.target.value)} 
            required 
            className="form-input" 
          />
        </div>
        <div className="btn-group">
          <button type="submit" disabled={isSubmitting} className="btn btn-primary">
            {isSubmitting ? 'Ukládám...' : 'Přidat režiséra'}
          </button>
        </div>
      </form>
    </div>
  );
}