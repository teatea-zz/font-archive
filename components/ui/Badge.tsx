import React from 'react';

interface BadgeProps {
    label: string;
    variant?: 'category' | 'license' | 'tag';
    className?: string;
}

export default function Badge({ label, variant = 'category', className = '' }: BadgeProps) {
    const variantStyles = {
        // 카테고리: 웜 화이트 배경, 오렌지 border, 오렌지 텍스트
        category: 'bg-[#FFF8F7] text-[#FF5429] border border-[#FF6240] font-semibold',
        // 라이선스: #1E1E1E 배경, 화이트 텍스트, border 없음
        license: 'bg-[#1E1E1E] text-white border-0 font-semibold',
        // 태그: 화이트 배경, 연한 border, 회색 텍스트 — Pretendard 500(medium)
        tag: 'bg-white text-gray-500 border border-[#EDEDED] font-medium',
    };

    return (
        <span
            className={`inline-flex items-center justify-center px-1.5 h-[20px] rounded-md text-xs ${variantStyles[variant]} ${className}`}
        >
            {label}
        </span>
    );
}
