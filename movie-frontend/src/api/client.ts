// src/api/client.ts

// Zde definujeme základní adresu. Později ji můžeme načítat např. z proměnných prostředí (.env).
const BASE_URL = 'http://localhost:5260';

/**
 * Pomocná funkce pro volání API. 
 * Automaticky řeší JSON parsování a vyhazování srozumitelných chyb.
 */
export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  
  // Výchozí hlavičky přidáme ke každému požadavku
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  // Pokud backend odpoví 204 No Content (což často dělá DELETE nebo PATCH)
  if (response.status === 204) {
    return {} as T;
  }

  // Zpracování chyb (400, 404, 500 atd.)
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error (${response.status}): ${errorText || response.statusText}`);
  }

  // Úspěšný výsledek (200 OK)
  return response.json();
}