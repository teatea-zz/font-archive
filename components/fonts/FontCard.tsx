'use client';

import React from 'react';
import { Font } from '@/types/font';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Image from 'next/image';

interface FontCardProps {
    font: Font;
}

export default function FontCard({ font }: FontCardProps) {
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

    return (
        <div className="bg-white rounded-lg border border-border overflow-hidden transition-smooth hover:shadow-md hover:scale-[1.02] group">
            {/* 썸네일 이미지 */}
            <div className="relative w-full aspect-[16/9] bg-background-secondary overflow-hidden">
                {font.thumbnailUrl ? (
                    <Image
                        src={font.thumbnailUrl}
                        alt={font.name}
                        fill
                        className="object-cover"
                        unoptimized // placeholder 이미지라서 최적화 비활성화
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
            <div className="p-4">
                {/* 폰트명 */}
                <h3 className="text-lg font-bold text-text-primary mb-1 truncate">
                    {font.name}
                </h3>

                {/* 디자이너 */}
                <p className="text-sm text-text-secondary mb-3 truncate">
                    {font.designer}
                </p>

                {/* 카테고리 & 라이선스 뱃지 */}
                <div className="flex gap-2 mb-3 flex-wrap">
                    <Badge label={getCategoryLabel(font.category)} variant="category" />
                    <Badge label={getLicenseLabel(font.license)} variant="license" />
                </div>

                {/* 태그 */}
                {font.tags && font.tags.length > 0 && (
                    <div className="flex gap-1.5 mb-4 flex-wrap">
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

                {/* 액션 버튼 */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                    {/* 즐겨찾기 버튼 */}
                    <button
                        className="text-text-secondary hover:text-accent transition-smooth"
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

                    {/* 상세보기 버튼 */}
                    <Button variant="ghost" className="text-sm">
                        상세보기 →
                    </Button>
                </div>
            </div>
        </div>
    );
}
