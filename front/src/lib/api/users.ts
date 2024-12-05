import { toast } from "sonner";

export interface User {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  role: 'admin' | 'referent' | 'simple';
}

export interface CreateUserData {
  nom: string;
  prenom: string;
  email: string;
  password?: string;
  role: string;
}

export interface UpdateUserData {
  nom?: string;
  prenom?: string;
  email?: string;
  password?: string;
  role?: string;
}

const API_URL = 'http://localhost:5001/api';

export async function getUsers(token: string): Promise<User[]> {
  const response = await fetch(`${API_URL}/users`, {
    headers: {
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
}

export async function createUser(data: CreateUserData, token: string): Promise<User> {
  const response = await fetch(`${API_URL}/users/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create user');
  }

  return response.json();
}

export async function updateUser(id: string, data: UpdateUserData, token: string): Promise<User> {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update user');
  }

  return response.json();
}

export async function deleteUser(id: string, token: string): Promise<void> {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete user');
  }
}