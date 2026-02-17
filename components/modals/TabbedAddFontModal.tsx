'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fontFormSchema, type FontFormData, categoryOptions, licenseOptions } from '@/lib/validations/font';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import TagInput from '@/components/forms/TagInput';
import MultiImageUpload from '@/components/forms/MultiImageUpload';

interface TabbedAddFontModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editFont?: import('@/types/font').Font | null; // Font 타입 (편집 모드)
}

type Tab = 'basic' | 'detail';

export default function TabbedAddFontModal({ isOpen, onClose, onSuccess, editFont = null }: TabbedAddFontModalProps) {
    const isEditMode = !!editFont;
    const [activeTab, setActiveTab] = useState<Tab>('basic');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset,
    } = useForm<FontFormData>({
        resolver: zodResolver(fontFormSchema),
        defaultValues: {
            tags: [],
            category: 'gothic',
            license: 'ofl',
        },
    });

    const tags = watch('tags');

    // 이미지 배열을 위한 별도 상태
    const [images, setImages] = useState<string[]>([]);

    // editFont가 변경되면 form 데이터 초기화
    useEffect(() => {
        if (editFont) {
            // 모든 필드 값 설정
            reset({
                name: editFont.name || '',
                designer: editFont.designer || '',
                foundry: editFont.foundry || '',
                downloadUrl: editFont.downloadUrl || '',
                officialUrl: editFont.officialUrl || '',
                category: editFont.category || 'gothic',
                license: editFont.license || 'ofl',
                tags: editFont.tags || [],
                description: editFont.description || '',
                usageNotes: editFont.usageNotes || '',
            });
            // 이미지도 설정
            setImages(editFont.imageUrls || []);
        } else {
            // 추가 모드일 때는 초기화
            reset({
                tags: [],
                category: 'gothic',
                license: 'ofl',
            });
            setImages([]);
        }
    }, [editFont, reset]);

    // 탭 전환 시 스크롤을 맨 위로 리셋
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = 0;
        }
    }, [activeTab]);

    const onSubmit = async (data: FontFormData) => {
        setSubmitting(true);
        setError(null);

        try {
            // snake_case로 변환 (API 형식)
            const requestData = {
                name: data.name,
                designer: data.designer,
                foundry: data.foundry || null,
                download_url: data.downloadUrl || null,
                official_url: data.officialUrl || null,
                category: data.category,
                license: data.license,
                tags: data.tags,
                description: data.description || null,
                usage_notes: data.usageNotes || null,
                image_urls: images, // 다중 이미지 배열
                thumbnail_url: images[0] || null, // 첫 번째 이미지를 썸네일로
            };

            const url = isEditMode ? `/api/fonts/${editFont.id}` : '/api/fonts';
            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                console.log('✅ 폰트 추가 성공');
                reset();
                setImages([]);
                setActiveTab('basic');
                onSuccess();
            } else {
                const errorData = await response.json();
                setError(errorData.error || '폰트 추가에 실패했습니다');
            }
        } catch (err) {
            console.error('폰트 추가 에러:', err);
            setError('폰트 추가 중 오류가 발생했습니다');
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!submitting) {
            reset();
            setImages([]);
            setActiveTab('basic');
            setError(null);
            onClose();
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose} maxWidth="2xl" showCloseButton={false}>
            <div className="flex flex-col h-[85dvh]">
                {/* Fixed Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
                    <h2 className="text-xl font-bold text-text-primary">
                        {isEditMode ? '폰트 편집' : '폰트 추가'}
                    </h2>
                    {/* X 닫기 아이콘 (PC) */}
                    <button
                        onClick={handleClose}
                        className="text-text-secondary hover:text-text-primary transition-smooth p-1"
                        aria-label="닫기"
                    >
                        <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Fixed Tabs */}
                <div className="flex border-b border-border px-6 flex-shrink-0">
                    <button
                        type="button"
                        onClick={() => setActiveTab('basic')}
                        className={`px-6 py-3 font-medium transition-smooth ${activeTab === 'basic'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-text-secondary hover:text-text-primary'
                            }`}
                    >
                        기본 정보
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('detail')}
                        className={`px-6 py-3 font-medium transition-smooth ${activeTab === 'detail'
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-text-secondary hover:text-text-primary'
                            }`}
                    >
                        상세 정보
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
                    {/* Scrollable Tab Content */}
                    <div ref={contentRef} className="flex-1 overflow-y-auto p-6">
                        {activeTab === 'basic' && (
                            <div className="space-y-4">
                                {/* 폰트 이름 */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-1">
                                        폰트 이름 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        {...register('name')}
                                        className="w-full rounded-lg border border-border bg-white px-4 py-2 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                                        placeholder="예: Noto Sans KR"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                                    )}
                                </div>

                                {/* 디자이너 */}
                                <div>
                                    <label htmlFor="designer" className="block text-sm font-medium text-text-primary mb-1">
                                        디자이너 <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="designer"
                                        type="text"
                                        {...register('designer')}
                                        className="w-full rounded-lg border border-border bg-white px-4 py-2 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                                        placeholder="예: Google Fonts"
                                    />
                                    {errors.designer && (
                                        <p className="mt-1 text-sm text-red-600">{errors.designer.message}</p>
                                    )}
                                </div>

                                {/* 제작사 */}
                                <div>
                                    <label htmlFor="foundry" className="block text-sm font-medium text-text-primary mb-1">
                                        제작사 (선택)
                                    </label>
                                    <input
                                        id="foundry"
                                        type="text"
                                        {...register('foundry')}
                                        className="w-full rounded-lg border border-border bg-white px-4 py-2 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                                        placeholder="예: Google"
                                    />
                                </div>

                                {/* 다운로드 URL */}
                                <div>
                                    <label htmlFor="downloadUrl" className="block text-sm font-medium text-text-primary mb-1">
                                        다운로드 URL (선택)
                                    </label>
                                    <input
                                        id="downloadUrl"
                                        type="url"
                                        {...register('downloadUrl')}
                                        className="w-full rounded-lg border border-border bg-white px-4 py-2 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                                        placeholder="https://fonts.google.com/..."
                                    />
                                    {errors.downloadUrl && (
                                        <p className="mt-1 text-sm text-red-600">{errors.downloadUrl.message}</p>
                                    )}
                                </div>

                                {/* 공식 URL */}
                                <div>
                                    <label htmlFor="officialUrl" className="block text-sm font-medium text-text-primary mb-1">
                                        공식 URL (선택)
                                    </label>
                                    <input
                                        id="officialUrl"
                                        type="url"
                                        {...register('officialUrl')}
                                        className="w-full rounded-lg border border-border bg-white px-4 py-2 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                                        placeholder="https://..."
                                    />
                                    {errors.officialUrl && (
                                        <p className="mt-1 text-sm text-red-600">{errors.officialUrl.message}</p>
                                    )}
                                </div>

                                {/* 카테고리 */}
                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-text-primary mb-1">
                                        카테고리 <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="category"
                                        {...register('category')}
                                        className="w-full rounded-lg border border-border bg-white px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                                    >
                                        {categoryOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                                    )}
                                </div>

                                {/* 라이선스 */}
                                <div>
                                    <label htmlFor="license" className="block text-sm font-medium text-text-primary mb-1">
                                        라이선스 <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="license"
                                        {...register('license')}
                                        className="w-full rounded-lg border border-border bg-white px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                                    >
                                        {licenseOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.license && (
                                        <p className="mt-1 text-sm text-red-600">{errors.license.message}</p>
                                    )}
                                </div>

                                {/* 태그 */}
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-1">
                                        태그
                                    </label>
                                    <TagInput
                                        tags={tags}
                                        onTagsChange={(newTags) => setValue('tags', newTags)}
                                        placeholder="태그 입력 후 Enter (예: 한글, 무료)"
                                    />
                                </div>
                            </div>
                        )}

                        {activeTab === 'detail' && (
                            <div className="space-y-4">
                                {/* 썸네일 이미지 */}
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-2">
                                        썸네일 이미지 (선택)
                                    </label>
                                    <MultiImageUpload
                                        images={images}
                                        onImagesChange={setImages}
                                        maxImages={5}
                                    />
                                </div>

                                {/* 폰트 설명 */}
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-text-primary mb-1">
                                        폰트 설명 (선택)
                                    </label>
                                    <textarea
                                        id="description"
                                        {...register('description')}
                                        rows={4}
                                        className="w-full rounded-lg border border-border bg-white px-4 py-2 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth resize-none"
                                        placeholder="폰트에 대한 설명을 입력해주세요"
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                                    )}
                                </div>

                                {/* 사용 노트 */}
                                <div>
                                    <label htmlFor="usageNotes" className="block text-sm font-medium text-text-primary mb-1">
                                        사용 노트 (선택)
                                    </label>
                                    <textarea
                                        id="usageNotes"
                                        {...register('usageNotes')}
                                        rows={4}
                                        className="w-full rounded-lg border border-border bg-white px-4 py-2 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth resize-none"
                                        placeholder="어떤 프로젝트에 사용했는지, 사용 팁 등"
                                    />
                                    {errors.usageNotes && (
                                        <p className="mt-1 text-sm text-red-600">{errors.usageNotes.message}</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Fixed Footer */}
                    <div
                        className="border-t border-border px-6 py-4 flex-shrink-0"
                        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
                    >
                        {/* 에러 메시지 */}
                        {error && (
                            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        {/* 버튼 (반응형) */}
                        {/* PC: 우측 정렬, 모바일: 양측 정렬 + 전체 너비 */}
                        <div className="flex gap-3 justify-between sm:justify-end sm:gap-3">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleClose}
                                disabled={submitting}
                                className="w-full sm:w-auto"
                            >
                                취소
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={submitting}
                                className="w-full sm:w-auto"
                            >
                                {submitting
                                    ? (isEditMode ? '수정 중...' : '추가 중...')
                                    : (isEditMode ? '수정 완료' : '폰트 추가')
                                }
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
