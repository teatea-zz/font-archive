'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { fontFormSchema, type FontFormData, categoryOptions, licenseOptions, fontTypeOptions } from '@/lib/validations/font';
import Modal from '@/components/ui/Modal';
import TagInput from '@/components/forms/TagInput';
import MultiImageUpload from '@/components/forms/MultiImageUpload';

interface TabbedAddFontModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editFont?: import('@/types/font').Font | null;
}

type Tab = 'basic' | 'detail' | 'webfont';

/** 입력 필드 공통 스타일 */
const inputClass = "w-full p-3 bg-white rounded-md outline outline-1 outline-offset-[-1px] outline-gray-300 text-gray-900 text-base font-normal font-sans leading-4 placeholder:text-gray-400 focus:outline-primary focus:outline-2 transition-colors";
const urlInputClass = "w-full p-3 bg-white rounded-md outline outline-1 outline-offset-[-1px] outline-gray-300 text-gray-900 text-xs font-normal font-mono leading-4 placeholder:text-gray-400 focus:outline-primary focus:outline-2 transition-colors";
const selectClass = "w-full p-3 bg-white rounded-md outline outline-1 outline-offset-[-1px] outline-gray-300 text-gray-900 text-base font-normal font-sans leading-4 focus:outline-primary focus:outline-2 transition-colors";
const textareaClass = "w-full p-3 bg-white rounded-md outline outline-1 outline-offset-[-1px] outline-gray-300 text-gray-900 text-sm font-normal font-mono leading-4 placeholder:text-gray-400 focus:outline-primary focus:outline-2 transition-colors resize-none";

