import { toast } from "sonner";

export interface ChildProfile {
  _id: string;
  nom: string;
  prenom: string;
  dateNaissance: string;
  classeSuivie: string;
  noteObservation: string;
  photo: string;
  parentId: string;
}

export interface CreateChildProfileData {
  nom: string;
  prenom: string;
  dateNaissance: string;
  classeSuivie: string;
  noteObservation: string;
  photo?: File;
  parentId: string;
}

export interface UpdateChildProfileData {
  nom?: string;
  prenom?: string;
  dateNaissance?: string;
  classeSuivie?: string;
  noteObservation?: string;
  photo?: File;
  parentId?: string;
}

const API_URL = 'http://localhost:5001/api';

export async function getChildProfiles(token: string): Promise<ChildProfile[]> {
  const response = await fetch(`${API_URL}/childProfiles`, {
    headers: {
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch child profiles');
  }

  return response.json();
}

export async function createChildProfile(data: CreateChildProfileData, token: string): Promise<ChildProfile> {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value);
    }
  });

  const response = await fetch(`${API_URL}/childProfiles`, {
    method: 'POST',
    headers: {
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create child profile');
  }

  return response.json();
}

export async function updateChildProfile(id: string, data: UpdateChildProfileData, token: string): Promise<ChildProfile> {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value);
    }
  });

  const response = await fetch(`${API_URL}/childProfiles/${id}`, {
    method: 'PUT',
    headers: {
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update child profile');
  }

  return response.json();
}

export async function deleteChildProfile(id: string, token: string): Promise<void> {
  const response = await fetch(`${API_URL}/childProfiles/${id}`, {
    method: 'DELETE',
    headers: {
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete child profile');
  }
}