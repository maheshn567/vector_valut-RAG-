import { toNodeHandler } from "better-auth/node";
import auth from "../lib/auth.js";

const betterAuthHandler = toNodeHandler(auth);

/**
 * Express Controller Wrapper for Better-Auth endpoints
 * Handles OAuth sign-ins, callbacks, sessions, and client state.
 */
export default function googleAuth(req, res) {
  return betterAuthHandler(req, res);
}