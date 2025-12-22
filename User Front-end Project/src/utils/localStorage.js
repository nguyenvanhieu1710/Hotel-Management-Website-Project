/**
 * Utility functions for localStorage management
 */

/**
 * Clean corrupted localStorage entries
 */
export const cleanLocalStorage = () => {
  try {
    // List of keys that might be corrupted
    const keysToCheck = ["user", "token", "favorites"];

    keysToCheck.forEach((key) => {
      const item = localStorage.getItem(key);

      // Check if item is corrupted (string "undefined", "null", etc.)
      if (item === "undefined" || item === "null" || item === "") {
        console.log(`Removing corrupted localStorage key: ${key}`);
        localStorage.removeItem(key);
      }

      // Try to parse JSON items
      if (item && (item.startsWith("{") || item.startsWith("["))) {
        try {
          JSON.parse(item);
        } catch (error) {
          console.log(`Removing invalid JSON in localStorage key: ${key}`);
          console.log(error);
          localStorage.removeItem(key);
        }
      }
    });

    console.log("localStorage cleanup completed");
  } catch (error) {
    console.error("Error cleaning localStorage:", error);
  }
};

/**
 * Get user data safely from localStorage
 */
export const getUserFromStorage = () => {
  try {
    const userStr = localStorage.getItem("user");

    if (!userStr || userStr === "undefined" || userStr === "null") {
      return null;
    }

    return JSON.parse(userStr);
  } catch (error) {
    console.error("Error getting user from localStorage:", error);
    localStorage.removeItem("user"); // Remove corrupted data
    return null;
  }
};

/**
 * Set user data safely to localStorage
 */
export const setUserToStorage = (user) => {
  try {
    if (user === null || user === undefined) {
      localStorage.removeItem("user");
    } else {
      localStorage.setItem("user", JSON.stringify(user));
    }
  } catch (error) {
    console.error("Error setting user to localStorage:", error);
  }
};

/**
 * Debug localStorage contents
 */
export const debugLocalStorage = () => {
  console.log("=== localStorage Debug ===");
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    console.log(`${key}:`, value);
  }
  console.log("========================");
};
