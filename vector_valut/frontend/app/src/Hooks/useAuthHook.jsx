import { useContext } from "react";
import { AuthContext } from "../context/AuthContextProvider";

// Hook wrapper for easy context access
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
}