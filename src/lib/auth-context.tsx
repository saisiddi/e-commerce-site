"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

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
  logout: () => void;
  updatePreferences: (preferences: UserPreferences) => Promise<void>;
  updateProfile: (payload: { name?: string; address?: string; pincode?: string }) => Promise<void>;
  addOrder: (order: Order) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user", error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate login - in real app, call backend API
    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    // Simulate user data
    const userData: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name: email.split("@")[0],
      orders: [],
    };

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const signup = async (email: string, password: string, name: string) => {
    // Simulate signup - in real app, call backend API
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }

    const userData: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      orders: [],
    };

    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const updatePreferences = async (preferences: UserPreferences) => {
    if (!user) {
      throw new Error("User not logged in");
    }

    const updatedUser: User = {
      ...user,
      preferences,
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const updateProfile = async (payload: { name?: string; address?: string; pincode?: string }) => {
    if (!user) throw new Error("User not logged in");
    const updatedUser: User = {
      ...user,
      ...payload,
    };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const addOrder = (order: Order) => {
    if (!user) return;
    const updated: User = { ...(user as User), orders: [...(user.orders ?? []), order] };
    setUser(updated);
    localStorage.setItem("user", JSON.stringify(updated));
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
