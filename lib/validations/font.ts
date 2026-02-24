import { z } from 'zod';

/**
 * 폰트 추가 폼 Validation Schema
 * 다운로드 URL은 선택 사항으로 변경
 */
export const fontFormSchema = z.object({
    // 기본 정보
    name: z.string().min(1, '폰트 이름을 입력해주세요').max(100, '폰트 이름은 100자 이하여야 합니다'),
    designer: z.string().min(1, '디자이너를 입력해주세요').max(100, '디자이너는 100자 이하여야 합니다'),
    foundry: z.string().max(100, '제작사는 100자 이하여야 합니다').optional(),

    // URL (다운로드 URL은 선택 사항)
    downloadUrl: z.string().url('올바른 URL을 입력해주세요').optional().or(z.literal('')),
    officialUrl: z.string().url('올바른 URL을 입력해주세요').optional().or(z.literal('')),

    // 분류
    category: z.enum(['gothic', 'myeongjo', 'handwriting', 'display', 'dingbat', 'other'], {
        required_error: '카테고리를 선택해주세요'
    }),
    license: z.enum(['free', 'commercial', 'personal', 'ofl', 'apache', 'unknown'], {
        required_error: '라이선스를 선택해주세요'
    }),
    tags: z.array(z.string()),

    // 파일 형식 & 굵기
    englishName: z.string().max(100, '영문명은 100자 이하여야 합니다').optional(),
    fontType: z.enum(['otf_ttf', 'otf', 'ttf']).optional(),
    weightCount: z.number().int().min(1, '1 이상의 숫자를 입력해주세요').max(99).optional(),

    // 설명
    description: z.string().max(500, '설명은 500자 이하여야 합니다').optional(),
    usageNotes: z.string().max(500, '사용 노트는 500자 이하여야 합니다').optional(),

    // 이미지
    thumbnailUrl: z.string().url('올바른 URL을 입력해주세요').optional().nullable().or(z.literal('')),

    // 웹 폰트 코드 스니펫
    webFontLinkEmbed: z.string().max(2000).optional(),
    webFontCssClass: z.string().max(2000).optional(),
    webFontImportCode: z.string().max(2000).optional(),
});

export type FontFormData = z.infer<typeof fontFormSchema>;

/**
 * 카테고리 옵션
 */
export const categoryOptions = [
    { value: 'gothic', label: '고딕(Sans)' },
    { value: 'myeongjo', label: '명조(Serif)' },
    { value: 'handwriting', label: '손글씨' },
    { value: 'display', label: '디스플레이(Display)' },
    { value: 'dingbat', label: '딩벳' },
    { value: 'other', label: '기타' },
] as const;

/**
 * 라이선스 옵션
 */
export const licenseOptions = [
    { value: 'ofl', label: 'OFL' },
    { value: 'free', label: '무료' },
    { value: 'personal', label: '개인 사용' },
    { value: 'commercial', label: '상업용' },
    { value: 'unknown', label: '알 수 없음' },
] as const;

/**
 * 파일 형식 옵션
 */
export const fontTypeOptions = [
    { value: 'otf_ttf', label: 'OTF / TTF' },
    { value: 'otf', label: 'OTF' },
    { value: 'ttf', label: 'TTF' },
] as const;
