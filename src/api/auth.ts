import { post } from './client';

export function login(email: string, password: string): Promise<{ token: string }> {
  return post<{ token: string }>('/login', { email, password });
}

export function register(email: string, password: string): Promise<void> {
  return post<void>('/register', { email, password });
}
