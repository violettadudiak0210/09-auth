import { client } from './api';
import { User } from '@/types/user';
import { Note } from '@/types/note';

interface FetchNotesResponse {
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
  tag: string,
  perPage = 12
): Promise<FetchNotesResponse> {
  const params = {
    search: search || '',
    page,
    perPage,
    ...(tag && { tag }),
  };

  const { data } = await client.get('/notes', { params });
  return data;
}

export async function fetchNoteById(id: Note['id']): Promise<Note> {
  const { data } = await client.get(`/notes/${id}`);
  return data;
}

export async function createNote(note: CreateNoteData): Promise<Note> {
  const { data } = await client.post('/notes', note);
  return data;
}

export async function deleteNote(id: Note['id']): Promise<Note> {
  const { data } = await client.delete(`/notes/${id}`);
  return data;
}

/* ---------- AUTH ---------- */

export async function register(data: RegistrationDetails): Promise<User> {
  const res = await client.post('/auth/register', data);
  return res.data;
}

export async function login(data: LoginDetails): Promise<User> {
  const res = await client.post('/auth/login', data);
  return res.data;
}

export async function logout(): Promise<void> {
  await client.post('/auth/logout');
}

export async function getMe(): Promise<User | null> {
  try {
    const { data } = await client.get<User>('/users/me');
    return data;
  } catch {
    return null;
  }
}

export async function updateMe(data: UpdateUserRequest): Promise<User> {
  const res = await client.patch('/users/me', data);
  return res.data;
}