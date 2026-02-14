import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'icon';
    children: React.ReactNode;
}

export default function Button({
    variant = 'primary',
    children,
    className = '',
    ...props
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center rounded font-bold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed h-[32px] text-sm';

    const variantStyles = {
        primary: 'bg-primary text-white hover:bg-primary-hover active:bg-primary-down px-[14px]',
        secondary: 'bg-gray-100 text-text-primary hover:bg-gray-200 active:bg-gray-300 px-[14px]',
        ghost: 'text-text-primary hover:bg-gray-100 active:bg-gray-200 px-[14px]',
        icon: 'text-text-secondary hover:text-text-primary hover:bg-gray-100 p-1.5 rounded-sm h-8 w-8',
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
