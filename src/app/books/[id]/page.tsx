"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { fetchBookById } from "@/lib/api";
import { Book } from "@/types";
import { useAuth } from "@/context/AuthContext";
import { BorrowModal } from "@/components/BorrowModal";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle,
  Copy,
  Info,
  Layers,
  Sparkles,
  Tag,
  User,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";

export default function BookDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { user, loading: authLoading } = useAuth();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);

  const loadBook = async () => {
    if (!id) return;
    try {
      const data = await fetchBookById(id);
      setBook(data);
      document.title = `BookNook | ${data.title}`;
    } catch (err: any) {
      toast.error(err.message || "Could not load book information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBook();
  }, [id]);

  const handleBorrowClick = () => {
    if (!user) {
      toast.error("Please login first to borrow books from BookNook.");
      router.push(`/login?from=/books/${id}`);
      return;
    }
    setBorrowModalOpen(true);
  };

  if (loading || authLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="animate-pulse space-y-8">
          <div className="h-6 w-32 bg-stone-200 dark:bg-stone-800 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="h-[450px] bg-stone-200 dark:bg-stone-800 rounded-3xl"></div>
            <div className="space-y-4">
              <div className="h-10 bg-stone-200 dark:bg-stone-800 rounded-xl w-3/4"></div>
              <div className="h-6 bg-stone-200 dark:bg-stone-800 rounded-lg w-1/2"></div>
              <div className="h-32 bg-stone-200 dark:bg-stone-800 rounded-2xl"></div>
              <div className="h-12 bg-stone-200 dark:bg-stone-800 rounded-xl w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 text-center bg-white dark:bg-stone-800 rounded-3xl border border-stone-200 dark:border-stone-700 space-y-4">
        <BookOpen className="w-12 h-12 text-stone-400 mx-auto" />
        <h2 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
          Book Not Found
        </h2>
        <p className="text-sm text-stone-500">
          The requested book was not found or has been removed from the catalog.
        </p>
        <Link
          href="/books"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  const isAvailable = (book.copies ?? 0) > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div>
        <Link
          href="/books"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-amber-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Books</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl overflow-hidden p-6 sm:p-10 lg:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5">
            <div className="relative w-full h-[420px] sm:h-[480px] rounded-2xl overflow-hidden shadow-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
              <Image
                src={book.image}
                alt={book.title}
                fill
                priority
                className="object-cover object-center"
                unoptimized
              />
              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1.5 rounded-full text-xs font-bold backdrop-blur-md bg-stone-950/80 text-amber-300 border border-amber-300/30 shadow-md">
                  {book.category}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <Tag className="w-3.5 h-3.5" />
                <span>{book.category} Department</span>
              </div>
              <h1 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 dark:text-stone-100 leading-tight">
                {book.title}
              </h1>
              <p className="text-base text-stone-600 dark:text-stone-300 font-medium flex items-center space-x-2">
                <span>By</span>
                <span className="font-bold text-amber-700 dark:text-amber-400">{book.author}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700">
              <div className="flex items-center space-x-2">
                <Layers className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-semibold text-stone-800 dark:text-stone-200">
                  Stock Status:
                </span>
              </div>

              {isAvailable ? (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-300/40">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{book.copies} {book.copies === 1 ? "Copy" : "Copies"} Available</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 border border-red-300/40">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Not Available (All Copies Borrowed)</span>
                </span>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-bold text-base text-stone-900 dark:text-stone-100">
                Book Synopsis
              </h3>
              <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed whitespace-pre-line">
                {book.description}
              </p>
            </div>

            <div className="pt-4 border-t border-stone-100 dark:border-stone-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-500 dark:text-stone-400">
              <div className="flex items-center space-x-2.5">
                <User className="w-4 h-4 text-amber-600" />
                <div>
                  <span className="block text-[10px] uppercase font-bold text-stone-400">Added By</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">
                    {book.userName || "Community Librarian"}
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2.5">
                <Calendar className="w-4 h-4 text-amber-600" />
                <div>
                  <span className="block text-[10px] uppercase font-bold text-stone-400">Catalog Date</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">
                    {book.createdAt ? new Date(book.createdAt).toLocaleDateString() : "Active in Catalog"}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={handleBorrowClick}
                disabled={!isAvailable}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 ${
                  isAvailable
                    ? "bg-amber-600 hover:bg-amber-700 text-white hover:scale-105 hover:shadow-lg cursor-pointer"
                    : "bg-stone-300 dark:bg-stone-800 text-stone-500 dark:text-stone-500 cursor-not-allowed border border-stone-200 dark:border-stone-700"
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>{isAvailable ? "Borrow This Book" : "Not Available"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {book && (
        <BorrowModal
          book={book}
          isOpen={borrowModalOpen}
          onClose={() => setBorrowModalOpen(false)}
          onBorrowSuccess={loadBook}
        />
      )}
    </div>
  );
}
