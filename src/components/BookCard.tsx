"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Book } from "@/types";
import { ArrowRight, BookMarked, User } from "lucide-react";

interface BookCardProps {
  book: Book;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const isAvailable = (book.copies ?? 0) > 0;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-stone-800 rounded-2xl overflow-hidden border border-stone-200/80 dark:border-stone-700/80 hover:shadow-xl dark:hover:shadow-stone-900/50 hover:-translate-y-1 transition-all duration-300 group">
      {/* Cover Image Container */}
      <div className="relative w-full h-64 sm:h-72 bg-stone-100 dark:bg-stone-900 overflow-hidden">
        <Image
          src={book.image}
          alt={book.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          unoptimized
        />
        {/* Category Pill Overlay */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-stone-900/75 text-amber-300 border border-amber-300/20 shadow-sm">
            {book.category}
          </span>
        </div>

        {/* Available Copies Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm ${
              isAvailable
                ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30"
                : "bg-red-950/80 text-red-300 border border-red-500/30"
            }`}
          >
            {isAvailable ? `${book.copies} ${book.copies === 1 ? 'copy' : 'copies'}` : "Out of stock"}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-6 justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100 line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
            {book.title}
          </h3>

          <div className="flex items-center space-x-2 text-sm text-stone-500 dark:text-stone-400">
            <User className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span className="truncate font-medium">{book.author}</span>
          </div>

          <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
            {book.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-700/60">
          <Link
            href={`/books/${book._id}`}
            className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 transition-all duration-200 shadow-sm hover:shadow"
          >
            <span>View Details</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
