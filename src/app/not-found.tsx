import React from "react";
import Link from "next/link";
import { BookX, Home, Compass } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | BookNook",
};

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="relative mx-auto w-24 h-24 rounded-3xl bg-amber-100 dark:bg-stone-800 text-amber-600 flex items-center justify-center shadow-inner">
          <BookX className="w-12 h-12" />
          <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center shadow">
            404
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 dark:text-stone-100">
            Lost Between the Pages
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
            The book, shelf, or chapter you are looking for does not exist in our catalog or may have been relocated.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm shadow-md transition-all hover:scale-105"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/books"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-sm transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Browse Library</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
