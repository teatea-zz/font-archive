// Font 카테고리 타입 (한글 중심)
export type Category = 'gothic' | 'myeongjo' | 'handwriting' | 'display' | 'dingbat' | 'other';

// Font 라이선스 타입
export type License = 'free' | 'commercial' | 'personal' | 'ofl' | 'apache' | 'unknown';

// 정렬 옵션
export type SortBy = 'latest' | 'name' | 'designer';

export interface Font {
    id: string;
    name: string; // 폰트명
    designer: string; // 디자이너/제작자
    foundry?: string; // 폰트 제작사
    downloadUrl: string; // 공식 다운로드 링크
    officialUrl?: string; // 공식 페이지 URL

    category: Category;
    license: License;
    tags: string[]; // 사용자 커스텀 태그

    description?: string; // 폰트 설명
    usageNotes?: string; // 사용 노트

    // 이미지 관련
    imageUrls: string[]; // Supabase Storage URLs
    thumbnailUrl?: string; // 대표 썸네일

    // 메타데이터
    createdAt: string; // ISO timestamp
    updatedAt: string;
    isFavorite: boolean; // 즐겨찾기 여부

    // Google Fonts API 데이터
    googleFontsData?: {
        family: string;
        variants: string[];
        subsets: string[];
    };
}
