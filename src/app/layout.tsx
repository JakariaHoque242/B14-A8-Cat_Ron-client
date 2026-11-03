import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: {
    default: "BookNook – A Small Online Library",
    template: "%s | BookNook",
  },
  description: "BookNook is a small online library platform. Add a book, borrow a book, return a book. Explore curated literature, borrow easily, and share your favorite reads.",
  keywords: ["online library", "books", "borrow books", "literature", "reading community", "BookNook"],
  authors: [{ name: "BookNook Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans flex flex-col min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100">
        <ThemeProvider>
          <AuthProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  borderRadius: "16px",
                  background: "#1c1917",
                  color: "#f5f5f4",
                  fontSize: "14px",
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
                  padding: "12px 18px",
                },
                success: {
                  iconTheme: {
                    primary: "#d97736",
                    secondary: "#fff",
                  },
                },
                error: {
                  iconTheme: {
                    primary: "#ef4444",
                    secondary: "#fff",
                  },
                },
              }}
            />
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
