import React from 'react';

interface BadgeProps {
    label: string;
    variant?: 'category' | 'license' | 'tag';
    className?: string;
}

export default function Badge({ label, variant = 'category', className = '' }: BadgeProps) {
    const variantStyles = {
        category: 'bg-primary/10 text-primary border-primary/20',
        license: 'bg-green-50 text-green-700 border-green-200',
        tag: 'bg-background-secondary text-text-secondary border-border',
    };

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${variantStyles[variant]} ${className}`}
        >
            {label}
        </span>
    );
}
