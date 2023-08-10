import Credentials from './types/Credentials';
import RegisterData from './types/RegisterData';
import User from './types/User';

export async function getProfile(): Promise<User> {
  const result = await fetch(
    `${process.env.REACT_APP_PRODUCT_SERVER}/api/users/my/profile`
  );
  if (result.status >= 400) {
    const { message } = await result.json();
    throw new Error(message);
  }
  return result.json();
}

export async function login(credentials: Credentials): Promise<User> {
  const result = await fetch(`${process.env.REACT_APP_PRODUCT_SERVER}/login`, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    body: `username=${credentials.email}&password=${credentials.password}`,
    headers: {
      accept: 'application/json',
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
  const result = await fetch(
    `${process.env.REACT_APP_PRODUCT_SERVER}/api/register`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  if (result.status >= 400) {
    const { message } = await result.json();
    throw new Error(message);
  }
  return result.json();
}

export async function logout(): Promise<void> {
  await fetch(`${process.env.REACT_APP_PRODUCT_SERVER}/logout`, {
    method: 'PUT',
  });
}

export async function editEmail(email: string): Promise<User> {
  const result = await fetch(
    `${process.env.REACT_APP_PRODUCT_SERVER}/api/users/my/profile/email`,
    {
      method: 'PUT',
      body: email,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  if (result.status >= 400) {
    const { message } = await result.json();
    throw new Error(message);
  }
  return result.json();
}

export async function editUsername(username: string): Promise<User> {
  const result = await fetch(
    `${process.env.REACT_APP_PRODUCT_SERVER}/api/users/my/profile/username`,
    {
      method: 'PUT',
      body: username,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  if (result.status >= 400) {
    const { message } = await result.json();
    throw new Error(message);
  }
  return result.json();
}
