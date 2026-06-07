"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "@/utils/supabase/client";

export interface UserPreferences {
  colorPalette?: string[];
  size?: string;
  fitPreference?: string;
  occasion?: string;
  budget?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  preferences?: UserPreferences;
  address?: string;
  pincode?: string;
  orders?: Order[];
}

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  date: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updatePreferences: (preferences: UserPreferences) => Promise<void>;
  updateProfile: (payload: { name?: string; address?: string; pincode?: string }) => Promise<void>;
  addOrder: (order: Omit<Order, "id" | "date">) => Promise<void>;
}

type DbProfile = {
  id: string;
  email: string | null;
  name: string | null;
  address: string | null;
  pincode: string | null;
  color_palette: string[] | null;
  size: string | null;
  fit_preference: string | null;
  occasion: string | null;
  budget: string | null;
};

type DbOrder = {
  id: string;
  items: OrderItem[];
  total: number;
  created_at: string;
};

function mapProfileToUser(profile: DbProfile, orders: Order[]): User {
  return {
    id: profile.id,
    email: profile.email ?? "",
    name: profile.name ?? "",
    address: profile.address ?? undefined,
    pincode: profile.pincode ?? undefined,
    preferences: {
      colorPalette: profile.color_palette ?? undefined,
      size: profile.size ?? undefined,
      fitPreference: profile.fit_preference ?? undefined,
      occasion: profile.occasion ?? undefined,
      budget: profile.budget ?? undefined,
    },
    orders: orders.length > 0 ? orders : undefined,
  };
}

async function fetchProfile(supabase: ReturnType<typeof createClient>, userId: string): Promise<DbProfile | null> {
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
  return data;
}

async function fetchOrders(supabase: ReturnType<typeof createClient>, userId: string): Promise<Order[]> {
  const { data } = await supabase
    .from("orders")
    .select("id, items, total, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data ?? []).map((o: DbOrder) => ({
    id: o.id,
    items: o.items,
    total: o.total,
    date: o.created_at,
  }));
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [supabase] = useState(createClient);

  const hydrateUser = useCallback(async (authUser: SupabaseUser) => {
    if (!isSupabaseConfigured || !supabase) return;
    const [profile, orders] = await Promise.all([
      fetchProfile(supabase, authUser.id),
      fetchOrders(supabase, authUser.id),
    ]);
    if (profile) {
      setUser(mapProfileToUser(profile, orders));
    }
  }, [supabase]);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          hydrateUser(session.user).finally(() => setIsLoading(false));
        } else {
          setIsLoading(false);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          hydrateUser(session.user);
        } else {
          setUser(null);
        }
      });

      return () => subscription.unsubscribe();
    } else {
      console.warn("Supabase is not configured. Falling back to localStorage auth simulation.");
      const storedUser = localStorage.getItem("user");
      let parsedUser: User | null = null;
      if (storedUser) {
        try {
          parsedUser = JSON.parse(storedUser);
        } catch (error) {
          console.error("Failed to parse stored user", error);
        }
      }
      const userToSet = parsedUser;
      Promise.resolve().then(() => {
        setUser(userToSet);
        setIsLoading(false);
      });
    }
  }, [supabase, hydrateUser]);

  const login = async (email: string, password: string) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } else {
      if (!email || !password) {
        throw new Error("Email and password are required");
      }
      const userData: User = {
        id: Math.random().toString(36).substring(2, 11),
        email,
        name: email.split("@")[0],
        orders: [],
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name } },
      });
      if (error) throw error;
    } else {
      if (!email || !password || !name) {
        throw new Error("All fields are required");
      }
      const userData: User = {
        id: Math.random().toString(36).substring(2, 11),
        email,
        name,
        orders: [],
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } else {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  const updatePreferences = async (preferences: UserPreferences) => {
    if (!user) throw new Error("User not logged in");

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        color_palette: preferences.colorPalette ?? null,
        size: preferences.size ?? null,
        fit_preference: preferences.fitPreference ?? null,
        occasion: preferences.occasion ?? null,
        budget: preferences.budget ?? null,
      });

      if (error) throw error;
      setUser((prev) => prev ? { ...prev, preferences } : prev);
    } else {
      const updatedUser: User = { ...user, preferences };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const updateProfile = async (payload: { name?: string; address?: string; pincode?: string }) => {
    if (!user) throw new Error("User not logged in");

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        ...payload,
      });

      if (error) throw error;
      setUser((prev) => prev ? { ...prev, ...payload } : prev);
    } else {
      const updatedUser: User = { ...user, ...payload };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const addOrder = async (order: Omit<Order, "id" | "date">) => {
    if (!user) throw new Error("User not logged in");

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          items: order.items,
          total: order.total,
        })
        .select("id, created_at")
        .single();

      if (error) throw error;

      const newOrder: Order = {
        id: data.id,
        items: order.items,
        total: order.total,
        date: data.created_at,
      };

      setUser((prev) =>
        prev ? { ...prev, orders: [...(prev.orders ?? []), newOrder] } : prev
      );
    } else {
      const newOrder: Order = {
        id: Math.random().toString(36).substring(2, 11),
        items: order.items,
        total: order.total,
        date: new Date().toISOString(),
      };
      const updatedUser: User = {
        ...user,
        orders: [...(user.orders ?? []), newOrder],
      };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, signup, logout, updatePreferences, updateProfile, addOrder }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
