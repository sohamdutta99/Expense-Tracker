// Expense categories with emoji icons
export const EXPENSE_CATEGORIES = [
  { label: "Food & Dining", icon: "🍔" },
  { label: "Transportation", icon: "🚗" },
  { label: "Shopping", icon: "🛍️" },
  { label: "Housing & Rent", icon: "🏠" },
  { label: "Entertainment", icon: "🎬" },
  { label: "Healthcare", icon: "💊" },
  { label: "Education", icon: "📚" },
  { label: "Utilities", icon: "💡" },
  { label: "Travel", icon: "✈️" },
  { label: "Groceries", icon: "🛒" },
  { label: "Fitness", icon: "💪" },
  { label: "Personal Care", icon: "💈" },
  { label: "Subscriptions", icon: "📱" },
  { label: "Gifts", icon: "🎁" },
  { label: "Other", icon: "💸" },
];

// Income sources with emoji icons
export const INCOME_SOURCES = [
  { label: "Salary", icon: "💼" },
  { label: "Freelance", icon: "💻" },
  { label: "Investments", icon: "📈" },
  { label: "Business", icon: "🏢" },
  { label: "Rental Income", icon: "🏘️" },
  { label: "Dividends", icon: "💹" },
  { label: "Part-time Job", icon: "⏰" },
  { label: "Bonus", icon: "🎯" },
  { label: "Gift / Received", icon: "🎁" },
  { label: "Selling", icon: "🏷️" },
  { label: "Other", icon: "💰" },
];

// Currency formatter
export const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

// Date formatter
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};
