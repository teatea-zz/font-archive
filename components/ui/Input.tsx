import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
    onClear?: () => void;
}

export default function Input({
    icon,
    onClear,
    className = '',
    value,
    ...props
}: InputProps) {
    return (
        <div className="relative">
            {icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                    {icon}
                </div>
            )}
            <input
                className={`w-full rounded-lg border border-border bg-white px-4 py-2 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth ${icon ? 'pl-10' : ''} ${onClear && value ? 'pr-10' : ''} ${className}`}
                value={value}
                {...props}
            />
            {onClear && value && (
                <button
                    type="button"
                    onClick={onClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-smooth"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}
