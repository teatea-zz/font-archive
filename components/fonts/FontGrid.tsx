import React from 'react';
import { Font } from '@/types/font';
import FontCard from './FontCard';

interface FontGridProps {
    fonts: Font[];
    onViewDetail?: (font: Font) => void;
    onToggleFavorite?: (fontId: string) => void;
}

export default function FontGrid({ fonts, onViewDetail, onToggleFavorite }: FontGridProps) {
    if (fonts.length === 0) {
        return (
            <div className="text-center py-16">
                <svg
                    className="mx-auto h-12 w-12 text-text-secondary mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
                <h3 className="text-lg font-medium text-text-primary mb-1">
                    폰트가 없습니다
                </h3>
                <p className="text-text-secondary">
                    검색 조건을 변경하거나 새로운 폰트를 추가해보세요.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {fonts.map((font) => (
                <FontCard
                    key={font.id}
                    font={font}
                    onViewDetail={onViewDetail}
                    onToggleFavorite={onToggleFavorite}
                />
            ))}
        </div>
    );
}
