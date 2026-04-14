const BASE_URL = 'http://63.177.254.134:5000';

function getToken(): string | null {
  return localStorage.getItem('jwt');
}

function buildHeaders(includeAuth = false): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (includeAuth) {
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `HTTP ${res.status}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : (undefined as unknown as T);
}

export async function get<T>(path: string, auth = false): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers: buildHeaders(auth),
  });
  return handleResponse<T>(res);
}

export async function post<T>(path: string, body: unknown, auth = false): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: buildHeaders(auth),
    body: JSON.stringify(body),
  });
  return handleResponse<T>(res);
}
