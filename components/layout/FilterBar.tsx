'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SortBy } from '@/types/font';
import { categoryOptions, sortOptions } from '@/lib/mockData';

interface FilterBarProps {
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
    sortBy: SortBy;
    onSortChange: (sortBy: SortBy) => void;
}

export default function FilterBar({
    selectedCategory,
    onCategoryChange,
    sortBy,
    onSortChange,
}: FilterBarProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const currentSortLabel = sortOptions.find((o) => o.value === sortBy)?.label ?? '';

    return (
        <div className="bg-white border-b border-border">
            <div className="max-w-7xl mx-auto px-6 py-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                    {/* ─── 카테고리 버튼 ─────────────────────────────────────────────────
                        Enabled : bg #F5F5F5, no border, text #121212
                        Hover   : bg #F5F5F5, border 1px #D6D6D6, text #1E1E1E
                        Active  : bg #FF5429,  no border, text white
                        Focus   : bg #FF5429,  border 3px rgba(255,84,41,0.2): ring으로 구현
                    ─────────────────────────────────────────────────────────────────── */}
                    <div className="flex flex-wrap gap-2">
                        {categoryOptions.map((option) => {
                            const isActive = selectedCategory === option.value;
                            return (
                                <button
                                    key={option.value}
                                    onClick={() => onCategoryChange(option.value)}
                                    className={`
                                        px-3 h-9 rounded-xl text-sm font-medium transition-all duration-150 min-w-[60px]
                                        focus-visible:outline-none focus-visible:bg-[#FF5429] focus-visible:text-white focus-visible:border-0 focus-visible:shadow-[0_0_0_3px_rgba(255,84,41,0.2)]
                                        ${isActive
                                            ? 'bg-[#FF5429] text-white border-0'
                                            : 'bg-[#F5F5F5] text-[#121212] border border-transparent hover:border-[#D6D6D6]'
                                        }
                                    `}
                                >
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* ─── 정렬 커스텀 드롭다운 ─────────────────────────────────────────
                        Closed (align)  : bg #F5F5F5, border transparent, hover→ border #D6D6D6
                        Open  (top)     : bg #FFFFFF, border 1px #D6D6D6, radius 12 12 0 0
                        Item  (Default) : bg #FFFFFF, border-l/r/b #D6D6D6
                        Item  (Hover)   : bg #FAF7F5
                        Item  (bottom)  : radius 0 0 12 12
                    ─────────────────────────────────────────────────────────────────── */}
                    <div className="relative shrink-0 self-start sm:self-auto" ref={dropdownRef}>
                        <button
                            onClick={() => setIsDropdownOpen((prev) => !prev)}
                            className={`
                                flex items-center gap-2 px-3 whitespace-nowrap
                                h-9 text-sm text-[#121212]
                                transition-all duration-150
                                ${isDropdownOpen
                                    ? 'bg-white border border-[#D6D6D6] rounded-t-xl rounded-b-none'
                                    : 'bg-[#F5F5F5] rounded-xl border border-transparent hover:border-[#D6D6D6]'
                                }
                            `}
                        >
                            <span>{currentSortLabel}</span>
                            {isDropdownOpen ? (
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                                    <path d="M12 10L8 6L4 10" stroke="#1E1E1E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : (
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                                    <path d="M12 6L8 10L4 6" stroke="#1E1E1E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 top-full z-50 w-full flex flex-col">
                                {sortOptions.map((option, index) => {
                                    const isSelected = sortBy === option.value;
                                    const isLast = index === sortOptions.length - 1;

                                    return (
                                        <button
                                            key={option.value}
                                            onClick={() => {
                                                onSortChange(option.value as SortBy);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`
                                                flex items-center justify-between px-3 h-9 text-sm text-[#121212] whitespace-nowrap
                                                transition-colors duration-100
                                                bg-white border-l border-r border-b border-[#D6D6D6]
                                                hover:bg-[#FAF7F5]
                                                ${isLast ? 'rounded-b-xl' : ''}
                                            `}
                                        >
                                            <span>{option.label}</span>
                                            {isSelected && (
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 ml-2">
                                                    <path d="M13.2698 3.35258C13.6273 3.61258 13.7073 4.11258 13.4473 4.47008L7.04727 13.2701C6.90977 13.4601 6.69727 13.5776 6.46227 13.5976C6.22727 13.6176 5.99977 13.5301 5.83477 13.3651L2.63477 10.1651C2.32227 9.85257 2.32227 9.34508 2.63477 9.03258C2.94727 8.72008 3.45477 8.72008 3.76727 9.03258L6.30477 11.5701L12.1548 3.52758C12.4148 3.17008 12.9148 3.09008 13.2723 3.35008L13.2698 3.35258Z" fill="#121212" />
                                                </svg>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
}
