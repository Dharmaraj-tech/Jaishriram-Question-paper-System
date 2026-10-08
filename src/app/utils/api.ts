import { QuestionPaper } from '../types';

const DEFAULT_API_BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:5000';
const API_BASE_URL = (import.meta.env.VITE_API_URL || DEFAULT_API_BASE_URL).replace(/\/$/, '');
const AUTH_STORAGE_KEY = 'qpaper_admin_token';

type LoginResponse = {
  token: string;
  admin: {
    username?: string;
    email: string;
  };
};

type CreateQuestionPaperPayload = {
  department: string;
  batch: string;
  subject: string;
  uploadType: 'file' | 'drive' | 'youtube';
  fileContent?: string;
  fileName?: string;
  driveLink?: string;
  youtubeLink?: string;
  description?: string;
};

const buildHeaders = (authenticated = false) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (authenticated) {
    const token = getAuthToken();

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

const parseResponse = async <T>(response: Response): Promise<T> => {
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || 'Request failed');
  }

  return payload as T;
};

export const fileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Unable to read the selected file'));
    reader.readAsDataURL(file);
  });

export const loginAdmin = async (username: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({ username, email: username, password }),
  });

  return parseResponse<LoginResponse>(response);
};

export const fetchQuestionPapers = async () => {
  const response = await fetch(`${API_BASE_URL}/api/papers`, {
    headers: buildHeaders(),
  });

  return parseResponse<QuestionPaper[]>(response);
};

export const createQuestionPaper = async (payload: CreateQuestionPaperPayload) => {
  const response = await fetch(`${API_BASE_URL}/api/papers`, {
    method: 'POST',
    headers: buildHeaders(true),
    body: JSON.stringify(payload),
  });

  return parseResponse<QuestionPaper>(response);
};

export const removeQuestionPaper = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/api/papers/${id}`, {
    method: 'DELETE',
    headers: buildHeaders(true),
  });

  return parseResponse<{ message: string }>(response);
};

export const getAuthToken = () => localStorage.getItem(AUTH_STORAGE_KEY);

export const setAuthToken = (token: string) => {
  localStorage.setItem(AUTH_STORAGE_KEY, token);
};

export const clearAuthToken = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

export const getApiBaseUrl = () => API_BASE_URL;
