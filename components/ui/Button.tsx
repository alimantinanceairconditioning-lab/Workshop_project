"use client";
import React, { useState } from "react";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  icon?: React.ReactNode;
  hoverIcon?: React.ReactNode;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  type = "button",
  onClick,
  icon,
  hoverIcon,
  disabled = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center hover:cursor-pointer justify-center gap-2 text-sm md:text-base lg:text-lg rounded-lg md:rounded-xl font-semibold transition duration-300
        ${disabled 
          ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-60' 
          : 'bg-accentYellow text-primaryBlue hover:bg-primaryBlue hover:text-accentYellow hover:outline-2 hover:outline-accentYellow active:scale-95'
        } ${className? className : "px-6 py-3 md:px-10 md:py-4"}`}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => !disabled && setIsHovered(false)}
    >
      {(icon || hoverIcon) && (<span className="w-4 h-4 md:w-5 md:h-5 flex items-center justify-center">
        {isHovered && hoverIcon ? hoverIcon : icon}
      </span>)}
      <span>{children}</span>
    </button>
  );
};

export default Button;
