'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useCompareStore } from '@/store/compareStore';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Image from 'next/image';
// 하지만 Modal 로직(스크롤락 등)을 가져오는 게 좋음.
// 여기서는 기획안대로 독립적인 오버레이로 구현하되, Modal 로직을 참고하여 스크롤 락을 구현하거나, 
// Modal 컴포넌트를 활용하되 스타일을 커스텀하는 방식도 고려 가능.
// 기획안: "독립된 컴포넌트 (기존 Modal 재사용 안 함)" -> 직접 구현.

interface ComparisonOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    onToggleFavorite?: (fontId: string) => void;
}

export default function ComparisonOverlay({ isOpen, onClose, onToggleFavorite }: ComparisonOverlayProps) {
    const { selectedFonts } = useCompareStore();
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // 스크롤 락
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setActiveIndex(0); // 닫을 때 초기화
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // 모바일 스와이프 감지
    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, clientWidth } = scrollContainerRef.current;
            const index = Math.round(scrollLeft / clientWidth);
            setActiveIndex(index);
        }
    };

    if (!isOpen) return null;
    if (selectedFonts.length < 2) return null; // 2개 이상일 때만

    return (
        <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center">
            {/* Shared Layout Wrapper */}
            <div className={`w-full flex flex-col h-full transition-all duration-300 ${selectedFonts.length === 2 ? 'md:max-w-[801px]' : 'md:max-w-[1202px]'
                }`}>
                {/* 헤더 */}
                <div className="w-full border-b border-border bg-white shrink-0">
                    <div className="flex items-center justify-between px-6 py-4">
                        <h2 className="text-lg font-bold text-text-primary">
                            폰트 비교 ({selectedFonts.length})
                        </h2>
                        <Button variant="ghost" onClick={onClose} className="p-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </Button>
                    </div>
                </div>

                {/* 컨텐츠 영역 */}
                <div className="flex-1 overflow-hidden bg-white relative flex justify-center">

                    {/* PC: Flexbox 레이아웃 (중앙 정렬) */}
                    <div className="hidden md:flex h-full w-full justify-center items-start gap-px bg-border border-x border-border">
                        {selectedFonts.map((font) => (
                            <div
                                key={font.id}
                                className="bg-white h-full overflow-y-auto flex-shrink-0 md:w-1/2 lg:w-1/3 border-r last:border-r-0 border-border"
                                style={{ width: selectedFonts.length === 2 ? '50%' : '33.333%' }}
                            >
                                <div className="p-6">
                                    <ComparisonCard font={font} onToggleFavorite={onToggleFavorite} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 모바일: 스와이프 레이아웃 */}
                    <div
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        className="md:hidden flex h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                    >
                        {selectedFonts.map((font) => (
                            <div key={font.id} className="w-full shrink-0 snap-center bg-white p-4 overflow-y-auto h-full">
                                <ComparisonCard font={font} onToggleFavorite={onToggleFavorite} />
                            </div>
                        ))}
                    </div>

                    {/* 모바일 인디케이터 */}
                    <div className="md:hidden absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                        {selectedFonts.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-colors ${idx === activeIndex ? 'bg-primary' : 'bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// 내부 카드 컴포넌트
function ComparisonCard({ font, onToggleFavorite }: { font: import('@/types/font').Font, onToggleFavorite?: (id: string) => void }) {
    return (
        <div className="flex flex-col h-full">
            {/* 이미지 */}
            <div className="relative w-full aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden mb-6 shrink-0">
                {font.thumbnailUrl ? (
                    <Image src={font.thumbnailUrl} alt={font.name} fill className="object-cover" unoptimized />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400">No Image</div>
                )}
            </div>

            {/* 정보 */}
            <div className="space-y-4 flex-1">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-text-primary mb-1">{font.name}</h3>
                        <p className="text-text-secondary">{font.designer}</p>
                    </div>
                    <button
                        onClick={() => onToggleFavorite?.(font.id)}
                        className="text-text-secondary hover:text-accent transition-colors p-1"
                    >
                        <svg
                            className="w-6 h-6"
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

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="block text-text-secondary mb-1">카테고리</span>
                        <Badge label={font.category} variant="category" />
                    </div>
                    <div>
                        <span className="block text-text-secondary mb-1">라이선스</span>
                        <Badge label={font.license} variant="license" />
                    </div>
                </div>

                {font.tags && font.tags.length > 0 && (
                    <div>
                        <span className="block text-text-secondary mb-2">태그</span>
                        <div className="flex flex-wrap gap-2">
                            {font.tags.map((tag: string) => (
                                <Badge key={tag} label={`#${tag}`} variant="tag" />
                            ))}
                        </div>
                    </div>
                )}

                {font.description && (
                    <div className="mt-4 pt-4 border-t border-border">
                        <p className="text-text-primary whitespace-pre-wrap">{font.description}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
