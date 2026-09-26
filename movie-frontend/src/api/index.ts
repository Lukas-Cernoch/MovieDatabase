// src/api/index.ts
import { apiClient } from './client';
import type { Director } from '../types/Director';
import type { Movie } from '../types/Movie';

// --- REŽISÉŘI ---
export const getDirectors = () => apiClient<Director[]>('/directors');
export const getDirectorById = (id: string) => apiClient<Director>(`/directors/${id}`);
export const createDirector = (data: Partial<Director>) => apiClient<Director>('/directors', { method: 'POST', body: JSON.stringify(data) });
export const updateDirector = (id: string, patchDoc: any) => apiClient<void>(`/directors/${id}`, { method: 'PATCH', body: JSON.stringify(patchDoc) });
export const deleteDirector = (id: string) => apiClient<void>(`/directors/${id}`, { method: 'DELETE' });

// --- FILMY ---
export const getMovies = () => apiClient<Movie[]>('/movies');
export const getMovieById = (imdbId: string) => apiClient<Movie>(`/movies/${imdbId}`);
export const createMovie = (data: Partial<Movie>) => apiClient<Movie>('/movies', { method: 'POST', body: JSON.stringify(data) });
export const updateMovie = (imdbId: string, patchDoc: any) => apiClient<void>(`/movies/${imdbId}`, { method: 'PATCH', body: JSON.stringify(patchDoc) });
export const deleteMovie = (imdbId: string) => apiClient<void>(`/movies/${imdbId}`, { method: 'DELETE' });