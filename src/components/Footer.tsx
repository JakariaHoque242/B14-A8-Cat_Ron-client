import React from "react";
import Link from "next/link";
import { BookOpen, Mail, Phone, MapPin, Github, Linkedin, Facebook } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-md">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-2xl font-serif font-black tracking-tight text-white">
                Book<span className="text-amber-500">Nook</span>
              </span>
            </Link>
            <p className="text-sm text-stone-400 leading-relaxed">
              BookNook is an open community library where readers share, explore, and borrow literature freely. Add a book, borrow a book, return a book.
            </p>
            {/* Social Links with NEW X Logo */}
            <div className="flex items-center space-x-3 pt-2">
              {/* New X Logo */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-amber-600 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="X (formerly Twitter)"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-amber-600 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-amber-600 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-stone-800 hover:bg-amber-600 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-4">
            <h3 className="text-white font-serif font-bold text-base tracking-wide">
              Explore Library
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">
                  Home Catalog
                </Link>
              </li>
              <li>
                <Link href="/books" className="hover:text-amber-400 transition-colors">
                  Browse All Books
                </Link>
              </li>
              <li>
                <Link href="/add-book" className="hover:text-amber-400 transition-colors">
                  Contribute a Book
                </Link>
              </li>
              <li>
                <Link href="/my-borrows" className="hover:text-amber-400 transition-colors">
                  Active Borrows
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-white font-serif font-bold text-base tracking-wide">
              Top Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/books?category=Fiction" className="hover:text-amber-400 transition-colors">
                  Fiction & Literature
                </Link>
              </li>
              <li>
                <Link href="/books?category=Science" className="hover:text-amber-400 transition-colors">
                  Science & Technology
                </Link>
              </li>
              <li>
                <Link href="/books?category=History" className="hover:text-amber-400 transition-colors">
                  History & Biographies
                </Link>
              </li>
              <li>
                <Link href="/books?category=Kids" className="hover:text-amber-400 transition-colors">
                  Kids & Illustrated Tales
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-white font-serif font-bold text-base tracking-wide">
              Contact & Help
            </h3>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                <span>42 Library Way, Reading Boulevard, Book District</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <a href="mailto:support@booknook.app" className="hover:text-amber-400">
                  support@booknook.app
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>+1 (800) 266-5665</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} BookNook – Small Online Library. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#privacy" className="hover:text-stone-300">Privacy Policy</a>
            <a href="#terms" className="hover:text-stone-300">Terms of Service</a>
            <a href="#cookies" className="hover:text-stone-300">Cookie Preferences</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
