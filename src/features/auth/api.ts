import Credentials from './types/Credentials';
import RegisterData from './types/RegisterData';
import User from './types/User';

export async function getProfile(): Promise<User> {
  let url = `${process.env.REACT_APP_PRODUCT_SERVER}/api/users/my/profile`;
  if (process.env.REACT_APP_PRODUCT_SERVER === 'localhost') {
    url = '/api/users/my/profile';
  }
  const result = await fetch(`${url}`);
  if (result.status >= 400) {
    const { message } = await result.json();
    throw new Error(message);
  }
  return result.json();
}

export async function login(credentials: Credentials): Promise<User> {
  let url = `${process.env.REACT_APP_PRODUCT_SERVER}/login`;
  if (process.env.REACT_APP_PRODUCT_SERVER === 'localhost') {
    url = '/login';
  }
  const result = await fetch(`${url}`, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    body: `username=${credentials.email}&password=${credentials.password}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  if (result.status >= 400) {
    const { message } = await result.json();
    throw new Error(message);
  }
  return result.json();
}

export async function register(data: RegisterData): Promise<User> {
  let url = `${process.env.REACT_APP_PRODUCT_SERVER}/api/register`;
  if (process.env.REACT_APP_PRODUCT_SERVER === 'localhost') {
    url = '/api/register';
  }
  const result = await fetch(`${url}`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (result.status >= 400) {
    const { message } = await result.json();
    throw new Error(message);
  }
  return result.json();
}

export async function logout(): Promise<void> {
  let url = `${process.env.REACT_APP_PRODUCT_SERVER}/logout`;
  if (process.env.REACT_APP_PRODUCT_SERVER === 'localhost') {
    url = '/logout';
  }
  await fetch(`${url}`, {
    method: 'PUT',
  });
}

export async function editEmail(email: string): Promise<User> {
  let url = `${process.env.REACT_APP_PRODUCT_SERVER}/api/users/my/profile/email`;
  if (process.env.REACT_APP_PRODUCT_SERVER === 'localhost') {
    url = '/api/users/my/profile/email';
  }
  const result = await fetch(`${url}`, {
    method: 'PUT',
    body: email,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (result.status >= 400) {
    const { message } = await result.json();
    throw new Error(message);
  }
  return result.json();
}

export async function editPassword({
  currentPassword,
  newPassword,
}: {
  currentPassword: string;
  newPassword: string;
}): Promise<User> {
  let url = `${process.env.REACT_APP_PRODUCT_SERVER}/api/users/my/profile/password`;
  if (process.env.REACT_APP_PRODUCT_SERVER === 'localhost') {
    url = '/api/users/my/profile/password';
  }
  const result = await fetch(`${url}`, {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (result.status >= 400) {
    const { message } = await result.json();
    throw new Error(message);
  }
  return result.json();
}

export async function editUsername(username: string): Promise<User> {
  let url = `${process.env.REACT_APP_PRODUCT_SERVER}/api/users/my/profile/username`;
  if (process.env.REACT_APP_PRODUCT_SERVER === 'localhost') {
    url = '/api/users/my/profile/username';
  }
  const result = await fetch(`${url}`, {
    method: 'PUT',
    body: username,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (result.status >= 400) {
    const { message } = await result.json();
    throw new Error(message);
  }
  return result.json();
}
