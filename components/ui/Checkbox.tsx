import React from 'react';

interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    label?: string;
    className?: string;
}

export default function Checkbox({
    checked,
    onChange,
    disabled = false,
    label,
    className = ''
}: CheckboxProps) {
    const handleChange = () => {
        if (!disabled) {
            onChange(!checked);
        }
    };

    return (
        <label className={`inline-flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
            <div className="relative">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={handleChange}
                    disabled={disabled}
                    className="sr-only"
                />
                <div
                    className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${checked
                            ? 'bg-primary border-primary'
                            : 'bg-white border-gray-300 hover:border-primary'
                        } ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={handleChange}
                >
                    {checked && (
                        <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>
            </div>
            {label && <span className="ml-2 text-sm text-text-primary">{label}</span>}
        </label>
    );
}
