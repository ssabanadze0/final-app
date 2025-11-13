// store/authContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

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
  login: (
    username: string,
    password: string,
    remember?: boolean
  ) => Promise<void>;
  register: (data: {
    username: string;
    email: string;
    password: string;
  }) => Promise<boolean>; // 👈 change here
  logout: () => Promise<void>;
};

const STORAGE_KEY = "@fakestore_auth";

const AuthCtx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FakeStoreUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔁 1. On app start, try to restore saved auth
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return;

        const parsed = JSON.parse(raw) as {
          token: string | null;
          user: FakeStoreUser;
        };

        setToken(parsed.token ?? null);
        setUser(parsed.user);
      } catch (e) {
        console.warn("Failed to restore auth", e);
      }
    })();
  }, []);

  // 🔐 2. Login, with optional remember flag
  async function login(
    username: string,
    password: string,
    remember: boolean = false
  ) {
    try {
      setLoading(true);
      setError(null);

      // 1) ask FakeStore for token
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

      // 2) fetch all users and find this username
      const usersRes = await fetch("https://fakestoreapi.com/users");
      const users: FakeStoreUser[] = await usersRes.json();
      const found = users.find((u) => u.username === username);

      if (!found) {
        throw new Error("User not found in FakeStore");
      }

      setUser(found);

      // 3) if "remember me" is checked → save to storage
      if (remember) {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ token: data.token, user: found })
        );
      } else {
        // make sure nothing is stored if remember is OFF
        await AsyncStorage.removeItem(STORAGE_KEY);
      }
    } catch (e: any) {
      console.error(e);
      setError(e.message ?? "Login failed");
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }

  async function register(data: {
    username: string;
    email: string;
    password: string;
  }): Promise<boolean> {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("https://fakestoreapi.com/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      });

      // ✅ success if status 2xx (200–299)
      if (!res.ok) {
        throw new Error("Registration failed");
      }

      const created = await res.json();
      console.log("User created on FakeStore:", created);

      // ❌ no setUser, no setToken – NO auto login
      // user will log in manually afterwards
      return true;
    } catch (e: any) {
      console.error(e);
      setError(e.message ?? "Registration failed");
      return false;
    } finally {
      setLoading(false);
    }
  }

  // 🚪 4. Logout clears state AND storage
  async function logout() {
    setUser(null);
    setToken(null);
    setError(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
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