/** 필드 라벨 컴포넌트 */
function FieldLabel({ label, required = false }: { label: string; required?: boolean }) {
    return (
        <div className="inline-flex items-center gap-0.5">
            <span className="text-gray-700 text-xs font-normal font-sans leading-4">{label}</span>
            {required && <span className="text-red-500 text-sm font-normal font-mono leading-4">*</span>}
        </div>
    );
}

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
            fontType: 'otf_ttf',
        },
    });

    const tags = watch('tags');
    const [images, setImages] = useState<string[]>([]);

    // editFont가 변경되면 form 데이터 초기화
    useEffect(() => {
        if (editFont) {
            reset({
                name: editFont.name || '',
                englishName: editFont.englishName || '',
                designer: editFont.designer || '',
                foundry: editFont.foundry || '',
                downloadUrl: editFont.downloadUrl || '',
                officialUrl: editFont.officialUrl || '',
                category: editFont.category || 'gothic',
                license: editFont.license || 'ofl',
                fontType: editFont.fontType || undefined,
                weightCount: editFont.weightCount || undefined,
                tags: editFont.tags || [],
                description: editFont.description || '',
                usageNotes: editFont.usageNotes || '',
                webFontLinkEmbed: editFont.webFontSnippets?.linkEmbed || '',
                webFontCssClass: editFont.webFontSnippets?.cssClass || '',
                webFontImportCode: editFont.webFontSnippets?.importCode || '',
            });
            setImages(editFont.imageUrls || []);
        } else {
            reset({
                tags: [],
                category: 'gothic',
                license: 'ofl',
            });
            setImages([]);
        }
    }, [editFont, reset]);

    // 탭 전환 시 스크롤 맨 위로
    useEffect(() => {
        if (contentRef.current) {
            contentRef.current.scrollTop = 0;
        }
    }, [activeTab]);

    const onSubmit = async (data: FontFormData) => {
        setSubmitting(true);
        setError(null);

        try {
            // web_font_snippets: 모든 값이 비어있으면 null로 저장
            const hasWebFontSnippets = data.webFontLinkEmbed || data.webFontCssClass || data.webFontImportCode;
            const webFontSnippets = hasWebFontSnippets ? {
                link_embed: data.webFontLinkEmbed || null,
                css_class: data.webFontCssClass || null,
                import_code: data.webFontImportCode || null,
            } : null;

            const requestData = {
                name: data.name,
                english_name: data.englishName || null,
                designer: data.designer,
                foundry: data.foundry || null,
                download_url: data.downloadUrl || null,
                official_url: data.officialUrl || null,
                category: data.category,
                license: data.license,
                font_type: data.fontType || null,
                weight_count: data.weightCount || null,
                tags: data.tags,
                description: data.description || null,
                usage_notes: data.usageNotes || null,
                image_urls: images,
                thumbnail_url: images[0] || null,
                web_font_snippets: webFontSnippets,
            };

            const url = isEditMode ? `/api/fonts/${editFont.id}` : '/api/fonts';
            const method = isEditMode ? 'PUT' : 'POST';

            console.log(`[FontModal] ${method} ${url}`, JSON.stringify(requestData, null, 2));

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestData),
            });

            if (response.ok) {
                reset();
                setImages([]);
                setActiveTab('basic');
                onSuccess();
            } else {
                const errorData = await response.json();
                console.error(`[FontModal] ${method} 실패:`, errorData);
                setError(errorData.error || '폰트 저장에 실패했습니다');
            }
        } catch (err) {
            console.error('폰트 저장 에러:', err);
            setError('폰트 저장 중 오류가 발생했습니다');
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

    const tabs = [
        { key: 'basic' as const, label: '기본 정보' },
        { key: 'detail' as const, label: '상세 정보' },
        { key: 'webfont' as const, label: '웹 폰트 사용' },
    ];

    return (
        <Modal isOpen={isOpen} onClose={handleClose} maxWidth="2xl" showCloseButton={false}>
            <div className="w-96 md:w-[672px] max-w-full bg-white rounded-xl flex flex-col max-h-[85dvh]">
                {/* 헤더: 제목 + 닫기 버튼 */}
                <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
                    <div className="flex justify-between items-center">
                        <h2 className="text-gray-900 text-lg font-semibold font-sans leading-7 line-clamp-1">
                            {isEditMode ? '폰트 편집' : '폰트 추가'}
                        </h2>
                        <button
                            onClick={handleClose}
                            className="w-6 h-6 flex items-center justify-center text-gray-900 hover:text-gray-500 transition-colors"
                            aria-label="닫기"
                        >
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L11 11M1 11L11 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 min-h-0">
                    {/* 탭 바 + 콘텐츠 */}
                    <div ref={contentRef} className="px-6 pt-1.5 pb-3 flex flex-col gap-5 overflow-y-auto flex-1">
                        {/* 탭 바 */}
                        <div className="border-b border-gray-200 flex flex-shrink-0">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => setActiveTab(tab.key)}
                                    className={`flex-1 px-6 py-2 text-center text-sm font-sans leading-5 transition-colors ${activeTab === tab.key
                                        ? 'border-b-2 border-primary text-primary font-semibold'
                                        : 'text-gray-500 font-normal hover:text-gray-700'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* 탭1: 기본 정보 */}
                        {activeTab === 'basic' && (
                            <div className="flex flex-col gap-5">
                                {/* 폰트이름 + 영문명 */}
                                <div className="flex flex-col md:flex-row gap-3 md:items-end">
                                    <div className="flex-1 flex flex-col gap-2">
                                        <FieldLabel label="폰트이름" required />
                                        <input
                                            type="text"
                                            {...register('name')}
                                            className={inputClass}
                                            placeholder="예: 본고딕"
                                        />
                                        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                                    </div>
                                    <div className="w-full md:w-48 flex flex-col gap-2">
                                        <FieldLabel label="영문명" />
                                        <input
                                            type="text"
                                            {...register('englishName')}
                                            className={inputClass}
                                            placeholder="예: Noto Sans"
                                        />
                                    </div>
                                </div>

                                {/* 디자이너 + 제작사 */}
                                <div className="flex flex-col md:flex-row gap-3">
                                    <div className="flex-1 flex flex-col gap-2">
                                        <FieldLabel label="디자이너" required />
                                        <input
                                            type="text"
                                            {...register('designer')}
                                            className={inputClass}
                                            placeholder="예: GoogleXAdobe"
                                        />
                                        {errors.designer && <p className="text-red-500 text-xs">{errors.designer.message}</p>}
                                    </div>
                                    <div className="w-full md:w-48 flex flex-col gap-2">
                                        <FieldLabel label="제작사" />
                                        <input
                                            type="text"
                                            {...register('foundry')}
                                            className={inputClass}
                                            placeholder="예: GoogleXAdobe"
                                        />
                                    </div>
                                </div>

                                {/* 공식 URL */}
                                <div className="flex flex-col gap-2">
                                    <FieldLabel label="공식 URL" />
                                    <input
                                        type="url"
                                        {...register('officialUrl')}
                                        className={urlInputClass}
                                        placeholder="https://fonts.google.com/specimen/Diphylleia"
                                    />
                                    {errors.officialUrl && <p className="text-red-500 text-xs">{errors.officialUrl.message}</p>}
                                </div>

                                {/* 다운로드 URL + 굵기 */}
                                <div className="flex flex-col md:flex-row gap-3">
                                    <div className="flex-1 flex flex-col gap-2">
                                        <FieldLabel label="다운로드 URL" />
                                        <input
                                            type="url"
                                            {...register('downloadUrl')}
                                            className={urlInputClass}
                                            placeholder="http://"
                                        />
                                        {errors.downloadUrl && <p className="text-red-500 text-xs">{errors.downloadUrl.message}</p>}
                                    </div>
                                    <div className="w-full md:w-48 flex flex-col gap-2">
                                        <FieldLabel label="굵기" required />
                                        <input
                                            type="number"
                                            {...register('weightCount', { valueAsNumber: true })}
                                            className={inputClass}
                                            placeholder="예: 9종(숫자만 입력)"
                                            min="1"
                                            max="99"
                                        />
                                        {errors.weightCount && <p className="text-red-500 text-xs">{errors.weightCount.message}</p>}
                                    </div>
                                </div>

                                {/* 카테고리 + 파일 형식 + 라이선스 */}
                                <div className="flex flex-col md:flex-row gap-3">
                                    <div className="flex-1 flex flex-col gap-2">
                                        <FieldLabel label="카테고리" required />
                                        <select {...register('category')} className={selectClass}>
                                            {categoryOptions.map((opt) => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                        {errors.category && <p className="text-red-500 text-xs">{errors.category.message}</p>}
                                    </div>
                                    <div className="flex-1 flex flex-col gap-2">
                                        <FieldLabel label="파일 형식" required />
                                        <select {...register('fontType')} className={selectClass}>
                                            {fontTypeOptions.map((opt) => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex-1 flex flex-col gap-2">
                                        <FieldLabel label="라이선스" required />
                                        <select {...register('license')} className={selectClass}>
                                            {licenseOptions.map((opt) => (
                                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                                            ))}
                                        </select>
                                        {errors.license && <p className="text-red-500 text-xs">{errors.license.message}</p>}
                                    </div>
                                </div>

                                {/* 태그 */}
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-col gap-2">
                                        <FieldLabel label="태그" />
                                        <TagInput
                                            tags={tags}
                                            onTagsChange={(newTags) => setValue('tags', newTags)}
                                            placeholder="태그 입력 후 Enter (예: 제목용, 본문용)"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 탭2: 상세 정보 */}
                        {activeTab === 'detail' && (
                            <div className="flex flex-col gap-5">

                                {/* 이미지 업로드 */}
                                <div className="flex flex-col gap-2">
                                    <FieldLabel label="썸네일 이미지" />
                                    <MultiImageUpload
                                        images={images}
                                        onImagesChange={setImages}
                                        maxImages={5}
                                    />
                                </div>

                                {/* 폰트 설명 */}
                                <div className="flex flex-col gap-2">
                                    <FieldLabel label="폰트 설명" />
                                    <textarea
                                        {...register('description')}
                                        rows={5}
                                        className={`${textareaClass} font-sans`}
                                        placeholder="폰트에 대한 설명을 입력해주세요"
                                    />
                                    {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
                                </div>

                                {/* 사용 노트 */}
                                <div className="flex flex-col gap-2">
                                    <FieldLabel label="사용 노트" />
                                    <textarea
                                        {...register('usageNotes')}
                                        rows={5}
                                        className={`${textareaClass} font-sans`}
                                        placeholder="어떤 프로젝트에 사용했는지, 사용 팁 등"
                                    />
                                    {errors.usageNotes && <p className="text-red-500 text-xs">{errors.usageNotes.message}</p>}
                                </div>
                            </div>
                        )}

                        {/* 탭3: 웹 폰트 사용 */}
                        {activeTab === 'webfont' && (
                            <div className="flex flex-col gap-5">
                                {/* <link> embed */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col gap-1">
                                        <FieldLabel label="<link>" />
                                        <span className="text-orange-400 text-xs font-normal font-sans leading-4">
                                            Embed code in the &lt;head&gt; of your html
                                        </span>
                                    </div>
                                    <textarea
                                        {...register('webFontLinkEmbed')}
                                        rows={5}
                                        className={textareaClass}
                                        placeholder='<link href="https://fonts.googleapis.com/..." rel="stylesheet">'
                                    />
                                </div>

                                {/* CSS class */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col gap-1">
                                        <FieldLabel label="<link>" />
                                        <span className="text-orange-400 text-xs font-normal font-sans leading-4">
                                            Font-family: CSS class
                                        </span>
                                    </div>
                                    <textarea
                                        {...register('webFontCssClass')}
                                        rows={5}
                                        className={textareaClass}
                                        placeholder={'.font-name {\n  font-family: "FontName", serif;\n  font-weight: 400;\n}'}
                                    />
                                </div>

                                {/* @import */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col gap-1">
                                        <FieldLabel label="<@import>" />
                                        <span className="text-orange-400 text-xs font-normal font-sans leading-4">
                                            Font-family: CSS class
                                        </span>
                                    </div>
                                    <textarea
                                        {...register('webFontImportCode')}
                                        rows={5}
                                        className={textareaClass}
                                        placeholder={"@import url('https://fonts.googleapis.com/...');"}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 하단: 에러 + 취소/추가 버튼 */}
                    <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0">
                        {error && (
                            <div className="mb-3 bg-red-50 border border-red-200 rounded-md p-3">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}
                        <div className="flex justify-end items-start gap-2 md:gap-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={submitting}
                                className="h-8 px-4 bg-gray-200 rounded-md flex items-center justify-center hover:bg-gray-300 transition-colors disabled:opacity-50"
                            >
                                <span className="text-gray-900 text-sm font-normal font-sans leading-5">취소</span>
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="h-8 px-4 bg-primary rounded-md flex items-center justify-center hover:bg-primary-hover transition-colors disabled:opacity-50"
                            >
                                <span className="text-white text-xs font-bold font-sans leading-4">
                                    {submitting
                                        ? (isEditMode ? '수정 중...' : '추가 중...')
                                        : (isEditMode ? '수정 완료' : '폰트 추가')
                                    }
                                </span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
