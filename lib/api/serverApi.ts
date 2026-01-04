import axios from 'axios';
import { cookies } from 'next/headers';
import { User } from '@/types/user';
import { Note } from '@/types/note';

const baseURL = process.env.NEXT_PUBLIC_API_URL + '/api';

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

/* ---------- AUTH ---------- */

export async function checkSession(): Promise<boolean> {
  try {
    const cookieStore = cookies();

    await axios.get(`${baseURL}/auth/session`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return true;
  } catch {
    return false;
  }
}

export async function getMe(): Promise<User | null> {
  try {
    const cookieStore = cookies();

    const { data } = await axios.get<User>(`${baseURL}/users/me`, {
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

  const { data } = await axios.get(`${baseURL}/notes`, {
    params,
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return data;
}

export async function fetchNoteById(id: Note['id']): Promise<Note> {
  const cookieStore = cookies();

  const { data } = await axios.get(`${baseURL}/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return data;
}