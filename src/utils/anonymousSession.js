/**
 * Anonymous Session Utility
 * 
 * Generates and manages anonymous session IDs for unauthenticated users.
 * Uses localStorage to persist the session across page reloads.
 */

/**
 * Generate a unique anonymous session ID
 */
export function generateAnonymousId() {
  // Generate a unique ID: timestamp + random string
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 15);
  return `anon_${timestamp}_${randomStr}`;
}

/**
 * Get or create anonymous session ID
 * Stores in localStorage for persistence
 */
export function getAnonymousSessionId() {
  if (typeof window === "undefined") {
    // Server-side: generate new ID (will be set on client)
    return null;
  }

  const storageKey = "burnout_anonymous_session_id";
  let sessionId = localStorage.getItem(storageKey);

  if (!sessionId) {
    sessionId = generateAnonymousId();
    localStorage.setItem(storageKey, sessionId);
  }

  return sessionId;
}

/**
 * Clear anonymous session ID
 * Used after successful account creation and data linking
 */
export function clearAnonymousSession() {
  if (typeof window === "undefined") return;
  
  const storageKey = "burnout_anonymous_session_id";
  localStorage.removeItem(storageKey);
}

/**
 * Check if user has an anonymous session
 */
export function hasAnonymousSession() {
  if (typeof window === "undefined") return false;
  
  const storageKey = "burnout_anonymous_session_id";
  return !!localStorage.getItem(storageKey);
}


