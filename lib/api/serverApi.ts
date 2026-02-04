import { cookies } from 'next/headers';
import { api } from './axios';
import { User } from '@/types/user';
import { Note } from '@/types/note';

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

/* ---------- AUTH ---------- */

export async function checkSession(): Promise<{ success: boolean }> {
  const cookieStore = cookies();
  const { data } = await api.get<{ success: boolean }>('/api/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
}

export async function getMe(): Promise<User | null> {
  try {
    const cookieStore = cookies();
    const { data } = await api.get<User>('/api/users/me', {
      headers: {
        Cookie: cookieStore.toString(),
      },
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
  const params = {
    search: search || '',
    page,
    perPage,
    ...(tag && { tag }),
  };

  const { data } = await api.get<FetchNotesResponse>('/api/notes', {
    params,
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return data;
}

export async function fetchNoteById(id: Note['id']): Promise<Note> {
  const cookieStore = cookies();
  const { data } = await api.get<Note>(`/api/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
}