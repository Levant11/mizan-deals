import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type UserRole = "user" | "admin";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  role: UserRole;
  signOut: () => Promise<void>;
  refreshRole: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole>("user");

  const fetchRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", userId)
        .maybeSingle();

      if (error) {
        console.warn("Could not fetch user role:", error.message);
        setRole("user");
        return;
      }

      setRole(data?.role === "admin" ? "admin" : "user");
    } catch (error) {
      console.warn("Role fetch failed:", error);
      setRole("user");
    }
  };

  const refreshRole = async () => {
    if (user?.id) {
      await fetchRole(user.id);
    }
  };

  useEffect(() => {
    let active = true;

    const initAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();

        if (!active) return;

        setSession(data.session);
        setUser(data.session?.user ?? null);

        if (data.session?.user?.id) {
          await fetchRole(data.session.user.id);
        }
      } catch (error) {
        console.warn("Auth init failed:", error);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (nextSession?.user?.id) {
        await fetchRole(nextSession.user.id);
      } else {
        setRole("user");
      }

      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRole("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        role,
        signOut,
        refreshRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
