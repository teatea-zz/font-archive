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

export default function FontCard({ font, onViewDetail, onToggleFavorite }: FontCardProps) {
    // 다운로드 링크 우선순위: 공식 URL > 다운로드 URL
    const downloadUrl = (font.officialUrl && font.officialUrl !== '')
        ? font.officialUrl
        : (font.downloadUrl && font.downloadUrl !== '')
            ? font.downloadUrl
            : null;

    // 비교하기 스토어
    const { selectedFonts, toggleFont, isSelected } = useCompareStore();
    const isFontSelected = isSelected(font.id);
    const selectedCount = selectedFonts.length;

    const handleCheckboxClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();
        if (!isFontSelected && selectedCount >= 3) return;
        toggleFont(font);
    };

    return (
        <div
            onClick={() => onViewDetail?.(font)}
            className={`
                bg-white rounded-md border transition-all duration-200 group cursor-pointer relative overflow-hidden
                flex flex-col
                ${isFontSelected
                    ? 'border-primary ring-1 ring-primary shadow-200 scale-[1.01] z-10'
                    : 'border-border hover:shadow-200 hover:scale-[1.01]'
                }
            `}
        >
            {/* 비교 체크박스 (우측 상단, z-10) */}
            <div
                className="absolute top-2 right-2 z-10 w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-black/5 rounded-full transition-colors"
                onClick={handleCheckboxClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!isFontSelected && selectedCount >= 3) return;
                        toggleFont(font);
                    }
                }}
            >
                <Checkbox
                    checked={isFontSelected}
                    onChange={() => { }}
                    disabled={!isFontSelected && selectedCount >= 3}
                    className="pointer-events-none"
                />
            </div>

            {/* 썸네일 이미지 (180px 고정) */}
            <div className="relative w-full bg-gray-100 shrink-0" style={{ height: '180px' }}>
                {font.thumbnailUrl ? (
                    <Image
                        src={font.thumbnailUrl}
                        alt={font.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        {/* noPage.svg — 공식 아이콘 */}
                        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 32L17.172 22.828C17.9221 22.0781 18.9393 21.6569 20 21.6569C21.0607 21.6569 22.0779 22.0781 22.828 22.828L32 32M28 28L31.172 24.828C31.9221 24.0781 32.9393 23.6569 34 23.6569C35.0607 23.6569 36.0779 24.0781 36.828 24.828L40 28M28 16H28.02M12 40H36C37.0609 40 38.0783 39.5786 38.8284 38.8284C39.5786 38.0783 40 37.0609 40 36V12C40 10.9391 39.5786 9.92172 38.8284 9.17157C38.0783 8.42143 37.0609 8 36 8H12C10.9391 8 9.92172 8.42143 9.17157 9.17157C8.42143 9.92172 8 10.9391 8 12V36C8 37.0609 8.42143 38.0783 9.17157 38.8284C9.92172 39.5786 10.9391 40 12 40Z" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                )}
            </div>

            {/* 카드 내용 — flex-col + flex-1로 Download Link 버튼을 항상 하단에 고정 */}
            <div className="flex flex-col flex-1 gap-3 p-[14px_16px_16px]">

                {/* 뱃지 행: license(검정) + category(오렌지 border) + 북마크 */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 flex-1 min-w-0">
                        {/* License — bg #1E1E1E, text white, border 없음 */}
                        <Badge label={getLicenseLabel(font.license)} variant="license" />
                        {/* Category — bg warm-white, border orange, text orange */}
                        <Badge label={getCategoryLabel(font.category)} variant="category" />
                    </div>
                    {/* 북마크 (즐겨찾기) */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite?.(font.id);
                        }}
                        className="shrink-0 w-7 h-7 flex items-center justify-center transition-opacity hover:opacity-70"
                        aria-label="즐겨찾기"
                    >
                        {font.isFavorite ? (
                            <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                                <path d="M9.53125 4.72188L10 5.36875L10.4688 4.72188C11.25 3.64063 12.5062 3 13.8406 3C16.1375 3 18 4.8625 18 7.15938V7.24062C18 10.7469 13.6281 14.8188 11.3469 16.5594C10.9594 16.8531 10.4844 17 10 17C9.51562 17 9.0375 16.8563 8.65312 16.5594C6.37187 14.8188 2 10.7469 2 7.24062V7.15938C2 4.8625 3.8625 3 6.15938 3C7.49375 3 8.75 3.64063 9.53125 4.72188Z" fill="#FF5429" />
                            </svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                                <path d="M13.8408 3.7002C15.7509 3.7003 17.2997 5.24906 17.2998 7.15918V7.24023C17.2998 8.73594 16.3466 10.4674 14.9883 12.1172C13.8203 13.5357 12.434 14.798 11.3613 15.6592L10.9219 16.0029C10.6659 16.1962 10.3432 16.2998 10 16.2998C9.6514 16.2998 9.32847 16.1969 9.08105 16.0059V16.0049L9.07812 16.0029L8.63867 15.6592C7.566 14.798 6.17968 13.5357 5.01172 12.1172C3.65338 10.4674 2.7002 8.73594 2.7002 7.24023V7.15918C2.7003 5.24906 4.24906 3.7003 6.15918 3.7002C7.26943 3.7002 8.31457 4.23321 8.96387 5.13184L8.96484 5.13281L9.43359 5.7793L10 6.56152L10.5664 5.7793L11.0352 5.13281L11.0361 5.13184C11.6854 4.23321 12.7306 3.7002 13.8408 3.7002Z" stroke="#121212" strokeWidth="1.4" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* 텍스트 영역: 폰트명 + 디자이너 */}
                <div className="flex flex-col gap-0.5">
                    <h3 className="font-semibold text-2xl leading-7 text-[#1E1E1E] truncate">
                        {font.name}
                    </h3>
                    <p className="text-xs font-medium leading-6 text-gray-500 truncate">
                        {font.designer}
                    </p>
                </div>

                {/* 태그 뱃지 — 2줄까지 표시 (max-h: 2행 × 24px + gap 4px = 52px), 넘치면 숨김 */}
                <div className="flex gap-1 flex-wrap overflow-hidden" style={{ maxHeight: '52px' }}>
                    {font.tags && font.tags.map((tag, index) => (
                        <Badge key={index} label={`#${tag}`} variant="tag" />
                    ))}
                </div>

                {/* 스페이서: 태그와 버튼 사이를 채워 버튼을 항상 하단에 고정 */}
                <div className="flex-1" />

                {/* 하단 Download Link 버튼 */}
                {downloadUrl ? (
                    <a
                        href={downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center justify-center w-full h-10 rounded-md bg-[#F6F1EE] text-gray-700
                            font-mono text-xs font-bold uppercase tracking-wide
                            transition-opacity hover:opacity-80"
                        style={{ fontFamily: "'Roboto Mono', monospace" }}
                    >
                        Download Link
                    </a>
                ) : (
                    <div
                        className="flex items-center justify-center w-full h-10 rounded-md bg-[#F6F1EE] text-gray-400
                            font-mono text-xs font-bold uppercase tracking-wide cursor-not-allowed"
                        style={{ fontFamily: "'Roboto Mono', monospace" }}
                    >
                        No Link
                    </div>
                )}
            </div>
        </div>
    );
}
