import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: React.ReactNode;
    onClear?: () => void;
    inputHeight?: string;
}

export default function Input({
    icon,
    onClear,
    inputHeight = 'h-10',
    className = '',
    value,
    ...props
}: InputProps) {
    return (
        <div className="relative w-full">
            {icon && (
                <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                    {icon}
                </div>
            )}
            <input
                className={`
                    w-full ${inputHeight} rounded-lg bg-white
                    text-sm text-text-primary placeholder:text-[#6E6E6E]
                    px-3 py-3
                    outline-none
                    border border-[#D6D6D6]
                    hover:border-[#6E6E6E]
                    focus:border-[#FF5429] focus:shadow-[0_0_0_3px_#F9DAD3]
                    transition-[border-color,box-shadow] duration-150
                    ${icon ? 'pl-[30px]' : ''}
                    ${onClear && value ? 'pr-9' : ''}
                    ${className}
                `}
                value={value}
                {...props}
            />
            {onClear && value && (
                <button
                    type="button"
                    onClick={onClear}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-text-primary transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}
