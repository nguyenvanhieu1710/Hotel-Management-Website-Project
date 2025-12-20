export const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("vi-VN");
};

export const formatDateTime = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleString("vi-VN");
};

export const formatCurrency = (amount) => {
  if (!amount) return "0 VND";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const formatTime = (time) => {
  if (!time) return "";
  return new Date(`2000-01-01T${time}`).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

export const validatePhone = (phone) => {
  const re = /^[0-9]{10,11}$/;
  return re.test(phone.replace(/\s/g, ""));
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const truncateText = (text, maxLength) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const capitalizeFirst = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const isDateInPast = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  today.setHours(0, 0, 0, 0);
  checkDate.setHours(0, 0, 0, 0);
  return checkDate < today;
};

export const isDateInFuture = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  today.setHours(23, 59, 59, 999);
  return checkDate > today;
};

export const calculateDaysBetween = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const getStatusColor = (status) => {
  const statusColors = {
    Active: "success",
    Inactive: "secondary",
    Pending: "warning",
    Confirmed: "info",
    Completed: "success",
    Cancelled: "danger",
    Available: "success",
    Occupied: "danger",
    Maintenance: "warning",
    Reserved: "info",
  };
  return statusColors[status] || "secondary";
};

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy text: ", err);
    return false;
  }
};
