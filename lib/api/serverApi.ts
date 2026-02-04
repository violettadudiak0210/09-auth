import { cookies } from 'next/headers';
import { api } from './axios';
import { User } from '@/types/user';
import { Note } from '@/types/note';

export interface SessionResponse {
  accessToken: string;
  refreshToken: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

/* ---------- AUTH ---------- */

export async function checkSession(): Promise<SessionResponse | null> {
  try {
    const cookieStore = cookies();

    const { data } = await api.get<SessionResponse>('/auth/session', {
      headers: { Cookie: cookieStore.toString() },
    });

    return data; // { accessToken, refreshToken }
  } catch {
    return null;
  }
}

export async function getMe(): Promise<User | null> {
  try {
    const cookieStore = cookies();

    const { data } = await api.get<User>('/users/me', {
      headers: { Cookie: cookieStore.toString() },
    });

    return data;
  } catch {
    return null;
  }
}

/* ---------- NOTES ---------- */

export async function fetchNotes(
  search: string,
  page: number,
  tag?: string,
  perPage = 12
): Promise<FetchNotesResponse> {
  const cookieStore = cookies();
  const params = { search: search || '', page, perPage, ...(tag && { tag }) };

  const { data } = await api.get<FetchNotesResponse>('/notes', {
    params,
    headers: { Cookie: cookieStore.toString() },
  });

  return data;
}

export async function fetchNoteById(id: Note['id']): Promise<Note> {
  const cookieStore = cookies();
  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cookieStore.toString() },
  });

  return data;
}
