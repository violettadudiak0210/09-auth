import { api } from './axios';
import { User } from '@/types/user';
import { Note } from '@/types/note';

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteData {
  title: string;
  tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
  content: string;
}

export interface RegistrationDetails {
  email: string;
  password: string;
}

export interface LoginDetails {
  email: string;
  password: string;
}

export interface UpdateUserRequest {
  username: string;
}

/* ---------- NOTES ---------- */

export async function fetchNotes(
  search: string,
  page: number,
  tag?: string,
  perPage = 12
): Promise<FetchNotesResponse> {
  const params = { search: search || '', page, perPage, ...(tag && { tag }) };
  const { data } = await api.get<FetchNotesResponse>('/notes', { params });
  return data;
}

export async function fetchNoteById(id: Note['id']): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
}

export async function createNote(note: CreateNoteData): Promise<Note> {
  const { data } = await api.post<Note>('/notes', note);
  return data;
}

export async function deleteNote(id: Note['id']): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
}

/* ---------- AUTH ---------- */

export async function checkSession(): Promise<boolean> {
  try {
    await api.get('/auth/session');
    return true;
  } catch {
    return false;
  }
}

export async function register(data: RegistrationDetails): Promise<User> {
  const { data: user } = await api.post<User>('/auth/register', data);
  return user;
}

export async function login(data: LoginDetails): Promise<User> {
  const { data: user } = await api.post<User>('/auth/login', data);
  return user;
}

export async function logout(): Promise<void> {
  await api.post('/auth/logout');
}

export async function getMe(): Promise<User | null> {
  try {
    const { data } = await api.get<User>('/users/me');
    return data;
  } catch {
    return null;
  }
}

export async function updateMe(data: UpdateUserRequest): Promise<User> {
  const { data: user } = await api.patch<User>('/users/me', data);
  return user;
}