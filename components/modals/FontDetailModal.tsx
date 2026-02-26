'use client';

import React, { useState } from 'react';
import { Font } from '@/types/font';
import Modal from '../ui/Modal';
import Badge from '../ui/Badge';
import Image from 'next/image';

interface FontDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    font: Font | null;
    onEdit: (font: Font) => void;
    onDelete: (font: Font) => void;
    onToggleFavorite: (fontId: string) => void;
}

/** 복사 버튼 상태 */
type CopyButtonState = 'enabled' | 'hover' | 'active';

/** 코드 복사 버튼 컴포넌트 */
function CopyCodeButton({ text, onCopy }: { text: string; onCopy: () => void }) {
    const [state, setState] = useState<CopyButtonState>('enabled');

    const handleClick = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setState('active');
            onCopy();
            setTimeout(() => setState('enabled'), 2000);
        } catch {
            console.error('클립보드 복사 실패');
        }
    };

    if (state === 'active') {
        return (
            <button
                className="h-7 pl-1.5 pr-2 bg-[#FFF8F7] rounded-md outline outline-1 outline-offset-[-1px] outline-primary flex items-center gap-1 transition-all"
            >
                <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4.4" y="3.74" width="10" height="10" rx="1" fill="#FF5429" opacity="0.5" />
                    <rect x="2" y="1.33" width="10" height="12" rx="1" fill="#FF5429" opacity="0.5" />
                </svg>
                <span className="text-primary text-sm font-medium font-mono">copied!🤗</span>
            </button>
        );
    }

    return (
        <button
            onClick={handleClick}
            onMouseEnter={() => setState('hover')}
            onMouseLeave={() => setState('enabled')}
            className={`h-7 pl-1.5 pr-2 bg-white rounded-md outline outline-1 outline-offset-[-1px] flex items-center gap-1 transition-all ${state === 'hover' ? 'outline-gray-500' : 'outline-gray-300'
                }`}
        >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4.4" y="3.74" width="10" height="10" rx="1" fill="#D6D6D6" />
                <rect x="2" y="1.33" width="10" height="12" rx="1" fill="#EDEDED" opacity="0.5" />
            </svg>
            <span className="text-gray-900 text-sm font-normal font-mono">copy code</span>
        </button>
    );
}

/** 웹 폰트 코드 블록 컴포넌트 */
function WebFontCodeBlock({
    label,
    subLabel,
    code,
}: {
    label: string;
    subLabel: string;
    code: string;
}) {
    const [copied, setCopied] = useState(false);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end gap-2">
                <div className="flex-1 min-w-0 flex flex-col gap-1 pr-2">
                    <span className="text-gray-700 text-xs font-normal font-sans leading-4 break-words">{label}</span>
                    <span className="text-orange-400 text-xs font-normal font-sans leading-4 break-words whitespace-normal">{subLabel}</span>
                </div>
                <CopyCodeButton text={code} onCopy={() => setCopied(!copied)} />
            </div>
            <div className="h-32 p-3 bg-white rounded-md outline outline-1 outline-offset-[-1px] outline-gray-300 overflow-hidden">
                <pre className="text-gray-900 text-xs font-mono leading-4 whitespace-pre-wrap break-all overflow-y-auto h-full">
                    {code}
                </pre>
            </div>
        </div>
    );
}

