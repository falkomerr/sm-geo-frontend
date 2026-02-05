import type { LoginCredentials, AuthResponse } from '../model/types';
import { storage } from '../../../../shared/lib/storage';

const API_BASE_URL = '/api';

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
    credentials: 'include', // Important for cookies
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Login failed' }));
    throw new Error(error.message || 'Login failed');
  }

  const data = await response.json();

  // Store JWT in localStorage using storage utility
  // Backend may return 'token', 'access_token', or 'accessToken'
  const token = data.token || data.access_token || data.accessToken;
  if (token) {
    storage.setToken(token);
    // Also store refresh token if provided
    if (data.refresh_token || data.refreshToken) {
      storage.setRefreshToken(data.refresh_token || data.refreshToken);
    }
  }

  // Normalize response to match AuthResponse interface
  return {
    user: data.user,
    token: token || data.token,
  };
}

export async function logout(): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } finally {
    // Always clear local storage using storage utility
    storage.removeToken();
  }
}
