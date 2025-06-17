/**
 * Session Management Utility
 *
 * Creates and manages browser session IDs for anonymous users.
 * Uses sessionStorage so sessions end when browser tab closes.
 */

const SESSION_KEY = "analytics_session_id";

/**
 * Generate a unique session ID
 * Format: session_timestamp_randomString
 *
 * @returns {string} Unique session identifier
 */
export const generateSessionId = (): string => {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 15);
  return `session_${timestamp}_${randomPart}`;
};

/**
 * Get current session ID from sessionStorage
 * Creates new session if none exists
 *
 * @returns {string} Current session ID
 */
export const getSessionId = (): string => {
  // Return empty string for SSR safety
  if (typeof window === "undefined") {
    return "";
  }

  // Try to get existing session ID
  let sessionId = sessionStorage.getItem(SESSION_KEY);

  // Create new session if none exists
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem(SESSION_KEY, sessionId);

    // Track session start
    console.log("New session started:", sessionId);
  }

  return sessionId;
};

/**
 * Clear current session
 * Useful for testing or manual session reset
 */
export const clearSession = (): void => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(SESSION_KEY);
  }
};

/**
 * Get session info for debugging
 */
export const getSessionInfo = () => {
  if (typeof window === "undefined") {
    return { sessionId: "", isNewSession: false };
  }

  const existingId = sessionStorage.getItem(SESSION_KEY);
  return {
    sessionId: existingId || "No active session",
    isNewSession: !existingId,
    sessionStorage: sessionStorage.length,
  };
};
