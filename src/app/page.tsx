"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BannerSlider } from "@/components/BannerSlider";
import { BookCard } from "@/components/BookCard";
import { fetchBooks } from "@/lib/api";
import { Book } from "@/types";
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  Search,
  CheckCircle,
  Repeat,
  Star,
  Quote,
  TrendingUp,
  Award,
  Users,
  Compass,
  BookmarkCheck
} from "lucide-react";

export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNewArrivals = async () => {
      try {
        const books = await fetchBooks({ limit: 6, sort: "desc" });
        setNewArrivals(books);
      } catch (err) {
        console.error("Failed to load new arrivals:", err);
      } finally {
        setLoading(false);
      }
    };

    loadNewArrivals();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-20">
      <BannerSlider />

      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Fresh Off the Shelves</span>
            </div>
            <h2 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 dark:text-stone-100">
              New Arrivals
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 max-w-xl">
              Explore the latest 6 additions to our community library. Discover newly shared perspectives and grab your copy before it is borrowed.
            </p>
          </div>

          <Link
            href="/books"
            className="inline-flex items-center space-x-2 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 group"
          >
            <span>Explore All Books</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
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
        ) : newArrivals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {newArrivals.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-stone-800 rounded-3xl border border-stone-200 dark:border-stone-700">
            <BookOpen className="w-12 h-12 text-stone-400 mx-auto mb-3" />
            <h3 className="font-serif font-bold text-lg text-stone-800 dark:text-stone-200">
              Catalog Initializing
            </h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-1 max-w-sm mx-auto">
              No books currently found. Be the first reader to add a book to BookNook!
            </p>
            <Link
              href="/add-book"
              className="mt-4 inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-amber-600 text-white text-sm font-semibold hover:bg-amber-700 shadow"
            >
              <span>Add First Book</span>
            </Link>
          </div>
        )}

        <div className="text-center pt-4">
          <Link
            href="/books"
            className="inline-flex items-center space-x-3 px-8 py-3.5 rounded-2xl bg-stone-900 dark:bg-stone-100 hover:bg-amber-600 dark:hover:bg-amber-500 text-white dark:text-stone-900 dark:hover:text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200"
          >
            <span>See All Books</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="bg-gradient-to-br from-amber-50/60 via-stone-50 to-amber-100/30 dark:from-stone-900 dark:via-stone-900/80 dark:to-stone-950 p-8 sm:p-12 lg:p-16 rounded-3xl border border-stone-200/80 dark:border-stone-800 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Lending Made Simple</span>
          </div>
          <h2 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 dark:text-stone-100">
            How Borrowing Works
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            Borrowing from BookNook requires no membership fees and no complicated checkout. Just four straightforward steps:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "01",
              icon: Search,
              title: "Discover & Filter",
              desc: "Browse our dynamic library across fiction, science, history, and children's literature with live copy counts.",
            },
            {
              step: "02",
              icon: BookmarkCheck,
              title: "1-Click Borrow",
              desc: "Select a return date and confirm loan. Our system atomically updates available copies in real time.",
            },
            {
              step: "03",
              icon: BookOpen,
              title: "Immerse & Read",
              desc: "Enjoy reading at your own pace without pressure. Track active loans conveniently from your personal dashboard.",
            },
            {
              step: "04",
              icon: Repeat,
              title: "Return & Renew",
              desc: "Return the book with a single click once finished so the next reader can borrow and enjoy it.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative bg-white dark:bg-stone-800/80 p-6 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="text-3xl font-serif font-black text-amber-600/20 dark:text-amber-500/10 group-hover:text-amber-600/40 transition-colors">
                  {item.step}
                </div>
                <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 flex items-center justify-center my-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Curated Genres</span>
          </div>
          <h2 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 dark:text-stone-100">
            Top Categories & Genres
          </h2>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Browse hand-picked collections crafted for curious minds and passionate book lovers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {[
            {
              name: "Fiction",
              count: "Classic & Modern",
              color: "from-rose-500/20 to-amber-500/20",
              icon: BookOpen,
              desc: "Engaging novels, narrative thrillers, and award-winning literature.",
            },
            {
              name: "Science",
              count: "Cosmos & Tech",
              color: "from-blue-500/20 to-teal-500/20",
              icon: Sparkles,
              desc: "Astrophysics, biology, quantum theory, and future technology.",
            },
            {
              name: "History",
              count: "Eras & Civilizations",
              color: "from-amber-500/20 to-yellow-500/20",
              icon: Award,
              desc: "Human origins, pivotal revolutions, and unforgettable biographies.",
            },
            {
              name: "Kids",
              count: "Illustrated & Tales",
              color: "from-emerald-500/20 to-green-500/20",
              icon: Star,
              desc: "Bedtime stories, picture books, and imaginative adventures for young minds.",
            },
            {
              name: "Others",
              count: "Philosophy & Growth",
              color: "from-purple-500/20 to-indigo-500/20",
              icon: Users,
              desc: "Mindfulness, productivity habits, arts, and personal development.",
            },
          ].map((cat) => {
            const CatIcon = cat.icon;
            return (
              <Link
                key={cat.name}
                href={`/books?category=${cat.name}`}
                className="group flex flex-col justify-between p-6 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-amber-500 dark:hover:border-amber-400 hover:shadow-xl transition-all duration-300"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-stone-700/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <CatIcon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-stone-900 dark:text-stone-100 group-hover:text-amber-600 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 block mt-0.5">
                    {cat.count}
                  </span>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 line-clamp-2">
                    {cat.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-700/60 flex items-center text-xs font-semibold text-stone-700 dark:text-stone-300 group-hover:text-amber-600">
                  <span>Explore Genre</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="bg-stone-100 dark:bg-stone-900 p-8 sm:p-12 lg:p-16 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Reader Voices</span>
          </div>
          <h2 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 dark:text-stone-100">
            What BookNook Readers Say
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Hear from community members who borrow, read, and share books every week.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: "BookNook reintroduced the joy of borrowing books into my daily commute. The 1-click loan system and transparent copy counts are brilliant.",
              author: "Sophia Ramirez",
              role: "Literature Enthusiast",
              rating: 5,
              avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
            },
            {
              quote: "Contributing my favorite science books and seeing them borrowed by curious students is deeply rewarding. A genuinely well-designed library community.",
              author: "Dr. Marcus Vance",
              role: "Astrophysics Researcher",
              rating: 5,
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
            },
            {
              quote: "Found Charlotte's Web and The Little Prince for my kids. Returning them when done is so effortless that we borrow a new adventure every Friday night.",
              author: "Elena Rostova",
              role: "Parent & Teacher",
              rating: 5,
              avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
            },
          ].map((review, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-stone-800 p-6 rounded-2xl border border-stone-200/80 dark:border-stone-700 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-1 text-amber-500">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-amber-500/40" />
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed italic">
                  "{review.quote}"
                </p>
              </div>

              <div className="flex items-center space-x-3 pt-3 border-t border-stone-100 dark:border-stone-700">
                <img
                  src={review.avatar}
                  alt={review.author}
                  className="w-10 h-10 rounded-full object-cover border border-amber-300/40"
                />
                <div>
                  <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 font-serif">
                    {review.author}
                  </h4>
                  <p className="text-[11px] text-stone-400">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden bg-amber-600 text-white rounded-3xl p-8 sm:p-12 lg:p-16 shadow-xl">
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <h2 className="font-serif font-black text-3xl sm:text-4xl text-white">
            Have a Book Worth Sharing?
          </h2>
          <p className="text-amber-100 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Give your loved books a new life. Add them to BookNook so readers across our community can borrow and gain knowledge.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/add-book"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white text-stone-950 font-bold text-sm shadow-md hover:bg-amber-50 transition-colors"
            >
              Add a Book Now
            </Link>
            <Link
              href="/books"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-amber-700/80 hover:bg-amber-700 text-white font-bold text-sm border border-amber-400/30 transition-colors"
            >
              Browse Library Catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
