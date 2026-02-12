'use client';

import React from 'react';

interface FloatingAddButtonProps {
    onClick: () => void;
}

/**
 * 모바일 전용 플로팅 액션 버튼 (FAB)
 * - 우측 하단 고정
 * - 파란색 원형 배경 + 흰색 플러스 아이콘
 * - 모바일에서만 표시 (md 이상에서 숨김)
 */
export default function FloatingAddButton({ onClick }: FloatingAddButtonProps) {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 z-40 md:hidden w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
            aria-label="폰트 추가"
        >
            <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path d="M12 4v16m8-8H4" />
            </svg>
        </button>
    );
}
