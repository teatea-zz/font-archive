'use client';

import React from 'react';
import { categoryOptions } from '@/lib/mockData';

interface FilterBarProps {
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
}

export default function FilterBar({
    selectedCategory,
    onCategoryChange,
}: FilterBarProps) {
    return (
        <div className="bg-white border-0 border-transparent">
            <div className="max-w-7xl mx-auto py-[6px]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                    {/* ─── 카테고리 버튼 ─────────────────────────────────────────────────
                        Enabled : bg #F5F5F5, no border, text #121212
                        Hover   : bg #F5F5F5, border 1px #D6D6D6, text #1E1E1E
                        Active  : bg #FF5429,  no border, text white
                        Focus   : bg #FF5429,  border 3px rgba(255,84,41,0.2): ring으로 구현
                    ─────────────────────────────────────────────────────────────────── */}
                    <div className="flex flex-nowrap sm:flex-wrap gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden px-4 sm:px-6">
                        {categoryOptions.map((option) => {
                            const isActive = selectedCategory === option.value;
                            return (
                                <button
                                    key={option.value}
                                    onClick={() => onCategoryChange(option.value)}
                                    className={`
                                        px-3 h-9 rounded-xl text-sm font-medium transition-all duration-150 whitespace-nowrap
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
                </div>
            </div>
        </div>
    );
}