export default function FontDetailModal({
    isOpen,
    onClose,
    font,
    onEdit,
    onDelete,
    onToggleFavorite
}: FontDetailModalProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState<'info' | 'webfont'>('info');

    // 모달이 열리거나 폰트가 변경될 때 초기화
    React.useEffect(() => {
        if (isOpen) {
            setSelectedImageIndex(0);
            setActiveTab('info');
        }
    }, [font?.id, isOpen]);

    if (!font) return null;

    // 메인 이미지
    const mainImage = font.imageUrls && font.imageUrls.length > 0
        ? font.imageUrls[selectedImageIndex]
        : font.thumbnailUrl;

    // 5개 썸네일
    const thumbnails = Array.from({ length: 5 }, (_, i) =>
        font.imageUrls && font.imageUrls[i] ? font.imageUrls[i] : null
    );

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

    // Whether webfont snippets exist
    const hasWebFontData = !!(font.webFontSnippets?.linkEmbed || font.webFontSnippets?.cssClass || font.webFontSnippets?.importCode);

    const tabs = [
        { key: 'info' as const, label: '폰트 정보' },
        { key: 'webfont' as const, label: '웹 폰트 사용' },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl" showCloseButton={false}>
            <div className="w-96 md:w-[576px] max-w-full bg-white rounded-xl flex flex-col max-h-[85dvh]">
                {/* 헤더: 폰트명 + 북마크 + 편집 */}
                <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <div className="flex-1 flex items-center gap-2 min-w-0">
                            <h2 className="text-gray-900 text-lg font-semibold font-sans leading-7 line-clamp-1">
                                {font.name}
                            </h2>
                            <button
                                onClick={() => onToggleFavorite(font.id)}
                                className="shrink-0 w-5 h-5 flex items-center justify-center transition-transform hover:scale-110"
                                aria-label="즐겨찾기"
                            >
                                {font.isFavorite ? (
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M9.53125 4.72188L10 5.36875L10.4688 4.72188C11.25 3.64063 12.5062 3 13.8406 3C16.1375 3 18 4.8625 18 7.15938V7.24062C18 10.7469 13.6281 14.8188 11.3469 16.5594C10.9594 16.8531 10.4844 17 10 17C9.51562 17 9.0375 16.8563 8.65312 16.5594C6.37187 14.8188 2 10.7469 2 7.24062V7.15938C2 4.8625 3.8625 3 6.15938 3C7.49375 3 8.75 3.64063 9.53125 4.72188Z" fill="#FF5429" />
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                        <path d="M13.8408 3.7002C15.7509 3.7003 17.2997 5.24906 17.2998 7.15918V7.24023C17.2998 8.73594 16.3466 10.4674 14.9883 12.1172C13.8203 13.5357 12.434 14.798 11.3613 15.6592L10.9219 16.0029C10.6659 16.1962 10.3432 16.2998 10 16.2998C9.6514 16.2998 9.32847 16.1969 9.08105 16.0059V16.0049L9.07812 16.0029L8.63867 15.6592C7.566 14.798 6.17968 13.5357 5.01172 12.1172C3.65338 10.4674 2.7002 8.73594 2.7002 7.24023V7.15918C2.7003 5.24906 4.24906 3.7003 6.15918 3.7002C7.26943 3.7002 8.31457 4.23321 8.96387 5.13184L8.96484 5.13281L9.43359 5.7793L10 6.56152L10.5664 5.7793L11.0352 5.13281L11.0361 5.13184C11.6854 4.23321 12.7306 3.7002 13.8408 3.7002Z" stroke="#121212" strokeWidth="1.4" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <button
                            onClick={() => onEdit(font)}
                            className="text-primary text-sm font-semibold font-sans leading-5 hover:opacity-80 transition-opacity"
                        >
                            편집
                        </button>
                    </div>
                </div>

                {/* 탭 바 + 콘텐츠 (스크롤 영역) */}
                <div className="px-6 pt-1.5 pb-5 flex flex-col gap-5 overflow-y-auto flex-1">
                    {/* 탭 바 */}
                    <div className="border-b border-gray-200 flex">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex-1 px-6 py-2 text-center text-sm font-sans leading-5 transition-colors flex items-center justify-center gap-1 ${activeTab === tab.key
                                    ? 'border-b-2 border-primary text-primary font-semibold'
                                    : 'text-gray-500 font-normal hover:text-gray-700'
                                    }`}
                            >
                                {tab.label}
                                {tab.key === 'webfont' && hasWebFontData && (
                                    <svg width="28" height="16" viewBox="0 0 28 16" fill="none" className="inline-block">
                                        <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                        <path d="M18 12L22 8L18 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* 탭1: 폰트 정보 */}
                    {activeTab === 'info' && (
                        <div className="flex flex-col gap-6">
                            {/* 이미지 갤러리 */}
                            <div className="flex flex-col gap-3">
                                {/* 메인 이미지 */}
                                <div className="relative w-full h-44 md:h-80 rounded-md outline outline-1 outline-offset-[-0.5px] outline-gray-300 overflow-hidden bg-gray-100">
                                    {mainImage ? (
                                        <Image
                                            src={mainImage}
                                            alt={font.name}
                                            fill
                                            className="object-cover"
                                            priority
                                            sizes="(max-width: 768px) 100vw, 576px"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M8 32L17.172 22.828C17.9221 22.0781 18.9393 21.6569 20 21.6569C21.0607 21.6569 22.0779 22.0781 22.828 22.828L32 32M28 28L31.172 24.828C31.9221 24.0781 32.9393 23.6569 34 23.6569C35.0607 23.6569 36.0779 24.0781 36.828 24.828L40 28M28 16H28.02M12 40H36C37.0609 40 38.0783 39.5786 38.8284 38.8284C39.5786 38.0783 40 37.0609 40 36V12C40 10.9391 39.5786 9.92172 38.8284 9.17157C38.0783 8.42143 37.0609 8 36 8H12C10.9391 8 9.92172 8.42143 9.17157 9.17157C8.42143 9.92172 8 10.9391 8 12V36C8 37.0609 8.42143 38.0783 9.17157 38.8284C9.92172 39.5786 10.9391 40 12 40Z" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                {/* 5개 썸네일 */}
                                <div className="flex gap-3">
                                    {thumbnails.map((thumb, index) => (
                                        <button
                                            key={index}
                                            onClick={() => thumb && setSelectedImageIndex(index)}
                                            className={`relative flex-1 aspect-square rounded-md outline outline-1 outline-offset-[-0.5px] outline-gray-300 overflow-hidden transition-all ${thumb ? 'cursor-pointer hover:outline-primary' : 'cursor-default bg-gray-100'
                                                } ${selectedImageIndex === index && thumb ? 'outline-2 outline-primary' : ''}`}
                                            disabled={!thumb}
                                        >
                                            {thumb ? (
                                                <Image
                                                    src={thumb}
                                                    alt={`${font.name} ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="120px"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M8 32L17.172 22.828C17.9221 22.0781 18.9393 21.6569 20 21.6569C21.0607 21.6569 22.0779 22.0781 22.828 22.828L32 32M28 28L31.172 24.828C31.9221 24.0781 32.9393 23.6569 34 23.6569C35.0607 23.6569 36.0779 24.0781 36.828 24.828L40 28M28 16H28.02M12 40H36C37.0609 40 38.0783 39.5786 38.8284 38.8284C39.5786 38.0783 40 37.0609 40 36V12C40 10.9391 39.5786 9.92172 38.8284 9.17157C38.0783 8.42143 37.0609 8 36 8H12C10.9391 8 9.92172 8.42143 9.17157 9.17157C8.42143 9.92172 8 10.9391 8 12V36C8 37.0609 8.42143 38.0783 9.17157 38.8284C9.92172 39.5786 10.9391 40 12 40Z" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 폰트 기본 정보 row */}
                            <div className="pt-5 border-t border-gray-200 flex justify-between items-center overflow-hidden">
                                <div className="flex-1 flex items-center gap-2 min-w-0">
                                    <span className="text-gray-900 text-base font-medium font-sans">{font.name}</span>
                                    {font.englishName && (
                                        <span className="text-gray-700 text-xs font-normal font-mono leading-4">{font.englishName}</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-4">
                                    {getFontTypeLabel(font.fontType) && (
                                        <span className="text-gray-700 text-xs font-normal font-mono leading-4">
                                            {getFontTypeLabel(font.fontType)}
                                        </span>
                                    )}
                                    {font.weightCount && (
                                        <div className="flex items-center">
                                            <span className="text-gray-700 text-xs font-normal font-sans leading-4">글꼴</span>
                                            <span className="text-gray-700 text-xs font-normal font-mono leading-4">{font.weightCount}</span>
                                            <span className="text-gray-700 text-xs font-normal font-sans leading-4">종</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 배지 */}
                            <div className="flex flex-col gap-5">
                                <div className="flex items-center gap-2">
                                    <Badge label={getLicenseLabel(font.license)} variant="license" />
                                    <Badge label={getCategoryLabel(font.category)} variant="category" />
                                </div>

                                {/* 디자이너 / 제작사 */}
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                                            <span className="text-gray-500 text-sm font-medium font-sans">디자이너</span>
                                            <span className="text-gray-900 text-base font-medium font-sans">{font.designer}</span>
                                        </div>
                                        {font.foundry && (
                                            <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                                                <span className="text-gray-500 text-sm font-medium font-sans">제작사</span>
                                                <span className="text-gray-900 text-base font-medium font-sans">{font.foundry}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* 다운로드 URL */}
                                    {font.downloadUrl && (
                                        <div className="flex flex-col gap-1 overflow-hidden">
                                            <span className="text-gray-500 text-sm font-medium font-sans">다운로드</span>
                                            <a
                                                href={font.downloadUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary text-xs font-normal font-mono leading-4 hover:underline truncate"
                                            >
                                                {font.downloadUrl}
                                            </a>
                                        </div>
                                    )}

                                    {/* 공식 사이트 */}
                                    {font.officialUrl && (
                                        <div className="flex flex-col gap-1 overflow-hidden">
                                            <span className="text-gray-500 text-sm font-medium font-sans">공식 사이트</span>
                                            <a
                                                href={font.officialUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary text-xs font-normal font-mono leading-4 hover:underline truncate"
                                            >
                                                {font.officialUrl}
                                            </a>
                                        </div>
                                    )}
                                </div>

                                {/* 태그 */}
                                {font.tags && font.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 content-start overflow-hidden">
                                        {font.tags.map((tag, index) => (
                                            <Badge key={index} label={`#${tag}`} variant="tag" />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 폰트 설명 */}
                            {font.description && (
                                <div className="flex flex-col gap-2">
                                    <div className="pt-5 border-t border-gray-200">
                                        <span className="text-gray-500 text-base font-medium font-sans">폰트 설명</span>
                                    </div>
                                    <p className="text-gray-900 text-sm font-medium font-sans leading-6 whitespace-pre-wrap">
                                        {font.description}
                                    </p>
                                </div>
                            )}

                            {/* 사용 노트 */}
                            {font.usageNotes && (
                                <div className="flex flex-col gap-2">
                                    <div className="pt-5 border-t border-gray-200">
                                        <span className="text-gray-500 text-base font-medium font-sans">사용 노트</span>
                                    </div>
                                    <p className="text-gray-900 text-sm font-medium font-sans leading-6 whitespace-pre-wrap">
                                        {font.usageNotes}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 탭2: 웹 폰트 사용 */}
                    {activeTab === 'webfont' && (
                        <div className="flex flex-col gap-5">
                            {font.webFontSnippets?.linkEmbed ? (
                                <WebFontCodeBlock
                                    label="<link>"
                                    subLabel="Embed code in the <head> of your html"
                                    code={font.webFontSnippets.linkEmbed}
                                />
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <span className="text-gray-700 text-xs font-normal font-sans leading-4">&lt;link&gt;</span>
                                    <div className="h-32 p-3 bg-gray-50 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-300 flex items-center justify-center">
                                        <span className="text-gray-400 text-sm font-sans">등록된 코드가 없습니다</span>
                                    </div>
                                </div>
                            )}

                            {font.webFontSnippets?.cssClass ? (
                                <WebFontCodeBlock
                                    label="<link>"
                                    subLabel="Font-family: CSS class"
                                    code={font.webFontSnippets.cssClass}
                                />
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <span className="text-gray-700 text-xs font-normal font-sans leading-4">Font-family: CSS class</span>
                                    <div className="h-32 p-3 bg-gray-50 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-300 flex items-center justify-center">
                                        <span className="text-gray-400 text-sm font-sans">등록된 코드가 없습니다</span>
                                    </div>
                                </div>
                            )}

                            {font.webFontSnippets?.importCode ? (
                                <WebFontCodeBlock
                                    label="<@import>"
                                    subLabel="Embed code in the &lt;head&gt; of your html"
                                    code={font.webFontSnippets.importCode}
                                />
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <span className="text-gray-700 text-xs font-normal font-sans leading-4">&lt;@import&gt;</span>
                                    <div className="h-32 p-3 bg-gray-50 rounded-md outline outline-1 outline-offset-[-1px] outline-gray-300 flex items-center justify-center">
                                        <span className="text-gray-400 text-sm font-sans">등록된 코드가 없습니다</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 하단: 삭제 + 닫기 */}
                <div className="border-t border-gray-200 px-6 py-4 flex justify-end items-start gap-2 flex-shrink-0">
                    <button
                        onClick={() => onDelete(font)}
                        className="h-8 px-4 bg-primary rounded-md flex items-center justify-center hover:bg-primary-hover transition-colors"
                    >
                        <span className="text-center text-white text-sm font-bold font-sans leading-4">삭제</span>
                    </button>
                    <button
                        onClick={onClose}
                        className="h-8 px-4 bg-gray-200 rounded-md flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                        <span className="text-center text-gray-900 text-sm font-normal font-sans leading-5">닫기</span>
                    </button>
                </div>
            </div>
        </Modal>
    );
}
