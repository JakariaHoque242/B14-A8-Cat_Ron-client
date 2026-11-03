"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { createBook } from "@/lib/api";
import toast from "react-hot-toast";
import {
  BookPlus,
  Image as ImageIcon,
  UploadCloud,
  CheckCircle2,
  Sparkles,
  Info
} from "lucide-react";

const CATEGORIES = ["Fiction", "Science", "History", "Kids", "Others"];

export default function AddBookPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Fiction");
  const [image, setImage] = useState("");
  const [copies, setCopies] = useState<number>(3);
  const [description, setDescription] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "BookNook | Add Book";
  }, []);

  // Handle image upload to ImgBB
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file must be under 5MB.");
      return;
    }

    setUploadingImage(true);
    const toastId = toast.loading("Uploading image to ImgBB...");

    try {
      const formData = new FormData();
      formData.append("image", file);

      // Use environment key or default imgbb client key
      const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "1e2b6eaebdb956f10ad9b1fdb57d76a7";
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.data?.url) {
        setImage(data.data.url);
        toast.success("Image uploaded successfully!", { id: toastId });
      } else {
        throw new Error(data.error?.message || "ImgBB upload failed");
      }
    } catch (err: any) {
      toast.error(
        "Could not upload to ImgBB directly. You can also paste any public image URL below.",
        { id: toastId }
      );
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !author.trim() || !image.trim() || !description.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (copies < 1) {
      toast.error("Total copies must be at least 1.");
      return;
    }

    setSubmitting(true);
    try {
      await createBook({
        title,
        author,
        category,
        image,
        copies: Number(copies),
        description,
        userName: user?.name,
        userEmail: user?.email,
      });

      toast.success(`"${title}" was added to BookNook catalog!`);
      router.push("/books");
    } catch (err: any) {
      toast.error(err.message || "Failed to add book.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-xs font-semibold">
            <BookPlus className="w-4 h-4" />
            <span>Library Contribution</span>
          </div>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-stone-900 dark:text-stone-100">
            Add a New Book
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Contribute a book to our community catalog. Fill out the details below to make it available for readers to borrow.
          </p>
        </div>

        {/* Add Book Form Card */}
        <div className="bg-white dark:bg-stone-900 p-6 sm:p-10 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title & Author */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
                  Book Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sapiens: A Brief History of Humankind"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
                  Author Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Yuval Noah Harari"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Category & Total Copies */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
                  Total Copies Available *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={copies}
                  onChange={(e) => setCopies(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-[11px] text-stone-400 mt-1 block">
                  Copies decrement by 1 on each borrow, and increment on return.
                </span>
              </div>
            </div>

            {/* Book Image Upload or URL */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                Book Cover Image * (Upload or URL)
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* File Upload to ImgBB */}
                <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-stone-300 dark:border-stone-700 hover:border-amber-500 bg-stone-50 dark:bg-stone-800/40 cursor-pointer transition-colors text-center group">
                  <UploadCloud className="w-8 h-8 text-stone-400 group-hover:text-amber-600 transition-colors mb-2" />
                  <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    {uploadingImage ? "Uploading to ImgBB..." : "Click to Upload Image File"}
                  </span>
                  <span className="text-[10px] text-stone-400 mt-0.5">
                    PNG, JPG, WEBP up to 5MB
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>

                {/* Direct URL input with preview */}
                <div className="flex flex-col justify-between space-y-2">
                  <div className="relative">
                    <input
                      type="url"
                      required
                      placeholder="Or paste direct image URL (https://...)"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {image ? (
                    <div className="flex items-center space-x-3 p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                      <div className="relative w-12 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-stone-200">
                        <Image src={image} alt="Cover Preview" fill className="object-cover" unoptimized />
                      </div>
                      <div className="truncate text-xs">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Image URL Loaded</span>
                        </span>
                        <p className="text-[10px] text-stone-400 truncate max-w-xs">{image}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] text-stone-400">
                      Tip: You can use any high-resolution book cover from Unsplash or upload directly via the upload box.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
                Short Description *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Write a captivating summary of the book, its major themes, or why you recommend it to fellow readers..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>

            {/* Read-Only Contributor Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">
                  Contributor Name (Read-Only)
                </label>
                <input
                  type="text"
                  readOnly
                  value={user?.name || ""}
                  className="w-full px-3 py-2 rounded-xl bg-transparent border-0 text-stone-800 dark:text-stone-200 text-sm font-semibold cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-400 mb-1">
                  Contributor Email (Read-Only)
                </label>
                <input
                  type="email"
                  readOnly
                  value={user?.email || ""}
                  className="w-full px-3 py-2 rounded-xl bg-transparent border-0 text-stone-800 dark:text-stone-200 text-sm font-semibold cursor-not-allowed"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting || uploadingImage}
                className="w-full py-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-base shadow-lg hover:shadow-xl disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
              >
                <BookPlus className="w-5 h-5" />
                <span>{submitting ? "Adding Book to Library..." : "Add Book"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}
