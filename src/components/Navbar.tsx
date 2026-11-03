"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "./ThemeToggle";
import {
  BookOpen,
  Menu,
  X,
  LogOut,
  PlusCircle,
  Library,
  BookmarkCheck,
  ChevronDown
} from "lucide-react";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", href: "/", public: true },
    { name: "All Books", href: "/books", public: true },
    { name: "Add Book", href: "/add-book", public: false, icon: PlusCircle },
    { name: "My Books", href: "/my-books", public: false, icon: Library },
    { name: "My Borrows", href: "/my-borrows", public: false, icon: BookmarkCheck },
  ];

  const visibleLinks = navLinks.filter((link) => link.public || !!user);

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-stone-50/90 dark:bg-stone-900/90 border-b border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-serif font-black tracking-tight text-stone-900 dark:text-stone-100">
                Book<span className="text-amber-600">Nook</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-stone-400 dark:text-stone-500">
                Online Library
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {visibleLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 font-semibold"
                      : "text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100/70 dark:hover:bg-stone-800"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />

            {!user ? (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 text-sm font-medium rounded-full bg-amber-600 hover:bg-amber-700 text-white shadow-sm hover:shadow transition-all duration-200"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2.5 p-1 rounded-full border border-stone-200 dark:border-stone-700 hover:border-amber-400 dark:hover:border-amber-500 focus:outline-none transition-all"
                  aria-expanded={userDropdownOpen}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-amber-100 dark:bg-stone-800 relative border border-stone-200 dark:border-stone-700">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || "User"}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-amber-700 font-bold text-sm">
                        {user.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-stone-500 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-stone-800 shadow-2xl border border-stone-100 dark:border-stone-700 py-3 px-2 z-50">
                    <div className="px-3 py-2 border-b border-stone-100 dark:border-stone-700">
                      <p className="text-sm font-semibold text-stone-900 dark:text-stone-100 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                        {user.email}
                      </p>
                    </div>

                    <div className="mt-2 space-y-1">
                      <div className="px-3 py-2 text-xs font-medium text-stone-400 uppercase tracking-wider">
                        My Account
                      </div>
                      <Link
                        href="/my-books"
                        className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-sm text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700/60 transition-colors"
                      >
                        <Library className="w-4 h-4 text-amber-600" />
                        <span>My Books</span>
                      </Link>
                      <Link
                        href="/my-borrows"
                        className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-sm text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700/60 transition-colors"
                      >
                        <BookmarkCheck className="w-4 h-4 text-amber-600" />
                        <span>My Borrows</span>
                      </Link>
                      <Link
                        href="/add-book"
                        className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-sm text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700/60 transition-colors"
                      >
                        <PlusCircle className="w-4 h-4 text-amber-600" />
                        <span>Add New Book</span>
                      </Link>
                    </div>

                    <div className="mt-2 pt-2 border-t border-stone-100 dark:border-stone-700">
                      <button
                        onClick={logout}
                        type="button"
                        className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              className="p-2 rounded-lg text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 dark:border-stone-800 bg-stone-50/95 dark:bg-stone-900/95 px-4 pt-3 pb-6 space-y-3">
          {visibleLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`block px-3 py-2 rounded-xl text-base font-medium ${
                  isActive
                    ? "bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-400 font-semibold"
                    : "text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-stone-200 dark:border-stone-800">
            {!user ? (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  className="w-full text-center py-2.5 text-sm font-medium rounded-xl border border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-100"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="w-full text-center py-2.5 text-sm font-medium rounded-xl bg-amber-600 text-white"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 px-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-amber-100 relative">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name || "User"}
                        width={40}
                        height={40}
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-amber-700">
                        {user.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="truncate">
                    <p className="font-semibold text-stone-900 dark:text-stone-100">{user.name}</p>
                    <p className="text-xs text-stone-500 truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="w-full py-2.5 rounded-xl text-sm font-medium bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
