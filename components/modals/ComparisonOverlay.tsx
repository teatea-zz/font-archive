import React, { useState, useEffect } from 'react';
import { useCompareStore } from '@/store/compareStore';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Image from 'next/image';
import { Font } from '@/types/font';

interface ComparisonOverlayProps {
    isOpen: boolean;
    onClose: () => void;
    onToggleFavorite?: (fontId: string) => void;
}

export default function ComparisonOverlay({ isOpen, onClose, onToggleFavorite }: ComparisonOverlayProps) {
    const { selectedFonts } = useCompareStore();
    const [activeIndex, setActiveIndex] = useState(0);
    // xl(1280px+) 여부 감지
    const [isXl, setIsXl] = useState(false);
    useEffect(() => {
        const check = () => setIsXl(window.innerWidth >= 1280);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // 스크롤 락
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setActiveIndex(0); // 열릴 때 첫 번째로 초기화
        } else {
            document.body.style.overflow = 'unset';
            setActiveIndex(0); // 닫힐 때 초기화
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;
    if (selectedFonts.length < 2) return null; // 2개 이상일 때만

    const handlePrev = () => {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev < selectedFonts.length - 1 ? prev + 1 : prev));
    };

    return (
        <div className="fixed inset-0 z-[100] bg-[#F6F6F6] flex flex-col overflow-hidden">
            {/* 전체 화면 래퍼 */}
            <div className="w-full h-full flex flex-col">
                {/* 헤더 */}
                {/* md~xl(768~1280px): bg-white 전체 너비 */}
                {/* xl+(1280px~): #F6F6F6 배경에 흰 컨텐츠 중앙 */}
                <div className="w-full shrink-0" style={{ background: isXl ? '#F6F6F6' : 'white', display: 'flex', justifyContent: isXl ? 'center' : 'flex-start' }}>
                    <div
                        className="h-14 px-6 py-4 flex items-center justify-between border-b border-gray-200 bg-white"
                        style={{
                            width: isXl ? `${selectedFonts.length * 480}px` : '100%',
                            maxWidth: '100%',
                        }}
                    >
                        <div className="flex justify-start items-center gap-2">
                            <h2 className="justify-center text-gray-900 text-lg font-semibold font-sans leading-7 line-clamp-1">
                                폰트 비교
                            </h2>
                            <p className="text-text-secondary text-sm font-medium">
                                <span style={{ fontFamily: "'Roboto Mono', monospace" }} className="font-bold">{selectedFonts.length}</span>종
                            </p>
                        </div>
                        <button onClick={onClose} className="w-6 h-6 flex justify-center items-center hover:bg-gray-100 rounded-md transition-colors">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6l12 12" stroke="#121212" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* 콘텐츠 영역 래퍼 */}
                <div className="relative flex-1 flex w-full overflow-hidden">

                    {/* 1) 모바일: 단일 폰트와 화살표 오버레이 */}
                    <div className="md:hidden w-full h-full relative">
                        {/* 모바일 폰트 카드 */}
                        <div className="w-full h-full overflow-y-auto bg-white pb-5">
                            <ComparisonCard font={selectedFonts[activeIndex]} onToggleFavorite={onToggleFavorite} arrowSlot={
                                <>
                                    {activeIndex > 0 && (
                                        <button
                                            onClick={handlePrev}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-neutral-900/50 rounded-full flex items-center justify-center hover:bg-neutral-900/70 transition-colors"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M15 18l-6-6 6-6" />
                                            </svg>
                                        </button>
                                    )}
                                    {activeIndex < selectedFonts.length - 1 && (
                                        <button
                                            onClick={handleNext}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-neutral-900/50 rounded-full flex items-center justify-center hover:bg-neutral-900/70 transition-colors"
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M9 18l6-6-6-6" />
                                            </svg>
                                        </button>
                                    )}
                                </>
                            } />
                        </div>
                    </div>

                    {/* 2) 태블릿 & PC: 반응형 그리드 */}
                    {/* md~xl(768~1280px): 전체 너비에서 flex-1 균등 분할 */}
                    {/* xl+(1280px~): 카드 480px 고정, 개수에 따라 늘어남 */}
                    <div className="hidden md:flex w-full h-full justify-center bg-[#F6F6F6]">
                        {/* md~xl: w-full 컨테이너 안에서 flex-1 */}
                        <div className="flex h-full w-full xl:w-auto gap-px">
                            {selectedFonts.map((font) => (
                                <div
                                    key={font.id}
                                    className="flex-1 xl:flex-none xl:w-[480px] h-full overflow-y-auto bg-white"
                                >
                                    <ComparisonCard font={font} onToggleFavorite={onToggleFavorite} />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

// 카테고리 라벨
const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
        'gothic': '고딕', 'myeongjo': '명조', 'display': '디스플레이',
        'handwriting': '손글씨', 'dingbat': '딩벳', 'other': '기타'
    };
    return labels[category] || category;
};

// 라이선스 라벨
const getLicenseLabel = (license: string) => {
    const labels: Record<string, string> = {
        'ofl': 'OFL', 'free': '무료', 'commercial': '상업용',
        'personal': '개인용', 'apache': 'Apache', 'unknown': '미확인'
    };
    return labels[license] || license;
};

// 파일 형식 라벨
const getFontTypeLabel = (fontType?: string) => {
    const labels: Record<string, string> = {
        'otf_ttf': 'OTF / TTF', 'otf': 'OTF', 'ttf': 'TTF'
    };
    return fontType ? labels[fontType] || fontType : null;
};

/** 내부 카드 컴포넌트 */
function ComparisonCard({ font, onToggleFavorite, arrowSlot }: {
    font: Font;
    onToggleFavorite?: (id: string) => void;
    arrowSlot?: React.ReactNode;
}) {
    const mainImage = font.imageUrls && font.imageUrls.length > 0
        ? font.imageUrls[0]
        : font.thumbnailUrl;

    return (
        <div className="w-full bg-white flex flex-col justify-start items-start px-6 py-5 gap-5">

            {/* 메인 이미지: 쨜노 비율에 맞춰 자동 높이를 가짐 */}
            <div className="self-stretch flex flex-col justify-start items-start gap-6">
                {/* 이미지 영역: relative로 화살표 arrowSlot 위치 기준점 */}
                <div className="relative self-stretch">
                    {/* arrowSlot: 모바일에서만 주입 */}
                    {arrowSlot}
                    <div className="self-stretch aspect-video bg-gray-100 rounded-md outline outline-1 outline-offset-[-0.5px] outline-gray-300 flex justify-center items-center overflow-hidden">
                        {mainImage ? (
                            <img
                                src={mainImage}
                                alt={font.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-12 h-12 flex items-center justify-center text-gray-400">
                                <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 32L17.172 22.828C17.9221 22.0781 18.9393 21.6569 20 21.6569C21.0607 21.6569 22.0779 22.0781 22.828 22.828L32 32M28 28L31.172 24.828C31.9221 24.0781 32.9393 23.6569 34 23.6569C35.0607 23.6569 36.0779 24.0781 36.828 24.828L40 28M28 16H28.02M12 40H36C37.0609 40 38.0783 39.5786 38.8284 38.8284C39.5786 38.0783 40 37.0609 40 36V12C40 10.9391 39.5786 9.92172 38.8284 9.17157C38.0783 8.42143 37.0609 8 36 8H12C10.9391 8 9.92172 8.42143 9.17157 9.17157C8.42143 9.92172 8 10.9391 8 12V36C8 37.0609 8.42143 38.0783 9.17157 38.8284C9.92172 39.5786 10.9391 40 12 40Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 타이틀 정보 영역 */}
            <div className="self-stretch pt-5 border-t border-gray-200 flex justify-between items-start overflow-hidden">
                <div className="flex-1 flex flex-col justify-start items-start gap-1 min-w-0 pr-4">
                    <span className="justify-center text-gray-900 text-base font-medium font-sans truncate w-full">{font.name}</span>
                    {font.englishName && (
                        <span className="justify-center text-gray-700 text-xs font-normal font-mono leading-4 truncate w-full">{font.englishName}</span>
                    )}
                </div>
                <div className="flex flex-col justify-start items-end gap-2 shrink-0">
                    <div className="flex items-center gap-2">
                        {getFontTypeLabel(font.fontType) && (
                            <span className="justify-center text-gray-700 text-xs font-normal font-mono leading-4">{getFontTypeLabel(font.fontType)}</span>
                        )}
                        {font.weightCount && (
                            <div className="flex justify-start items-center gap-1">
                                <span className="justify-center text-gray-700 text-xs font-normal font-sans leading-4">글꼴</span>
                                <div className="flex justify-start items-center">
                                    <span className="justify-center text-gray-700 text-xs font-normal font-mono leading-4">{font.weightCount}</span>
                                    <span className="justify-center text-gray-700 text-xs font-normal font-sans leading-4">종</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => onToggleFavorite?.(font.id)}
                        className="text-text-secondary hover:text-accent transition-colors p-1"
                        aria-label="즐겨찾기 토글"
                    >
                        <svg
                            className="w-6 h-6"
                            fill={font.isFavorite ? '#FF5429' : 'none'}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.4"
                            viewBox="0 0 20 20"
                            stroke={font.isFavorite ? '#FF5429' : '#121212'}
                        >
                            {font.isFavorite ? (
                                <path d="M9.53125 4.72188L10 5.36875L10.4688 4.72188C11.25 3.64063 12.5062 3 13.8406 3C16.1375 3 18 4.8625 18 7.15938V7.24062C18 10.7469 13.6281 14.8188 11.3469 16.5594C10.9594 16.8531 10.4844 17 10 17C9.51562 17 9.0375 16.8563 8.65312 16.5594C6.37187 14.8188 2 10.7469 2 7.24062V7.15938C2 4.8625 3.8625 3 6.15938 3C7.49375 3 8.75 3.64063 9.53125 4.72188Z" fill="#FF5429" stroke="none" />
                            ) : (
                                <path d="M13.8408 3.7002C15.7509 3.7003 17.2997 5.24906 17.2998 7.15918V7.24023C17.2998 8.73594 16.3466 10.4674 14.9883 12.1172C13.8203 13.5357 12.434 14.798 11.3613 15.6592L10.9219 16.0029C10.6659 16.1962 10.3432 16.2998 10 16.2998C9.6514 16.2998 9.32847 16.1969 9.08105 16.0059V16.0049L9.07812 16.0029L8.63867 15.6592C7.566 14.798 6.17968 13.5357 5.01172 12.1172C3.65338 10.4674 2.7002 8.73594 2.7002 7.24023V7.15918C2.7003 5.24906 4.24906 3.7003 6.15918 3.7002C7.26943 3.7002 8.31457 4.23321 8.96387 5.13184L8.96484 5.13281L9.43359 5.7793L10 6.56152L10.5664 5.7793L11.0352 5.13281L11.0361 5.13184C11.6854 4.23321 12.7306 3.7002 13.8408 3.7002Z" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* 정보 및 태그 묶음 */}
            <div className="self-stretch flex flex-col justify-start items-start gap-5">
                {/* 뱃지들 */}
                <div className="self-stretch flex justify-start items-center gap-2">
                    <Badge label={getLicenseLabel(font.license)} variant="license" />
                    <Badge label={getCategoryLabel(font.category)} variant="category" />
                </div>

                {/* 제작사 / 디자이너 */}
                <div className="self-stretch flex flex-col justify-center items-start gap-6">
                    <div className="self-stretch flex justify-start items-start gap-4">
                        <div className="flex-1 flex flex-col justify-center items-start gap-1 overflow-hidden">
                            <span className="justify-center text-gray-500 text-sm font-medium font-sans">디자이너</span>
                            <span className="justify-center text-gray-900 text-base font-medium font-sans truncate w-full">{font.designer}</span>
                        </div>
                        {font.foundry && (
                            <div className="flex-1 flex flex-col justify-center items-start gap-1 overflow-hidden">
                                <span className="justify-center text-gray-500 text-sm font-medium font-sans">제작사</span>
                                <span className="justify-center text-gray-900 text-base font-medium font-sans truncate w-full">{font.foundry}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* 태그 리스트 */}
                {font.tags && font.tags.length > 0 && (
                    <div className="self-stretch flex justify-start items-start gap-1 flex-wrap content-start overflow-hidden">
                        {font.tags.map((tag: string) => (
                            <Badge key={tag} label={`#${tag}`} variant="tag" />
                        ))}
                    </div>
                )}
            </div>

            {/* 폰트 설명 */}
            {font.description && (
                <div className="self-stretch flex flex-col justify-center items-start gap-2">
                    <div className="self-stretch pt-5 border-t border-gray-200 flex flex-col justify-center items-start">
                        <span className="justify-center text-gray-500 text-base font-medium font-sans">폰트 설명</span>
                    </div>
                    <p className="self-stretch justify-center text-gray-900 text-sm font-medium font-sans leading-6 whitespace-pre-wrap">
                        {font.description}
                    </p>
                </div>
            )}

            {/* 사용 노트 */}
            {font.usageNotes && (
                <div className="self-stretch flex flex-col justify-center items-start gap-2">
                    <div className="self-stretch pt-5 border-t border-gray-200 flex flex-col justify-center items-start">
                        <span className="justify-center text-gray-500 text-base font-medium font-sans">사용 노트</span>
                    </div>
                    <p className="self-stretch justify-center text-gray-900 text-sm font-medium font-sans leading-6 whitespace-pre-wrap">
                        {font.usageNotes}
                    </p>
                </div>
            )}

            {/* 하단 다운로드 링크 */}
            {font.downloadUrl && (
                <div className="self-stretch pt-5 flex flex-col justify-start items-start gap-2">
                    <a
                        href={font.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="self-stretch flex"
                    >
                        <div className="flex-1 h-10 px-3 bg-[#F6F1EE] hover:opacity-80 transition-opacity rounded-md inline-flex justify-center items-center">
                            <span className="text-center justify-center text-gray-700 text-xs font-bold font-mono capitalize leading-4">
                                download link
                            </span>
                        </div>
                    </a>
                </div>
            )}
        </div>
    );
}
