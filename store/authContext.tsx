// store/authContext.tsx
import React, { createContext, useContext, useState } from "react";

export type FakeStoreUser = {
  id: number;
  email: string;
  username: string;
  password: string;
  name: {
    firstname: string;
    lastname: string;
  };
  phone: string;
  address: {
    city: string;
    street: string;
    number: number;
    zipcode: string;
    geolocation: {
      lat: string;
      long: string;
    };
  };
  __v?: number;
};

type AuthState = {
  user: FakeStoreUser | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (data: {
    username: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
};

const AuthCtx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FakeStoreUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(username: string, password: string) {
    try {
      setLoading(true);
      setError(null);

      // 1) ask FakeStore for a token
      const res = await fetch("https://fakestoreapi.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      const data: { token: string } = await res.json();
      setToken(data.token);

      // 2) fetch all users and find the one with this username
      const usersRes = await fetch("https://fakestoreapi.com/users");
      const users: FakeStoreUser[] = await usersRes.json();
      const found = users.find((u) => u.username === username);

      if (!found) {
        throw new Error("User not found in FakeStore users list");
      }

      setUser(found);
    } catch (e: any) {
      console.error(e);
      setError(e.message ?? "Login failed");
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }

  async function register(data: {
    username: string;
    email: string;
    password: string;
  }) {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("https://fakestoreapi.com/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Minimal body: FakeStore docs show id, username, email, password,
        // but id is usually auto-generated – we can omit it.
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      });

      // 👉 for your assignment you mainly need to check this:
      if (!res.ok) {
        throw new Error("Registration failed");
      }

      const created: FakeStoreUser = await res.json();
      // optional: auto-login newly created user
      setUser(created);
      setToken(null); // FakeStore /users doesn’t return a token
    } catch (e: any) {
      console.error(e);
      setError(e.message ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
    setError(null);
  }

  const value: AuthState = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
