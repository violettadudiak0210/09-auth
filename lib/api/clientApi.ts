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
  tag: string,
  perPage = 12
): Promise<FetchNotesResponse> {
  const params = {
    search: search || '',
    page,
    perPage,
    ...(tag && { tag }),
  };

  const { data } = await api.get<FetchNotesResponse>('/api/notes', {
    params,
    withCredentials: true,
  });

  return data;
}

export async function fetchNoteById(id: Note['id']): Promise<Note> {
  const { data } = await api.get<Note>(`/api/notes/${id}`, {
    withCredentials: true,
  });

  return data;
}

export async function createNote(note: CreateNoteData): Promise<Note> {
  const { data } = await api.post<Note>('/api/notes', note, {
    withCredentials: true,
  });

  return data;
}

export async function deleteNote(id: Note['id']): Promise<Note> {
  const { data } = await api.delete<Note>(`/api/notes/${id}`, {
    withCredentials: true,
  });

  return data;
}

/* ---------- AUTH ---------- */

export async function checkSession(): Promise<{ success: boolean }> {
  const { data } = await api.get<{ success: boolean }>('/api/auth/session', {
    withCredentials: true,
  });
  return data;
}

export async function register(data: RegistrationDetails): Promise<User> {
  const { data: res } = await api.post<User>('/api/auth/register', data, {
    withCredentials: true,
  });
  return res;
}

export async function login(data: LoginDetails): Promise<User> {
  const { data: res } = await api.post<User>('/api/auth/login', data, {
    withCredentials: true,
  });
  return res;
}

export async function logout(): Promise<void> {
  await api.post('/api/auth/logout', null, {
    withCredentials: true,
  });
}

export async function getMe(): Promise<User | null> {
  try {
    const { data } = await api.get<User>('/api/users/me', {
      withCredentials: true,
    });
    return data;
  } catch {
    return null;
  }
}

export async function updateMe(data: UpdateUserRequest): Promise<User> {
  const { data: res } = await api.patch<User>('/api/users/me', data, {
    withCredentials: true,
  });
  return res;
}