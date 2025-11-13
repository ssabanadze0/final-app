import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type FakeStoreUser = {
  id: number;
  email: string;
  username: string;
  password: string;
  name: { firstname: string; lastname: string };
  phone: string;
  address: {
    city: string;
    street: string;
    number: number;
    zipcode: string;
    geolocation: { lat: string; long: string };
  };
  __v?: number;
};

type AuthState = {
  user: FakeStoreUser | null;
  token: string | null;
  avatar: string | null;
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
  }) => Promise<boolean>;
  logout: () => Promise<void>;
  setAvatar: (uri: string | null) => Promise<void>;
};

const STORAGE_KEY = "@fakestore_auth";
const AuthCtx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FakeStoreUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [avatar, setAvatarState] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!raw) return;

        const parsed = JSON.parse(raw) as {
          token: string | null;
          user: FakeStoreUser;
          avatar?: string | null;
        };

        setToken(parsed.token ?? null);
        setUser(parsed.user);
        setAvatarState(parsed.avatar ?? null);
      } catch {}
    })();
  }, []);

  async function login(
    username: string,
    password: string,
    remember: boolean = false
  ) {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("https://fakestoreapi.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("Invalid credentials");

      const data: { token: string } = await res.json();
      setToken(data.token);

      const usersRes = await fetch("https://fakestoreapi.com/users");
      const users: FakeStoreUser[] = await usersRes.json();
      const found = users.find((u) => u.username === username);

      if (!found) throw new Error("User not found");

      setUser(found);

      if (remember) {
        await AsyncStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            token: data.token,
            user: found,
            avatar: null,
          })
        );
      } else {
        await AsyncStorage.removeItem(STORAGE_KEY);
      }
    } catch (e: any) {
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
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Registration failed");

      await res.json();
      return true;
    } catch (e: any) {
      setError(e.message ?? "Registration failed");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setUser(null);
    setToken(null);
    setAvatarState(null);
    setError(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }

  async function setAvatar(uri: string | null) {
    setAvatarState(uri);

    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const parsed = JSON.parse(raw) as {
      token: string | null;
      user: FakeStoreUser | null;
      avatar?: string | null;
    };

    const updated = {
      ...parsed,
      avatar: uri,
    };

    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  const value: AuthState = {
    user,
    token,
    avatar,
    loading,
    error,
    login,
    register,
    logout,
    setAvatar,
  };

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
