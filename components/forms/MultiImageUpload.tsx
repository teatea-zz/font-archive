'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';

interface MultiImageUploadProps {
    images: string[];
    onImagesChange: (images: string[]) => void;
    maxImages?: number;
}

export default function MultiImageUpload({ images, onImagesChange, maxImages = 5 }: MultiImageUploadProps) {
    const [uploading, setUploading] = useState<number | null>(null); // 업로드 중인 슬롯 인덱스
    const [error, setError] = useState<string | null>(null);
    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleFileChange = async (file: File, slotIndex: number) => {
        setError(null);

        // 파일 검증
        if (!file.type.startsWith('image/')) {
            setError('이미지 파일만 업로드 가능합니다 (PNG, JPG, GIF, WebP)');
            return;
        }

        // 초기 파일 크기 체크 (압축 전 너무 큰 파일 방지, 예: 20MB)
        if (file.size > 20 * 1024 * 1024) {
            setError('원본 파일 크기는 20MB 이하여야 합니다');
            return;
        }

        // 업로드 상태 시작
        setUploading(slotIndex);

        try {
            // 1. 이미지 압축 및 WebP 변환
            // browser-image-compression 동적 임포트 (Next.js SSR 이슈 방지)
            const imageCompression = (await import('browser-image-compression')).default;

            const options = {
                maxSizeMB: 1,           // 최대 1MB
                maxWidthOrHeight: 1920, // 최대 해상도 FHD
                useWebWorker: true,     // 웹 워커 사용
                fileType: 'image/webp', // WebP로 변환
                initialQuality: 0.8     // 초기 품질
            };

            const compressedFile = await imageCompression(file, options);
            console.log(`🗜️ 이미지 압축: ${(file.size / 1024 / 1024).toFixed(2)}MB -> ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);

            // 2. 업로드
            const formData = new FormData();
            formData.append('file', compressedFile);

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            if (response.ok) {
                const newImages = [...images];
                newImages[slotIndex] = data.url;
                onImagesChange(newImages.filter(Boolean)); // 빈 값 제거
                console.log('✅ 이미지 업로드 성공:', data.url);
            } else {
                setError(data.error || '업로드 실패');
            }
        } catch (err) {
            console.error('업로드/압축 에러:', err);
            setError('이미지 처리 중 오류가 발생했습니다');
        } finally {
            setUploading(null);
        }
    };

    const handleRemoveImage = (indexToRemove: number) => {
        const newImages = images.filter((_, index) => index !== indexToRemove);
        onImagesChange(newImages);
    };

    const handleSlotClick = (index: number) => {
        fileInputRefs.current[index]?.click();
    };

    // 5개 슬롯 배열 생성
    const slots = Array.from({ length: maxImages }, (_, i) => i);

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-5 gap-3">
                {slots.map((slotIndex) => {
                    const imageUrl = images[slotIndex];
                    const isUploading = uploading === slotIndex;

                    return (
                        <div
                            key={slotIndex}
                            className="relative aspect-square border-2 border-dashed border-border rounded-lg overflow-hidden hover:border-primary transition-smooth cursor-pointer bg-background-secondary"
                            onClick={() => !imageUrl && handleSlotClick(slotIndex)}
                        >
                            <input
                                ref={(el) => { fileInputRefs.current[slotIndex] = el; }}
                                type="file"
                                accept="image/*"
                                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0], slotIndex)}
                                className="hidden"
                            />

                            {imageUrl ? (
                                <>
                                    {/* 이미지 표시 */}
                                    <Image
                                        src={imageUrl}
                                        alt={`Thumbnail ${slotIndex + 1}`}
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                    {/* X 버튼 (우측 상단) */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveImage(slotIndex);
                                        }}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-smooth shadow-md"
                                        aria-label="이미지 삭제"
                                    >
                                        ×
                                    </button>
                                </>
                            ) : isUploading ? (
                                // 업로드 중 스피너
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            ) : (
                                // 빈 슬롯 ([+] 아이콘)
                                <div className="absolute inset-0 flex items-center justify-center text-text-secondary">
                                    <svg
                                        className="w-8 h-8"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* 안내 텍스트 */}
            <p className="text-xs text-text-secondary">
                이미지를 드래그하거나 클릭하여 선택 (PNG, JPG, GIF, WebP 최대 5MB, 최대 {maxImages}개)
            </p>

            {/* 에러 메시지 */}
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}
