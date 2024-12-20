import { toast } from "sonner";

export interface BookLoan {
  _id: string;
  bookTitle: string;
  userId: string;
  loanDate: string;
  returnDate: string;
}

export interface CreateBookLoanData {
  bookTitle: string;
  userId: string;
  returnDate: string;
}

export interface UpdateBookLoanData {
  bookTitle?: string;
  userId?: string;
  returnDate?: string;
}

const API_URL = 'http://localhost:5001/api';

export async function getBookLoans(token: string): Promise<BookLoan[]> {
  const response = await fetch(`${API_URL}/bookLoans`, {
    headers: {
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch book loans');
  }

  return response.json();
}

export async function createBookLoan(data: CreateBookLoanData, token: string): Promise<BookLoan> {
  const response = await fetch(`${API_URL}/bookLoans`, {
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
    throw new Error(error.message || 'Failed to create book loan');
  }

  return response.json();
}

export async function updateBookLoan(id: string, data: UpdateBookLoanData, token: string): Promise<BookLoan> {
  const response = await fetch(`${API_URL}/bookLoans/${id}`, {
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
    throw new Error(error.message || 'Failed to update book loan');
  }

  return response.json();
}

export async function deleteBookLoan(id: string, token: string): Promise<void> {
  const response = await fetch(`${API_URL}/bookLoans/${id}`, {
    method: 'DELETE',
    headers: {
      'Cookie': `accessToken=${token}`,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete book loan');
  }
}