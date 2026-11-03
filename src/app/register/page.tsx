"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import {
  BookOpen,
  UserPlus,
  Lock,
  Mail,
  User,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register, loginWithGoogle, user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "BookNook | Register";
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  // Validation rules
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasMinLength = password.length >= 6;
  const isPasswordValid = hasUppercase && hasLowercase && hasMinLength;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name.trim() || !email.trim() || !password) {
      setErrorMessage("Please fill in all required fields.");
      toast.error("Please fill in all required fields.");
      return;
    }

    // Password criteria check
    if (!hasUppercase) {
      const err = "Password must contain at least one uppercase letter (A-Z).";
      setErrorMessage(err);
      toast.error(err);
      return;
    }
    if (!hasLowercase) {
      const err = "Password must contain at least one lowercase letter (a-z).";
      setErrorMessage(err);
      toast.error(err);
      return;
    }
    if (!hasMinLength) {
      const err = "Password must be at least 6 characters in length.";
      setErrorMessage(err);
      toast.error(err);
      return;
    }

    setLoading(true);
    const result = await register(name, email, password, photoURL);
    setLoading(false);

    if (result.success) {
      // Per instructions: "If the user registers successfully, then navigate them to their Login page."
      toast.success("Registration successful! Please login with your new account.");
      router.push("/login");
    } else {
      setErrorMessage(result.error || "Registration could not be completed. Please check your details and try again.");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl p-8 sm:p-10 space-y-8">
        {/* Brand & Heading */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-serif font-black text-2xl text-stone-900 dark:text-stone-100">
              Book<span className="text-amber-600">Nook</span>
            </span>
          </Link>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-stone-900 dark:text-stone-100 pt-2">
            Create Your Account
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400">
            Join our online library to borrow, read, and share books.
          </p>
        </div>

        {/* In-Form Error Alert */}
        {errorMessage && (
          <div className="flex items-center space-x-2.5 p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <User className="w-4 h-4 text-stone-400 absolute left-4 top-3" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="reader@booknook.app"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-4 top-3" />
            </div>
          </div>

          {/* Photo URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
              Photo URL (Optional)
            </label>
            <div className="relative">
              <input
                type="url"
                placeholder="https://..."
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <ImageIcon className="w-4 h-4 text-stone-400 absolute left-4 top-3" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
              Password *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <Lock className="w-4 h-4 text-stone-400 absolute left-4 top-3" />
            </div>

            {/* Password Validation Criteria Checklist */}
            <div className="mt-3 p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 space-y-1.5 text-xs">
              <span className="font-semibold text-stone-600 dark:text-stone-300 block text-[11px] uppercase tracking-wider mb-1">
                Password Requirements:
              </span>

              <div className="flex items-center space-x-2">
                {hasUppercase ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-stone-400" />
                )}
                <span className={hasUppercase ? "text-emerald-700 dark:text-emerald-400 font-medium" : "text-stone-500"}>
                  Must have an Uppercase letter (A-Z)
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {hasLowercase ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-stone-400" />
                )}
                <span className={hasLowercase ? "text-emerald-700 dark:text-emerald-400 font-medium" : "text-stone-500"}>
                  Must have a Lowercase letter (a-z)
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {hasMinLength ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <XCircle className="w-3.5 h-3.5 text-stone-400" />
                )}
                <span className={hasMinLength ? "text-emerald-700 dark:text-emerald-400 font-medium" : "text-stone-500"}>
                  Length must be at least 6 characters
                </span>
              </div>
            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center space-x-2 pt-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? "Creating Account..." : "Register"}</span>
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-stone-200 dark:border-stone-800 w-full" />
          <span className="bg-white dark:bg-stone-900 px-3 text-xs font-semibold text-stone-400 uppercase tracking-wider relative">
            Or
          </span>
        </div>

        {/* Google Social Registration */}
        <div>
          <button
            type="button"
            onClick={loginWithGoogle}
            className="w-full py-3 rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/80 hover:bg-stone-100 dark:hover:bg-stone-700/60 text-stone-800 dark:text-stone-200 text-sm font-semibold transition-all flex items-center justify-center space-x-3 shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.25 21.31 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.27C.46 8.2.01 10.05.01 12s.45 3.8 1.26 5.42l4.01-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.69 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Sign up with Google</span>
          </button>
        </div>

        {/* Link to Login */}
        <div className="text-center pt-2">
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Already registered on BookNook?{" "}
            <Link
              href="/login"
              className="font-bold text-amber-600 dark:text-amber-400 hover:underline"
            >
              Login to your account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
