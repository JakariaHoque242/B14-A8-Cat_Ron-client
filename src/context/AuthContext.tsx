"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthContextType } from "@/types";
import { authClient, useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Hook into BetterAuth session
  const { data: sessionData, isPending: sessionPending } = useSession();

  // Helper to fetch and cache JWT token
  const fetchAndStoreJWT = async (userData: { email: string; name?: string; id?: string }) => {
    try {
      // First attempt: call local Next.js /api/jwt route
      const res = await fetch("/api/jwt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem("booknook_token", data.token);
        setToken(data.token);
        return data.token;
      }
    } catch {
      // Fallback: call express server /jwt
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://b14-a8-cat-ron-server.vercel.app";
        const res2 = await fetch(`${apiUrl}/jwt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });
        const data2 = await res2.json();
        if (data2.token) {
          localStorage.setItem("booknook_token", data2.token);
          setToken(data2.token);
          return data2.token;
        }
      } catch (err) {
        console.error("Failed to generate JWT token:", err);
      }
    }
    return null;
  };

  // Sync session and local storage on mount / session change
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem("booknook_user");
      const storedToken = localStorage.getItem("booknook_token");

      if (storedToken) {
        setToken(storedToken);
      }

      if (sessionData?.user) {
        const activeUser: User = {
          id: sessionData.user.id || (sessionData.user as any)._id || "user-id",
          name: sessionData.user.name || "Reader",
          email: sessionData.user.email || "",
          image: sessionData.user.image || `https://api.dicebear.com/7.x/adventurer/svg?seed=${sessionData.user.email}`,
        };
        setUser(activeUser);
        localStorage.setItem("booknook_user", JSON.stringify(activeUser));
        if (!storedToken) {
          await fetchAndStoreJWT(activeUser);
        }
      } else if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          if (!storedToken) {
            await fetchAndStoreJWT(parsed);
          }
        } catch {
          localStorage.removeItem("booknook_user");
        }
      }

      if (!sessionPending) {
        setLoading(false);
      }
    };

    initAuth();
  }, [sessionData, sessionPending]);

  // Login handler
  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await authClient.signIn.email({
        email,
        password,
      });

      if (res.error) {
        toast.error(res.error.message || "Invalid email or password.");
        setLoading(false);
        return false;
      }

      const loggedInUser: User = {
        id: res.data?.user?.id || `user_${Date.now()}`,
        name: res.data?.user?.name || email.split("@")[0],
        email: email,
        image: res.data?.user?.image || `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`,
      };

      setUser(loggedInUser);
      localStorage.setItem("booknook_user", JSON.stringify(loggedInUser));
      await fetchAndStoreJWT(loggedInUser);

      toast.success("Welcome back to BookNook!");
      setLoading(false);
      return true;
    } catch (err: any) {
      toast.error(err.message || "Login failed. Please check your credentials.");
      setLoading(false);
      return false;
    }
  };

  // Register handler
  const register = async (name: string, email: string, password: string, image?: string): Promise<boolean> => {
    setLoading(true);
    try {
      const avatarUrl = image?.trim() || `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`;
      const res = await authClient.signUp.email({
        name,
        email,
        password,
        image: avatarUrl,
      });

      if (res.error) {
        toast.error(res.error.message || "Registration failed.");
        setLoading(false);
        return false;
      }

      const newUser: User = {
        id: res.data?.user?.id || `user_${Date.now()}`,
        name,
        email,
        image: avatarUrl,
      };

      setUser(newUser);
      localStorage.setItem("booknook_user", JSON.stringify(newUser));
      await fetchAndStoreJWT(newUser);

      toast.success("Account created successfully! Welcome to BookNook.");
      setLoading(false);
      return true;
    } catch (err: any) {
      toast.error(err.message || "Could not register account. Please try again.");
      setLoading(false);
      return false;
    }
  };

  // Google Login handler
  const loginWithGoogle = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: window.location.origin,
      });
    } catch (err: any) {
      toast.error(err.message || "Google authentication failed.");
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await authClient.signOut();
    } catch (err) {
      console.warn("SignOut notice:", err);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem("booknook_user");
      localStorage.removeItem("booknook_token");
      toast.success("Logged out successfully.");
    }
  };

  const getToken = () => {
    return token || (typeof window !== "undefined" ? localStorage.getItem("booknook_token") : null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
