"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Book } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { borrowBook } from "@/lib/api";
import toast from "react-hot-toast";
import { X, Calendar, BookOpen, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BorrowModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
  onBorrowSuccess: () => void;
}

export const BorrowModal: React.FC<BorrowModalProps> = ({
  book,
  isOpen,
  onClose,
  onBorrowSuccess,
}) => {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const defaultDueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const [returnDate, setReturnDate] = useState(defaultDueDate);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to borrow this book.");
      return;
    }

    if ((book.copies ?? 0) <= 0) {
      toast.error("Sorry, this book has no copies available to borrow.");
      return;
    }

    setSubmitting(true);
    try {
      await borrowBook({
        bookId: book._id,
        bookTitle: book.title,
        bookImage: book.image,
        userEmail: user.email,
        userName: user.name,
        returnDate,
      });

      toast.success(`"${book.title}" borrowed successfully! Return before ${returnDate}.`);
      onBorrowSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to borrow book.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25 }}
        className="relative w-full max-w-lg bg-white dark:bg-stone-800 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-700 overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-stone-100 dark:border-stone-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100">
                Confirm Book Loan
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                BookNook Lending Agreement
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-full hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="flex items-center space-x-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/60 border border-stone-200/60 dark:border-stone-700">
            <div className="relative w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-stone-200">
              <Image
                src={book.image}
                alt={book.title}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div className="truncate">
              <h4 className="font-serif font-bold text-stone-900 dark:text-stone-100 truncate">
                {book.title}
              </h4>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Author: {book.author}
              </p>
              <div className="mt-1 inline-flex items-center space-x-1.5 text-xs text-amber-600 dark:text-amber-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{book.copies} copies currently available</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1.5">
                Borrower Name (Read-only)
              </label>
              <input
                type="text"
                readOnly
                value={user?.name || ""}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-sm cursor-not-allowed font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1.5">
                Borrower Email (Read-only)
              </label>
              <input
                type="email"
                readOnly
                value={user?.email || ""}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-sm cursor-not-allowed font-medium truncate"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1.5">
              Select Promised Return Date
            </label>
            <div className="relative">
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <Calendar className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              Standard borrowing period is 14 days. You can return it anytime from your "My Borrows" tab.
            </p>
          </div>

          <div className="flex items-start space-x-2 text-xs text-stone-500 dark:text-stone-400 bg-amber-50/50 dark:bg-amber-950/20 p-3 rounded-xl border border-amber-200/40 dark:border-amber-900/40">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <span>
              By confirming, 1 copy will be deducted from the library. You cannot borrow the same book twice simultaneously.
            </span>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-stone-100 dark:border-stone-700">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || (book.copies ?? 0) <= 0}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 disabled:opacity-50 transition-all shadow-md"
            >
              {submitting ? "Processing Loan..." : "Confirm Borrow"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
