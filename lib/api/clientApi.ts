import { client } from './api';
import { User } from '@/types/user';
import { Note } from '@/types/note';
import { AxiosResponse } from 'axios';

/* ---------- TYPES ---------- */

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface NoteResponse {
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
  const params = {
    search: search || '',
    page,
    perPage,
    ...(tag && { tag }),
  };

  const { data } = await client.get<FetchNotesResponse>('/notes', {
    params,
    withCredentials: true,
  });

  return data;
}

export async function fetchNoteById(id: Note['id']): Promise<Note> {
  const { data } = await client.get<Note>(`/notes/${id}`, { withCredentials: true });
  return data;
}

export async function createNote(note: CreateNoteData): Promise<Note> {
  const { data } = await client.post<Note>('/notes', note, { withCredentials: true });
  return data;
}

export async function deleteNote(id: Note['id']): Promise<Note> {
  const { data } = await client.delete<Note>(`/notes/${id}`, { withCredentials: true });
  return data;
}

/* ---------- AUTH ---------- */

export async function checkSession(): Promise<AxiosResponse<{ accessToken: string; refreshToken: string }>> {
  return await client.get('/auth/session', { withCredentials: true });
}

export async function register(data: RegistrationDetails): Promise<User> {
  const res = await client.post<User>('/auth/register', data, { withCredentials: true });
  return res.data;
}

export async function login(data: LoginDetails): Promise<User> {
  const res = await client.post<User>('/auth/login', data, { withCredentials: true });
  return res.data;
}

export async function logout(): Promise<void> {
  await client.post('/auth/logout', null, { withCredentials: true });
}

export async function getMe(): Promise<User | null> {
  try {
    const { data } = await client.get<User>('/users/me', { withCredentials: true });
    return data;
  } catch {
    return null;
  }
}

export async function updateMe(data: UpdateUserRequest): Promise<User> {
  const res = await client.patch<User>('/users/me', data, { withCredentials: true });
  return res.data;
}