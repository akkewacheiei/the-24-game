"use client";
import { createContext, useContext, useReducer, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { API_BASE_URL } from "../config";

interface User {
  id: number;
  username: string;
}

interface AuthState {
  user: User | null;
}

interface AuthAction {
  type: "login" | "logout";
  payload?: {
    user: User;
  };
}

const AuthContext = createContext<
  | {
      authState: AuthState;
      authDispatch: React.Dispatch<AuthAction>;
      login: (user: User) => void;
      logout: () => void;
    }
  | undefined
>(undefined);

function reducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "login":
      return { user: action.payload!.user };
    case "logout":
      return { user: null };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, authDispatch] = useReducer(reducer, { user: null });
  const router = useRouter();

  const login = (user: User) => {
    authDispatch({ type: "login", payload: { user } });
    router.push("/game");
  };

  const logout = () => {
    localStorage.removeItem("token");
    authDispatch({ type: "logout" });
    router.push("/");
  };

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/");
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      authDispatch({ type: "login", payload: { user: response.data.user } });
    } catch (error) {
      console.error("Error fetching user data", error);
      router.push("/");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ authState, authDispatch, login, logout }}>
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
