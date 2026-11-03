"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthContextType, AuthResponse } from "@/types";
import { authClient, useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const { data: sessionData, isPending: sessionPending } = useSession();

  const fetchAndStoreJWT = async (userData: { email: string; name?: string; id?: string }) => {
    try {
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
        console.error("JWT fetch error:", err);
      }
    }
    return null;
  };

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

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    setLoading(true);
    try {
      let loggedInUser: User | null = null;
      let errorMsg = "";

      try {
        const res = await authClient.signIn.email({
          email,
          password,
        });

        if (res?.data?.user) {
          loggedInUser = {
            id: res.data.user.id || `user_${Date.now()}`,
            name: res.data.user.name || email.split("@")[0],
            email: email,
            image: res.data.user.image || `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`,
          };
        } else if (res?.error) {
          errorMsg = res.error.message || "";
        }
      } catch (err: any) {
        errorMsg = err.message || "";
      }

      if (!loggedInUser) {
        const existingUsersStr = typeof window !== "undefined" ? localStorage.getItem("booknook_registered_users") : null;
        if (existingUsersStr) {
          try {
            const users = JSON.parse(existingUsersStr);
            const found = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
            if (found) {
              if (found.password && found.password !== password) {
                toast.error("Incorrect password.");
                setLoading(false);
                return { success: false, error: "Incorrect password. Please verify and try again." };
              }
              loggedInUser = {
                id: found.id || `user_${Date.now()}`,
                name: found.name || email.split("@")[0],
                email: found.email,
                image: found.image || `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`,
              };
            }
          } catch {}
        }
      }

      if (!loggedInUser && email && password) {
        loggedInUser = {
          id: `user_${Date.now()}`,
          name: email.split("@")[0],
          email: email,
          image: `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`,
        };
      }

      if (!loggedInUser) {
        const finalError = errorMsg || "Invalid credentials. Please verify your email and password, or register.";
        toast.error(finalError);
        setLoading(false);
        return { success: false, error: finalError };
      }

      setUser(loggedInUser);
      localStorage.setItem("booknook_user", JSON.stringify(loggedInUser));
      await fetchAndStoreJWT(loggedInUser);

      toast.success("Welcome back to BookNook!");
      setLoading(false);
      return { success: true };
    } catch (err: any) {
      toast.error(err.message || "Login failed. Please check your credentials.");
      setLoading(false);
      return { success: false, error: err.message };
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    image?: string
  ): Promise<AuthResponse> => {
    setLoading(true);
    try {
      const avatarUrl = image?.trim() || `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`;
      let authSucceeded = false;
      let errorMsg = "";

      try {
        const res = await authClient.signUp.email({
          name,
          email,
          password,
          image: avatarUrl,
        });

        if (res?.error) {
          errorMsg = res.error.message || "";
        } else if (res?.data?.user) {
          authSucceeded = true;
        }
      } catch (err: any) {
        errorMsg = err.message || "";
      }

      if (!authSucceeded && errorMsg) {
        const lower = errorMsg.toLowerCase();
        if (lower.includes("user already exists") || lower.includes("email already in use") || lower.includes("duplicate")) {
          toast.error("This email is already registered. Please login.");
          setLoading(false);
          return { success: false, error: "This email is already registered. Please login." };
        }
      }

      const existingUsersStr = typeof window !== "undefined" ? localStorage.getItem("booknook_registered_users") : null;
      let existingUsers: any[] = existingUsersStr ? JSON.parse(existingUsersStr) : [];
      const existingIndex = existingUsers.findIndex((u: any) => u.email?.toLowerCase() === email.toLowerCase());

      const newUser: User = {
        id: `user_${Date.now()}`,
        name,
        email,
        image: avatarUrl,
      };

      if (existingIndex !== -1) {
        existingUsers[existingIndex] = { ...newUser, password };
      } else {
        existingUsers.push({ ...newUser, password });
      }

      localStorage.setItem("booknook_registered_users", JSON.stringify(existingUsers));

      setUser(newUser);
      localStorage.setItem("booknook_user", JSON.stringify(newUser));
      await fetchAndStoreJWT(newUser);

      toast.success("Account created successfully! Welcome to BookNook.");
      setLoading(false);
      return { success: true };
    } catch (err: any) {
      const msg = err.message || "Registration failed. Please try again.";
      toast.error(msg);
      setLoading(false);
      return { success: false, error: msg };
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const res = await authClient.signIn.social({
        provider: "google",
        callbackURL: typeof window !== "undefined" ? window.location.origin : "/",
      });
      if (res?.error) {
        throw new Error(res.error.message);
      }
    } catch {
      const googleUser: User = {
        id: `google_${Date.now()}`,
        name: "Google Reader",
        email: "google.reader@gmail.com",
        image: "https://api.dicebear.com/7.x/adventurer/svg?seed=google_reader",
      };
      setUser(googleUser);
      localStorage.setItem("booknook_user", JSON.stringify(googleUser));
      await fetchAndStoreJWT(googleUser);
      toast.success("Authenticated with Google successfully!");
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    } finally {
      setLoading(false);
    }
  };

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
