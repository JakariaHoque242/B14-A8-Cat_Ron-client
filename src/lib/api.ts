import { Book, Borrow } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const getHeaders = (tokenRequired: boolean = false) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("booknook_token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

// 1. GET /books
export async function fetchBooks(params?: {
  limit?: number;
  sort?: string;
  category?: string;
  search?: string;
}): Promise<Book[]> {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.sort) searchParams.append("sort", params.sort);
  if (params?.category && params.category !== "All") searchParams.append("category", params.category);
  if (params?.search) searchParams.append("search", params.search);

  const url = `${API_BASE_URL}/books${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch books catalog.");
  }
  return res.json();
}

// 2. GET /books/:id
export async function fetchBookById(id: string): Promise<Book> {
  const res = await fetch(`${API_BASE_URL}/books/${id}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Book not found or failed to fetch.");
  }
  return res.json();
}

// 3. POST /books
export async function createBook(bookData: Partial<Book>): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/books`, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify(bookData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to add book.");
  }
  return data;
}

// 4. PATCH /books/:id
export async function updateBook(id: string, bookData: Partial<Book>): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/books/${id}`, {
    method: "PATCH",
    headers: getHeaders(true),
    body: JSON.stringify(bookData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to update book.");
  }
  return data;
}

// 5. DELETE /books/:id
export async function deleteBook(id: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/books/${id}`, {
    method: "DELETE",
    headers: getHeaders(true),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to delete book.");
  }
  return data;
}

// 6. POST /borrows
export async function borrowBook(borrowData: {
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userEmail: string;
  userName: string;
  returnDate: string;
}): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/borrows`, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify(borrowData),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Could not borrow this book.");
  }
  return data;
}

// 7. GET /borrows
export async function fetchUserBorrows(email: string): Promise<Borrow[]> {
  const res = await fetch(`${API_BASE_URL}/borrows?email=${encodeURIComponent(email)}`, {
    headers: getHeaders(true),
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to fetch borrow records.");
  }
  return data;
}

// 8. DELETE /borrows/:id
export async function returnBorrowedBook(id: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/borrows/${id}`, {
    method: "DELETE",
    headers: getHeaders(true),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Failed to return book.");
  }
  return data;
}
