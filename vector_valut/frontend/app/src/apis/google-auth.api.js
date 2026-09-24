import api from "./axios";

/**
 * Initiates the Google OAuth sign-in flow by fetching the redirect URL 
 * from the backend and redirecting the browser window.
 * 
 * @param {string} callbackURL - Absolute URL the user will land on after success.
 */
export const signInWithGoogle = async (callbackURL = `${window.location.origin}/dashboard`) => {
  try {
    const response = await api.post("/auth/sign-in/social", {
      provider: "google",
      callbackURL,
    });

    if (response && response.url) {
      // Redirect browser to Google login screen
      window.location.href = response.url;
    } else {
      throw new Error("No redirect URL returned from auth server.");
    }
  } catch (error) {
    console.error("Failed to initiate Google OAuth:", error);
    throw error;
  }
};

const googleAuthApi = {
  signInWithGoogle,
};

export default googleAuthApi;