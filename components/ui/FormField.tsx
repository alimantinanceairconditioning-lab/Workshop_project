import React from "react";

type FormFieldProps = {
  label: string;
  name: string;
  type?: string;
  value: string;
  placeholder?: string;
  rows?: number; // for textarea
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  isTextArea?: boolean;
  error?: string;
  disabled?: boolean;
};

export default function FormField({
  label,
  name,
  type = "text",
  value,
  placeholder,
  rows,
  onChange,
  isTextArea = false,
  error,
  disabled = false,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm sm:text-base md:text-lg font-normal text-primaryBlue">
        {label}
      </label>
      {isTextArea ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows || 4}
          disabled={disabled}
          className={`px-3 py-2 md:px-4 md:py-3 text-sm md:text-sm border rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all resize-none ${
            error 
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`px-3 py-2 md:px-4 md:py-3 text-sm md:text-sm border rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
            error 
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'
          } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
        />
      )}
      {error && (
        <p className="text-xs md:text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
