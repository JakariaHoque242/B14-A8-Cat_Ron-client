"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { fetchUserBorrows, returnBorrowedBook } from "@/lib/api";
import { Borrow } from "@/types";
import { DeleteConfirmModal } from "@/components/DeleteConfirmModal";
import toast from "react-hot-toast";
import {
  BookmarkCheck,
  Calendar,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function MyBorrowsPage() {
  const { user } = useAuth();
  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);

  // Return modal state
  const [selectedBorrowForReturn, setSelectedBorrowForReturn] = useState<Borrow | null>(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returning, setReturning] = useState(false);

  useEffect(() => {
    document.title = "BookNook | My Borrows";
  }, []);

  const loadBorrows = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const data = await fetchUserBorrows(user.email);
      setBorrows(data);
    } catch (err: any) {
      toast.error(err.message || "Could not load your borrowed books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      loadBorrows();
    }
  }, [user]);

  const handleReturnClick = (borrow: Borrow) => {
    setSelectedBorrowForReturn(borrow);
    setIsReturnModalOpen(true);
  };

  const handleConfirmReturn = async () => {
    if (!selectedBorrowForReturn) return;
    setReturning(true);
    try {
      await returnBorrowedBook(selectedBorrowForReturn._id);
      toast.success(
        `"${selectedBorrowForReturn.bookTitle}" returned successfully! 1 copy returned to library.`
      );
      setBorrows((prev) => prev.filter((b) => b._id !== selectedBorrowForReturn._id));
      setIsReturnModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to return book.");
    } finally {
      setReturning(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs font-semibold">
              <BookmarkCheck className="w-4 h-4" />
              <span>Active Loans</span>
            </div>
            <h1 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 dark:text-stone-100">
              My Borrowed Books
            </h1>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Track your borrowed titles, due dates, and return books when you finish reading.
            </p>
          </div>

          <Link
            href="/books"
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-md transition-all self-start sm:self-auto hover:scale-105"
          >
            <BookOpen className="w-4 h-4" />
            <span>Borrow Another Book</span>
          </Link>
        </div>

        {/* Borrows Table */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-24 rounded-2xl bg-stone-200 dark:bg-stone-800 animate-pulse"
              />
            ))}
          </div>
        ) : borrows.length > 0 ? (
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50/75 dark:bg-stone-800/40 text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    <th className="py-4 px-6">Book Title & Cover</th>
                    <th className="py-4 px-6">Borrow Date</th>
                    <th className="py-4 px-6">Return Due Date</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-sm">
                  {borrows.map((borrow) => {
                    const isOverdue = new Date(borrow.returnDate) < new Date();
                    return (
                      <tr
                        key={borrow._id}
                        className="hover:bg-amber-50/40 dark:hover:bg-stone-800/50 transition-colors"
                      >
                        {/* Book Info */}
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-stone-200">
                              <Image
                                src={borrow.bookImage}
                                alt={borrow.bookTitle}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <div>
                              <span className="font-serif font-bold text-stone-900 dark:text-stone-100 block line-clamp-1">
                                {borrow.bookTitle}
                              </span>
                              <Link
                                href={`/books/${borrow.bookId}`}
                                className="text-xs text-amber-600 hover:underline flex items-center space-x-1 mt-0.5"
                              >
                                <span>View book page</span>
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            </div>
                          </div>
                        </td>

                        {/* Borrow Date */}
                        <td className="py-4 px-6 text-stone-600 dark:text-stone-300">
                          <div className="flex items-center space-x-2 text-xs">
                            <Calendar className="w-4 h-4 text-stone-400" />
                            <span>{borrow.borrowDate}</span>
                          </div>
                        </td>

                        {/* Return Due Date */}
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2 text-xs font-semibold">
                            <Clock className={`w-4 h-4 ${isOverdue ? 'text-red-500' : 'text-amber-500'}`} />
                            <span className={isOverdue ? "text-red-600 dark:text-red-400" : "text-stone-700 dark:text-stone-300"}>
                              {borrow.returnDate}
                            </span>
                            {isOverdue && (
                              <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                                Overdue
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-400 border border-amber-300/40">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Currently Borrowed</span>
                          </span>
                        </td>

                        {/* Return Book Button */}
                        <td className="py-4 px-6 text-right">
                          <button
                            type="button"
                            onClick={() => handleReturnClick(borrow)}
                            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold bg-stone-900 hover:bg-amber-600 text-white dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-amber-500 dark:hover:text-white transition-all shadow-sm"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>Return Book</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-4">
            <BookmarkCheck className="w-12 h-12 text-stone-400 mx-auto" />
            <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
              No Active Borrows
            </h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
              You haven't borrowed any books currently. Explore the library catalog and borrow your first read today!
            </p>
            <Link
              href="/books"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore All Books</span>
            </Link>
          </div>
        )}

        {/* Return Confirmation Modal */}
        <DeleteConfirmModal
          isOpen={isReturnModalOpen}
          title={selectedBorrowForReturn?.bookTitle || "this book"}
          itemType="borrow loan"
          onClose={() => setIsReturnModalOpen(false)}
          onConfirm={handleConfirmReturn}
          loading={returning}
        />
      </div>
    </ProtectedRoute>
  );
}
