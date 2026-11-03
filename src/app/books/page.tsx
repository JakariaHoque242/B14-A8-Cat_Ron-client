"use client";

import React, { useEffect, useState } from "react";
import { BookCard } from "@/components/BookCard";
import { fetchBooks } from "@/lib/api";
import { Book } from "@/types";
import { Search, Filter, BookOpen, Sparkles, SlidersHorizontal } from "lucide-react";

const CATEGORIES = ["All", "Fiction", "Science", "History", "Kids", "Others"];

export default function AllBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    document.title = "BookNook | All Books";
  }, []);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const data = await fetchBooks({
        category: selectedCategory !== "All" ? selectedCategory : undefined,
        search: searchQuery.trim() || undefined,
        sort: sortBy === "newest" ? "desc" : "asc",
      });
      setBooks(data);
    } catch (err) {
      console.error("Failed to load books:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadBooks();
    }, 250);
    return () => clearTimeout(timer);
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs font-semibold">
          <BookOpen className="w-4 h-4" />
          <span>Full Library Catalog</span>
        </div>
        <h1 className="font-serif font-black text-3xl sm:text-5xl text-stone-900 dark:text-stone-100 tracking-tight">
          Explore All Books
        </h1>
        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 leading-relaxed">
          Search across thousands of pages. Browse fiction, science, history, children's classics, and personal growth books available for loan.
        </p>
      </div>

      <div className="bg-white dark:bg-stone-900 p-4 sm:p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search by title, author, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-sm text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
            <SlidersHorizontal className="w-4 h-4 text-stone-400" />
            <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="newest">Newest Additions</option>
              <option value="oldest">Oldest Additions</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-2 scrollbar-none">
          <span className="text-xs font-semibold text-stone-400 flex items-center space-x-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Category:</span>
          </span>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                  isSelected
                    ? "bg-amber-600 text-white shadow-sm"
                    : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-96 rounded-2xl bg-stone-200 dark:bg-stone-800 animate-pulse"
            />
          ))}
        </div>
      ) : books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-4">
          <BookOpen className="w-12 h-12 text-stone-400 mx-auto" />
          <h3 className="font-serif font-bold text-xl text-stone-800 dark:text-stone-200">
            No Books Found
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
            {searchQuery
              ? `No titles matched "${searchQuery}". Try a different keyword or reset filters.`
              : "No books in this category yet."}
          </p>
          {(selectedCategory !== "All" || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700"
            >
              Reset Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
