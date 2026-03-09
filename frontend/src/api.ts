import type { LoginResponse, UploadResponse, ChatResponse } from './types';

const API_BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (options?.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...headers, ...(options?.headers as Record<string, string>) },
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Session expired');
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText,
    }));
    throw new Error(error.message || 'Request failed');
  }

  return response.json() as Promise<T>;
}

export function login(
  username: string,
  password: string,
): Promise<LoginResponse> {
  return request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function getMe(): Promise<{ username: string }> {
  return request<{ username: string }>('/auth/me');
}

export function uploadAndSummarize(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  return request<UploadResponse>('/matter/upload-and-summarize', {
    method: 'POST',
    body: formData,
  });
}

export function sendChatMessage(
  message: string,
  fileId?: string,
): Promise<ChatResponse> {
  return request<ChatResponse>('/chat/message', {
    method: 'POST',
    body: JSON.stringify({ message, fileId }),
  });
}
