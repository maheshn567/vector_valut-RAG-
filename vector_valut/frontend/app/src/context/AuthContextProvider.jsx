import { createContext, useContext, useState, useEffect } from "react";
import { loginTenant, getTenant } from "../apis/tenant.api";
import { signInWithGoogle } from "../apis/google-auth.api";
import { toast } from "sonner";

export const AuthContext = createContext(null);

export function AuthContextProvider({ children }) {
  const [tenant, setTenant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Clear local session storage
  const clearSession = () => {
    localStorage.removeItem("tenantId");
    localStorage.removeItem("tenantName");
    localStorage.removeItem("tenantEmail");
    setTenant(null);
  };

  // Re-verify the current session with backend on app boot
  const checkAuth = async () => {
    try {
      const response = await getTenant();
      
      // Unbox the tenant profile object if backend returns success
      if (response && response.success && response.data) {
        const tenantData = response.data;
        localStorage.setItem("tenantId", tenantData.tenantId);
        localStorage.setItem("tenantName", tenantData.name);
        localStorage.setItem("tenantEmail", tenantData.email);
        setTenant(tenantData);
      } else {
        clearSession();
      }
    } catch (error) {
      console.error("Authentication session check failed:", error);
      // Clear session only on explicit authentication failure response codes
      if (error.status === 401 || error.status === 403) {
        clearSession();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Login via email/password credentials
  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const response = await loginTenant(credentials);
      
      if (response.success && response.data) {
        localStorage.setItem("tenantId", response.data.tenantId);
        localStorage.setItem("tenantName", response.data.name);
        localStorage.setItem("tenantEmail", response.data.email);
        setTenant(response.data);
        toast.success("Successfully logged in!");
        return response.data;
      } else {
        throw new Error(response.message || "Invalid email or password");
      }
    } catch (error) {
      toast.error(error.message || "Authentication failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Sign out
  const logout = () => {
    clearSession();
    toast.success("Logged out successfully");
  };

  // Redirect to Google OAuth consent page
  const googleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      toast.error("Failed to start Google sign-in flow.");
    }
  };

  return (
    <AuthContext.Provider value={{ tenant, isLoading, login, logout, googleLogin, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

