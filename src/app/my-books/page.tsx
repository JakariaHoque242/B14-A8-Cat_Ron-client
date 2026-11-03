"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { fetchBooks, deleteBook } from "@/lib/api";
import { Book } from "@/types";
import { EditBookModal } from "@/components/EditBookModal";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import toast from "react-hot-toast";
import {
  Library,
  PlusCircle,
  Edit2,
  Trash2,
  Layers,
  BookOpen,
  Eye,
  Sparkles,
} from "lucide-react";

export default function MyBooksPage() {
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [selectedBookForEdit, setSelectedBookForEdit] = useState<Book | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedBookForDelete, setSelectedBookForDelete] = useState<Book | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    document.title = "BookNook | My Books";
  }, []);

  const loadMyBooks = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      // Fetch all books and filter by author email
      const all = await fetchBooks();
      const myAddedBooks = all.filter(
        (b) => b.userEmail?.toLowerCase() === user.email?.toLowerCase()
      );
      setBooks(myAddedBooks);
    } catch (err: any) {
      toast.error(err.message || "Failed to load your books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      loadMyBooks();
    }
  }, [user]);

  // Edit book handlers
  const handleEditClick = (book: Book) => {
    setSelectedBookForEdit(book);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = (updatedBook: Book) => {
    setBooks((prev) =>
      prev.map((b) => (b._id === updatedBook._id ? { ...b, ...updatedBook } : b))
    );
  };

  // Delete book handlers
  const handleDeleteClick = (book: Book) => {
    setSelectedBookForDelete(book);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBookForDelete) return;
    setDeleting(true);
    try {
      await deleteBook(selectedBookForDelete._id);
      toast.success(`"${selectedBookForDelete.title}" was removed from the catalog.`);
      setBooks((prev) => prev.filter((b) => b._id !== selectedBookForDelete._id));
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to delete book.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs font-semibold">
              <Library className="w-4 h-4" />
              <span>Personal Shelf</span>
            </div>
            <h1 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 dark:text-stone-100">
              My Added Books
            </h1>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Manage the books you contributed to BookNook. Edit details, adjust stock, or remove titles.
            </p>
          </div>

          <Link
            href="/add-book"
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-md transition-all self-start sm:self-auto hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Another Book</span>
          </Link>
        </div>

        {/* Content Table / Cards */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-24 rounded-2xl bg-stone-200 dark:bg-stone-800 animate-pulse"
              />
            ))}
          </div>
        ) : books.length > 0 ? (
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50/75 dark:bg-stone-800/40 text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    <th className="py-4 px-6">Book</th>
                    <th className="py-4 px-6">Author</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Copies</th>
                    <th className="py-4 px-6">Added On</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-sm">
                  {books.map((book) => (
                    <tr
                      key={book._id}
                      className="hover:bg-amber-50/40 dark:hover:bg-stone-800/50 transition-colors"
                    >
                      {/* Cover & Title */}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-stone-200">
                            <Image
                              src={book.image}
                              alt={book.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div>
                            <span className="font-serif font-bold text-stone-900 dark:text-stone-100 block line-clamp-1">
                              {book.title}
                            </span>
                            <span className="text-xs text-stone-400 block line-clamp-1 max-w-xs">
                              {book.description}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Author */}
                      <td className="py-4 px-6 font-medium text-stone-700 dark:text-stone-300">
                        {book.author}
                      </td>

                      {/* Category */}
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-amber-700 dark:text-amber-400 border border-stone-200 dark:border-stone-700">
                          {book.category}
                        </span>
                      </td>

                      {/* Copies */}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-1.5 font-bold text-stone-900 dark:text-stone-100">
                          <Layers className="w-3.5 h-3.5 text-amber-600" />
                          <span>{book.copies}</span>
                        </div>
                      </td>

                      {/* Added Date */}
                      <td className="py-4 px-6 text-xs text-stone-500">
                        {book.createdAt ? new Date(book.createdAt).toLocaleDateString() : "Active"}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {/* View details */}
                          <Link
                            href={`/books/${book._id}`}
                            className="p-2 rounded-xl text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                            title="View Public Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {/* Edit button */}
                          <button
                            type="button"
                            onClick={() => handleEditClick(book)}
                            className="p-2 rounded-xl text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                            title="Edit Book"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(book)}
                            className="p-2 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                            title="Delete Book"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-4">
            <BookOpen className="w-12 h-12 text-stone-400 mx-auto" />
            <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
              No Books Added Yet
            </h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
              You haven't added any books to BookNook yet. Share a book today and allow others to borrow it!
            </p>
            <Link
              href="/add-book"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Contribute Your First Book</span>
            </Link>
          </div>
        )}

        {/* Edit Modal */}
        <EditBookModal
          book={selectedBookForEdit}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleEditSuccess}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          title={selectedBookForDelete?.title || "this book"}
          itemType="book"
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          loading={deleting}
        />
      </div>
    </ProtectedRoute>
  );
}
