import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

/**
 * Input
 * Reusable form input with optional password toggle.
 * Styled via the .input-box CSS class (dark mode aware).
 */
const Input = ({ value, onChange, placeholder, label, type }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label
        className="block text-xs font-medium mb-1"
        style={{ color: "var(--color-text-muted)" }}
      >
        {label}
      </label>

      <div className="input-box">
        <input
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none"
          style={{ color: "var(--color-text)" }}
          value={value}
          onChange={(e) => onChange(e)}
        />

        {type === "password" && (
          showPassword ? (
            <FaRegEye
              size={18}
              className="cursor-pointer flex-shrink-0"
              style={{ color: "var(--color-primary-light)" }}
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <FaRegEyeSlash
              size={18}
              className="cursor-pointer flex-shrink-0"
              style={{ color: "var(--color-text-muted)" }}
              onClick={() => setShowPassword(true)}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Input;
