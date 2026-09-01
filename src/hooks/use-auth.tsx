import { useState, useEffect, createContext, useContext, type ReactNode } from "react";

interface User {
  _id: string;
  name?: string;
  email?: string;
  isAnonymous?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USER_KEY = "launchpulse_user";

function getStoredUser(): User | null {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function setStoredUser(user: User | null): void {
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = getStoredUser();
    setUser(storedUser);
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, _password: string) => {
    // Simple local auth - just store the user
    const newUser: User = {
      _id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      email,
      name: email.split("@")[0],
      isAnonymous: false,
    };
    setStoredUser(newUser);
    setUser(newUser);
  };

  const signUp = async (email: string, _password: string, name?: string) => {
    const newUser: User = {
      _id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      email,
      name: name || email.split("@")[0],
      isAnonymous: false,
    };
    setStoredUser(newUser);
    setUser(newUser);
  };

  const signInAnonymously = async () => {
    const newUser: User = {
      _id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      isAnonymous: true,
    };
    setStoredUser(newUser);
    setUser(newUser);
  };

  const signOut = async () => {
    setStoredUser(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, signIn, signUp, signInAnonymously, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
