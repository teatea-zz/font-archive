'use client';

import React, { useState } from 'react';
import { Font } from '@/types/font';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
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

export default function FontDetailModal({
    isOpen,
    onClose,
    font,
    onEdit,
    onDelete,
    onToggleFavorite
}: FontDetailModalProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // 폰트가 변경될 때 이미지 인덱스 초기화
    React.useEffect(() => {
        setSelectedImageIndex(0);
    }, [font?.id]);

    if (!font) return null;

    // 메인 이미지 (선택된 이미지 또는 첫 번째 이미지)
    const mainImage = font.imageUrls && font.imageUrls.length > 0
        ? font.imageUrls[selectedImageIndex]
        : font.thumbnailUrl;

    // 5개 썸네일 (없으면 null)
    const thumbnails = Array.from({ length: 5 }, (_, i) =>
        font.imageUrls && font.imageUrls[i] ? font.imageUrls[i] : null
    );

    // 카테고리 라벨
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

    // 라이선스 라벨
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
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl" showCloseButton={false}>
            <div className="h-[85dvh] overflow-y-auto flex flex-col">
                {/* 헤더 (고정) */}
                <div className="sticky top-0 bg-white z-10 px-6 py-4 border-b border-border flex items-center justify-between flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-text-primary">
                            {font.name}
                        </h2>
                        {/* 즐겨찾기 아이콘 토글 */}
                        <button
                            onClick={() => onToggleFavorite(font.id)}
                            className="text-accent transition-smooth hover:scale-110"
                            aria-label="즐겨찾기"
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
                    {/* 편집 버튼 (우측) */}
                    <Button
                        variant="ghost"
                        onClick={() => onEdit(font)}
                    >
                        편집
                    </Button>
                </div>

                {/* 콘텐츠 */}
                <div className="px-6 py-6 flex-1 overflow-y-auto">
                    {/* 이미지 갤러리 */}
                    <div className="mb-8">
                        {/* 메인 이미지 */}
                        <div className="relative w-full aspect-[16/9] bg-background-secondary rounded-lg overflow-hidden mb-3">
                            {mainImage ? (
                                <Image
                                    src={mainImage}
                                    alt={font.name}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-text-secondary">
                                    <svg className="w-16 h-16" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                        <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                        </div>

                        {/* 5개 썸네일 그리드 */}
                        <div className="grid grid-cols-5 gap-2 sm:gap-3">
                            {thumbnails.map((thumb, index) => (
                                <button
                                    key={index}
                                    onClick={() => thumb && setSelectedImageIndex(index)}
                                    className={`relative w-full aspect-square rounded-lg border-2 overflow-hidden transition-all ${selectedImageIndex === index && thumb
                                        ? 'border-primary bg-primary'
                                        : 'border-border hover:border-primary/50 bg-background-secondary'
                                        } ${thumb ? 'cursor-pointer' : 'cursor-default'}`}
                                    disabled={!thumb}
                                >
                                    {thumb ? (
                                        <Image
                                            src={thumb}
                                            alt={`${font.name} ${index + 1}`}
                                            fill
                                            className="object-cover rounded-md scale-[1.02]"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-background-secondary flex items-center justify-center">
                                            <svg className="w-6 h-6 text-text-secondary/30" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 폰트 정보 */}
                    <section className="mb-6">
                        <h3 className="text-lg font-bold text-text-primary mb-3 pb-2 border-b border-border">
                            폰트 정보
                        </h3>
                        <dl className="space-y-2">
                            <div className="flex flex-col sm:flex-row sm:gap-2 sm:items-center">
                                <dt className="text-sm font-medium text-text-secondary sm:w-24">디자이너:</dt>
                                <dd className="text-sm text-text-primary">{font.designer}</dd>
                            </div>
                            {font.foundry && (
                                <div className="flex flex-col sm:flex-row sm:gap-2 sm:items-center">
                                    <dt className="text-sm font-medium text-text-secondary sm:w-24">제작사:</dt>
                                    <dd className="text-sm text-text-primary">{font.foundry}</dd>
                                </div>
                            )}
                            <div className="flex flex-col sm:flex-row sm:gap-2 sm:items-center">
                                <dt className="text-sm font-medium text-text-secondary sm:w-24">카테고리:</dt>
                                <dd>
                                    <Badge label={getCategoryLabel(font.category)} variant="category" />
                                </dd>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:gap-2 sm:items-center">
                                <dt className="text-sm font-medium text-text-secondary sm:w-24">라이선스:</dt>
                                <dd>
                                    <Badge label={getLicenseLabel(font.license)} variant="license" />
                                </dd>
                            </div>
                            {font.downloadUrl && (
                                <div className="flex flex-col sm:flex-row sm:gap-2 sm:items-center">
                                    <dt className="text-sm font-medium text-text-secondary sm:w-24">다운로드:</dt>
                                    <dd>
                                        <a
                                            href={font.downloadUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-primary hover:underline break-all"
                                        >
                                            {font.downloadUrl}
                                        </a>
                                    </dd>
                                </div>
                            )}
                            {font.officialUrl && (
                                <div className="flex flex-col sm:flex-row sm:gap-2 sm:items-center">
                                    <dt className="text-sm font-medium text-text-secondary sm:w-24">공식 사이트:</dt>
                                    <dd>
                                        <a
                                            href={font.officialUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm text-primary hover:underline break-all"
                                        >
                                            {font.officialUrl}
                                        </a>
                                    </dd>
                                </div>
                            )}
                            {/* 태그를 폰트 정보 안에 통합 */}
                            {font.tags && font.tags.length > 0 && (
                                <div className="flex flex-col sm:flex-row sm:gap-2 sm:items-center">
                                    <dt className="text-sm font-medium text-text-secondary sm:w-24">태그:</dt>
                                    <dd className="flex flex-wrap gap-2">
                                        {font.tags.map((tag, index) => (
                                            <Badge key={index} label={`#${tag}`} variant="tag" />
                                        ))}
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </section>

                    {/* 설명 (조건부) */}
                    {font.description && (
                        <section className="mb-6">
                            <h3 className="text-lg font-bold text-text-primary mb-3 pb-2 border-b border-border">
                                설명
                            </h3>
                            <p className="text-sm text-text-primary whitespace-pre-wrap">
                                {font.description}
                            </p>
                        </section>
                    )}

                    {/* 사용 노트 (조건부) */}
                    {font.usageNotes && (
                        <section className="mb-6">
                            <h3 className="text-lg font-bold text-text-primary mb-3 pb-2 border-b border-border">
                                사용 노트
                            </h3>
                            <p className="text-sm text-text-primary whitespace-pre-wrap">
                                {font.usageNotes}
                            </p>
                        </section>
                    )}
                </div>

                {/* 하단 버튼 (반응형 + Safe Area) */}
                <div
                    className="bg-white border-t border-border px-6 py-4 flex-shrink-0"
                    style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
                >
                    {/* PC: 우측 정렬, 모바일: 양측 정렬 + 전체 너비 */}
                    <div className="flex gap-3 justify-between sm:justify-end sm:gap-3">
                        {/* 삭제 버튼 (배경색만 커스텀) */}
                        <Button
                            onClick={() => onDelete(font)}
                            variant="secondary"
                            className="w-full sm:w-auto !bg-gray-100 !text-gray-700 hover:!bg-red-500 hover:!text-white"
                        >
                            삭제
                        </Button>
                        {/* 닫기 버튼 */}
                        <Button variant="secondary" onClick={onClose} className="w-full sm:w-auto">
                            닫기
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
