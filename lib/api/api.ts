// lib/api/api.ts

import axios, { AxiosError } from 'axios';

export const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api',
  withCredentials: true,
});

export type ApiError = AxiosError<{
  error: string;
}>;