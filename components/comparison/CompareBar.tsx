'use client';

import React from 'react';
import { useCompareStore } from '@/store/compareStore';
import Button from '../ui/Button';

interface CompareBarProps {
    onOpenOverlay: () => void;
}

export default function CompareBar({ onOpenOverlay }: CompareBarProps) {
    const { selectedFonts, removeFont } = useCompareStore();
    const count = selectedFonts.length;

    if (count === 0) return null;

    return (
        <div className={`fixed bottom-0 left-0 right-0 z-[100] transition-transform duration-300 ease-in-out transform ${count > 0 ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 pt-2 flex justify-center">
                <div className="bg-white rounded-xl shadow-lg border border-border p-4 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto min-w-[300px] animate-slide-up">

                    {/* 선택된 폰트칩 */}
                    <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-hide">
                        {selectedFonts.map((font) => (
                            <div
                                key={font.id}
                                className="flex items-center gap-2 bg-background-secondary px-3 py-1.5 rounded-full border border-border whitespace-nowrap"
                            >
                                <span className="text-sm font-medium text-text-primary">
                                    {font.name}
                                </span>
                                <button
                                    onClick={() => removeFont(font.id)}
                                    className="text-text-secondary hover:text-red-500 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* 구분선 (PC) */}
                    <div className="hidden sm:block w-px h-8 bg-border"></div>

                    {/* 비교하기 버튼 */}
                    <Button
                        onClick={onOpenOverlay}
                        disabled={count < 2}
                        className="w-full sm:w-auto whitespace-nowrap"
                    >
                        비교하기 ({count})
                    </Button>
                </div>
            </div>
        </div>
    );
}
