'use client';

import React from 'react';
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
    return (
        <div className="bg-white border-b border-border">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* 카테고리 필터 */}
                    <div className="flex flex-wrap gap-2">
                        {categoryOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => onCategoryChange(option.value)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${selectedCategory === option.value
                                    ? 'bg-primary text-white'
                                    : 'bg-background-secondary text-text-primary hover:bg-border'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>

                    {/* 정렬 드롭다운 */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-text-secondary">정렬:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => onSortChange(e.target.value as SortBy)}
                            className="px-4 py-2 rounded-lg border border-border bg-white text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth cursor-pointer"
                        >
                            {sortOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
