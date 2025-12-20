export const validationRules = {
  required: (value, fieldName = "Field") => {
    if (!value || value.toString().trim() === "") {
      return `${fieldName} is required`;
    }
    return null;
  },

  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }
    return null;
  },

  password: (value) => {
    if (!value) return null;
    if (value.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return null;
  },

  confirmPassword: (value, originalPassword) => {
    if (!value) return null;
    if (value !== originalPassword) {
      return "Passwords do not match";
    }
    return null;
  },

  phone: (value) => {
    if (!value) return null;
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(value.replace(/\s/g, ""))) {
      return "Please enter a valid phone number (10-11 digits)";
    }
    return null;
  },

  minLength: (value, minLength, fieldName = "Field") => {
    if (!value) return null;
    if (value.length < minLength) {
      return `${fieldName} must be at least ${minLength} characters long`;
    }
    return null;
  },

  maxLength: (value, maxLength, fieldName = "Field") => {
    if (!value) return null;
    if (value.length > maxLength) {
      return `${fieldName} must not exceed ${maxLength} characters`;
    }
    return null;
  },

  number: (value, fieldName = "Field") => {
    if (!value) return null;
    if (isNaN(value)) {
      return `${fieldName} must be a valid number`;
    }
    return null;
  },

  positiveNumber: (value, fieldName = "Field") => {
    if (!value) return null;
    if (isNaN(value) || parseFloat(value) <= 0) {
      return `${fieldName} must be a positive number`;
    }
    return null;
  },

  date: (value, fieldName = "Field") => {
    if (!value) return null;
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return `${fieldName} must be a valid date`;
    }
    return null;
  },

  futureDate: (value, fieldName = "Field") => {
    if (!value) return null;
    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      return `${fieldName} must be a future date`;
    }
    return null;
  },

  dateRange: (startDate, endDate) => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      return "End date must be after start date";
    }
    return null;
  },
};

export const validateForm = (formData, rules) => {
  const errors = {};
  let isValid = true;

  Object.keys(rules).forEach((fieldName) => {
    const fieldRules = rules[fieldName];
    const fieldValue = formData[fieldName];

    for (const rule of fieldRules) {
      let error = null;

      if (typeof rule === "function") {
        error = rule(fieldValue);
      } else if (typeof rule === "object") {
        const { validator, params = [] } = rule;
        error = validator(fieldValue, ...params);
      }

      if (error) {
        errors[fieldName] = error;
        isValid = false;
        break; // Stop at first error for this field
      }
    }
  });

  return { isValid, errors };
};

export const validateField = (value, rules) => {
  for (const rule of rules) {
    let error = null;

    if (typeof rule === "function") {
      error = rule(value);
    } else if (typeof rule === "object") {
      const { validator, params = [] } = rule;
      error = validator(value, ...params);
    }

    if (error) {
      return error;
    }
  }

  return null;
};
