import { REGEX } from "../constants/index.js";

/**
 * Validation Utilities
 */
export const ValidationUtils = {
  /**
   * Validate email format
   */
  isValidEmail: (email) => {
    return REGEX.EMAIL.test(email);
  },

  /**
   * Validate phone number
   */
  isValidPhone: (phone) => {
    return REGEX.PHONE.test(phone);
  },

  /**
   * Validate password strength
   */
  isValidPassword: (password) => {
    return REGEX.PASSWORD.test(password);
  },

  /**
   * Validate identification number
   */
  isValidIdentification: (id) => {
    return REGEX.IDENTIFICATION.test(id);
  },

  /**
   * Sanitize string input
   */
  sanitizeString: (str) => {
    if (typeof str !== "string") return str;
    return str.trim().replace(/[<>]/g, "");
  },

  /**
   * Validate date is not in future
   */
  isValidBirthDate: (date) => {
    const birthDate = new Date(date);
    const today = new Date();
    return birthDate < today;
  },

  /**
   * Validate age is above minimum
   */
  isValidAge: (date, minAge = 18) => {
    const birthDate = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      return age - 1 >= minAge;
    }

    return age >= minAge;
  },
};

export default ValidationUtils;
