'use client';

import React from 'react';
import { Font } from '@/types/font';
import Badge from '../ui/Badge';
import Checkbox from '../ui/Checkbox';
import Image from 'next/image';
import { useCompareStore } from '@/store/compareStore';

interface FontCardProps {
    font: Font;
    onViewDetail?: (font: Font) => void;
    onToggleFavorite?: (fontId: string) => void;
}

export default function FontCard({ font, onViewDetail, onToggleFavorite }: FontCardProps) {
    // 카테고리 표시 이름 변환
    const getCategoryLabel = (category: string) => {
        const labels: Record<string, string> = {
            'gothic': '고딕',
            'myeongjo': '명조',
            'display': '디스플레이',
            'handwriting': '손글씨',
            'dingbat': '딩벳',
            'other': '기타'
        };
        return labels[category] || category;
    };

    // 라이선스 표시 이름 변환
    const getLicenseLabel = (license: string) => {
        const labels: Record<string, string> = {
            'ofl': 'OFL',
            'free': '무료',
            'commercial': '상업용',
            'personal': '개인용',
            'apache': 'Apache',
            'unknown': '미확인'
        };
        return labels[license] || license;
    };

    // 비교하기 스토어
    const { selectedFonts, toggleFont, isSelected } = useCompareStore();
    const isFontSelected = isSelected(font.id);
    const selectedCount = selectedFonts.length;

    const handleCheckboxClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation(); // 더 강력한 전파 방지

        // 3개 이상이고 선택되지 않은 상태라면 동작 안 함 (disabled 상태지만 안전장치)
        if (!isFontSelected && selectedCount >= 3) return;
        toggleFont(font);
    };

    return (
        <div
            onClick={() => onViewDetail?.(font)}
            className={`bg-white rounded-lg border transition-all duration-200 group cursor-pointer relative overflow-hidden ${isFontSelected
                ? 'border-primary ring-1 ring-primary shadow-200 scale-[1.01] z-10'
                : 'border-border shadow-100 hover:shadow-200 hover:scale-[1.01]'
                }`}
        >
            {/* 비교 체크박스 (우측 상단) */}
            <div
                className="absolute top-2 right-2 z-10 w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-black/5 rounded-full transition-colors"
                onClick={handleCheckboxClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        // 3개 이상이고 선택되지 않은 상태라면 동작 안 함
                        if (!isFontSelected && selectedCount >= 3) return;
                        toggleFont(font);
                    }
                }}
            >
                <Checkbox
                    checked={isFontSelected}
                    onChange={() => { }} // 부모 div onClick에서 처리
                    disabled={!isFontSelected && selectedCount >= 3}
                    className="pointer-events-none" // Checkbox 내부 클릭 이벤트 무시하고 부모 div에서 처리
                />
            </div>

            {/* 썸네일 이미지 */}
            <div className="relative w-full aspect-[16/9] bg-background-secondary border-b border-border">
                {font.thumbnailUrl ? (
                    <Image
                        src={font.thumbnailUrl}
                        alt={font.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-secondary">
                        <svg className="w-12 h-12" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
            </div>

            {/* 카드 내용 */}
            <div className="p-6">
                {/* 폰트명 + 즐겨찾기 */}
                <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-text-primary truncate flex-1">
                        {font.name}
                    </h3>
                    {/* 즐겨찾기 버튼 */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation(); // 카드 클릭 이벤트 방지
                            onToggleFavorite?.(font.id);
                        }}
                        className="text-text-secondary hover:text-accent transition-smooth flex-shrink-0"
                        aria-label="즐겨찾기"
                    >
                        <svg
                            className="w-5 h-5"
                            fill={font.isFavorite ? 'currentColor' : 'none'}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                    </button>
                </div>

                {/* 디자이너 */}
                <p className="text-sm text-text-secondary mb-2 truncate">
                    {font.designer}
                </p>

                {/* 카테고리 & 라이선스 뱃지 */}
                <div className="flex gap-2 mb-2 flex-wrap">
                    <Badge label={getCategoryLabel(font.category)} variant="category" />
                    <Badge label={getLicenseLabel(font.license)} variant="license" />
                </div>

                {/* 태그 */}
                {font.tags && font.tags.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                        {font.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} label={`#${tag}`} variant="tag" />
                        ))}
                        {font.tags.length > 3 && (
                            <span className="text-xs text-text-secondary">
                                +{font.tags.length - 3}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
