"use client";

import React from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  itemType?: string;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title,
  itemType = "book",
  onClose,
  onConfirm,
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-md bg-white dark:bg-stone-800 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-700 p-6 space-y-5"
      >
        <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="text-center space-y-2">
          <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-stone-100">
            Remove this {itemType}?
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Are you sure you want to delete <span className="font-semibold text-stone-800 dark:text-stone-200">"{title}"</span>? This action is permanent and cannot be undone.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-700/60 hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors shadow flex items-center justify-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>{loading ? "Deleting..." : "Delete"}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
