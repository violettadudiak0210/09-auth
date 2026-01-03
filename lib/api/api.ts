import axios from "axios"

const BASE_URL = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN + '/api';

export const nextServer = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
})