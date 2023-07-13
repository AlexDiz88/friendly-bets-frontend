import Credentials from './types/Credentials';
import RegisterData from './types/RegisterData';
import User from './types/User';

export async function getProfile(): Promise<User> {
  const res = await fetch('/api/users/my/profile');
  if (res.status >= 400) {
    const answer = await res.json();
    throw new Error(answer.message);
  }
  return res.json();
}

export async function login(credentials: Credentials): Promise<User> {
  const res = await fetch('/login', {
    method: 'POST',
    body: `username=${credentials.email}&password=${credentials.password}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (res.status >= 400) {
    const { error } = await res.json();
    throw error;
  }
  return res.json();
}

export async function register(data: RegisterData): Promise<User> {
  const res = await fetch('/api/register', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (res.status >= 400) {
    const { error } = await res.json();
    throw error;
  }
  return res.json();
}

export async function logout(): Promise<void> {
  await fetch('/logout', {
    method: 'PUT',
  });
}
