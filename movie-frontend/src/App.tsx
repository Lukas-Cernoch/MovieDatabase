import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Film, Users, Clapperboard, Sun, Moon } from 'lucide-react'; // Naše nové ikony

import Dashboard from './pages/Dashboard';
import DirectorsPage from './pages/DirectorsPage';
import MoviesPage from './pages/MoviesPage';
import EditDirector from './pages/EditDirector';
import EditMovie from './pages/EditMovie';
import './index.css';

function App() {
  // Načteme téma z localStorage, pokud tam ještě nic není, dáme 'dark' (vypadá líp!)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'dark';
  });

  // Kdykoliv se téma změní, propíšeme ho do HTML tagu a uložíme do prohlížeče
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <BrowserRouter>
      {/* Nová plovoucí Glassmorphism lišta */}
      <header className="app-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, fontSize: '1.25rem' }}>
          <Clapperboard color="var(--primary-color)" />
          <span>MovieDB</span>
        </div>
        
        <nav className="nav-links">
          <Link to="/" className="nav-item"><Film size={18} /> Dashboard</Link>
          <Link to="/directors" className="nav-item"><Users size={18} /> Nový režisér</Link>
          <Link to="/movies" className="nav-item"><Clapperboard size={18} /> Nový film</Link>
        </nav>

        {/* Tlačítko pro přepnutí Light/Dark módu */}
        <button onClick={toggleTheme} className="theme-toggle" aria-label="Přepnout téma">
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </header>
      
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/directors" element={<DirectorsPage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/directors/edit/:id" element={<EditDirector />} />
          <Route path="/movies/edit/:imdbId" element={<EditMovie />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;