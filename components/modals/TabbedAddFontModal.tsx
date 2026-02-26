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
// 모달 내부용 기본 인풋/텍스트에리어 스타일
const baseInputClass = "w-full border border-gray-300 rounded-md px-3 py-[10px] bg-white text-gray-900 text-sm font-normal font-sans leading-tight focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-gray-400";
const textareaClass = "w-full border border-gray-300 rounded-md px-3 py-3 bg-white text-gray-900 text-sm font-medium font-sans leading-6 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-gray-400 resize-none";
const webfontTextareaClass = "w-full border border-gray-300 rounded-md px-3 py-3 bg-white text-gray-900 text-xs font-mono leading-4 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-gray-400 resize-none";

/** 필드 라벨 컴포넌트 */
function FieldLabel({ label, required = false }: { label: string; required?: boolean }) {
    return (
        <div className="inline-flex items-center gap-0.5">
            <span className="text-gray-700 text-xs font-normal font-sans leading-4">{label}</span>
            {required && <span className="text-red-500 text-sm font-normal font-mono leading-4">*</span>}
        </div>
    );
}

/** 커스텀 셀렉트 드롭다운 (FilterBar 정렬 드롭다운 스타일) */
function CustomSelect({
    value,
    onChange,
    options,
    isOpen,
    onToggle,
    dropdownId,
}: {
    value: string;
    onChange: (val: string) => void;
    options: readonly { value: string; label: string }[];
    isOpen: boolean;
    onToggle: (id: string) => void;
    dropdownId: string;
}) {
    const ref = React.useRef<HTMLDivElement>(null);
    const currentLabel = options.find((o) => o.value === value)?.label ?? '';

    React.useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                if (isOpen) onToggle('');
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen, onToggle]);

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => onToggle(isOpen ? '' : dropdownId)}
                className={`
                    flex items-center justify-between w-full px-3 h-[42px]
                    text-sm text-[#121212] font-normal font-sans
                    transition-all duration-150
                    ${isOpen
                        ? 'bg-white border border-[#D6D6D6] rounded-b-xl rounded-t-none'
                        : 'bg-[#F5F5F5] rounded-xl border border-transparent hover:border-[#D6D6D6]'
                    }
                `}
            >
                <span>{currentLabel}</span>
                {isOpen ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                        <path d="M12 10L8 6L4 10" stroke="#1E1E1E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                ) : (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                        <path d="M12 6L8 10L4 6" stroke="#1E1E1E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                )}
            </button>

            {isOpen && (
                <div className="absolute left-0 right-0 bottom-full z-50 flex flex-col">
                    {options.map((option, index) => {
                        const isSelected = value === option.value;
                        const isFirst = index === 0;

                        return (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    onToggle('');
                                }}
                                className={`
                                    flex items-center justify-between px-3 h-9 text-sm text-[#121212] whitespace-nowrap
                                    transition-colors duration-100
                                    bg-white border-l border-r border-t border-[#D6D6D6]
                                    hover:bg-[#FAF7F5]
                                    ${isFirst ? 'rounded-t-xl' : ''}
                                `}
                            >
                                <span>{option.label}</span>
                                {isSelected && (
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 ml-2">
                                        <path d="M13.2698 3.35258C13.6273 3.61258 13.7073 4.11258 13.4473 4.47008L7.04727 13.2701C6.90977 13.4601 6.69727 13.5776 6.46227 13.5976C6.22727 13.6176 5.99977 13.5301 5.83477 13.3651L2.63477 10.1651C2.32227 9.85257 2.32227 9.34508 2.63477 9.03258C2.94727 8.72008 3.45477 8.72008 3.76727 9.03258L6.30477 11.5701L12.1548 3.52758C12.4148 3.17008 12.9148 3.09008 13.2723 3.35008L13.2698 3.35258Z" fill="#121212" />
                                    </svg>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default function TabbedAddFontModal({ isOpen, onClose, onSuccess, editFont = null }: TabbedAddFontModalProps) {
    const isEditMode = !!editFont;
    const [activeTab, setActiveTab] = useState<Tab>('basic');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [openDropdown, setOpenDropdown] = useState<string>('');

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
        { key: 'webfont' as const, label: '웹 폰트' },
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
                                    className={`flex-1 px-2 sm:px-6 py-2 text-center text-sm font-sans leading-5 transition-colors whitespace-nowrap ${activeTab === tab.key
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
                                        <CustomSelect
                                            value={watch('category')}
                                            onChange={(val) => setValue('category', val as FontFormData['category'])}
                                            options={categoryOptions}
                                            isOpen={openDropdown === 'category'}
                                            onToggle={setOpenDropdown}
                                            dropdownId="category"
                                        />
                                        {errors.category && <p className="text-red-500 text-xs">{errors.category.message}</p>}
                                    </div>
                                    <div className="flex-1 flex flex-col gap-2">
                                        <FieldLabel label="파일 형식" required />
                                        <CustomSelect
                                            value={watch('fontType') || 'otf_ttf'}
                                            onChange={(val) => setValue('fontType', val as FontFormData['fontType'])}
                                            options={fontTypeOptions}
                                            isOpen={openDropdown === 'fontType'}
                                            onToggle={setOpenDropdown}
                                            dropdownId="fontType"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col gap-2">
                                        <FieldLabel label="라이선스" required />
                                        <CustomSelect
                                            value={watch('license')}
                                            onChange={(val) => setValue('license', val as FontFormData['license'])}
                                            options={licenseOptions}
                                            isOpen={openDropdown === 'license'}
                                            onToggle={setOpenDropdown}
                                            dropdownId="license"
                                        />
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
                                        className={`${textareaClass} font-sans leading-6`}
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
                                        className={`${textareaClass} font-sans leading-6`}
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
                                        className={webfontTextareaClass}
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
                                        className={webfontTextareaClass}
                                        placeholder={'.font-name {\n  font-family: "FontName", serif;\n  font-weight: 400;\n}'}
                                    />
                                </div>

                                {/* @import */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex flex-col gap-1">
                                        <FieldLabel label="<@import>" />
                                        <span className="text-orange-400 text-xs font-normal font-sans leading-4">
                                            Embed code in the &lt;head&gt; of your html
                                        </span>
                                    </div>
                                    <textarea
                                        {...register('webFontImportCode')}
                                        rows={5}
                                        className={webfontTextareaClass}
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
                                <span className="text-white text-sm font-bold font-sans leading-4">
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
