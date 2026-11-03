export interface Book {
  _id: string;
  title: string;
  author: string;
  category: 'Fiction' | 'Science' | 'History' | 'Kids' | 'Others' | string;
  image: string;
  copies: number;
  description: string;
  userName?: string;
  userEmail?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface Borrow {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userEmail: string;
  userName: string;
  borrowDate: string;
  returnDate: string;
  status: 'borrowed' | 'returned';
  createdAt?: string | Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (name: string, email: string, password: string, image?: string) => Promise<AuthResponse>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => string | null;
}
