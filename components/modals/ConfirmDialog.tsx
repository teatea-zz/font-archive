'use client';

import React from 'react';
import Modal from '../ui/Modal';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    fontName?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
}

/**
 * 폰트 삭제 확인 다이얼로그
 * - 중앙 정렬 레이아웃: 휴지통 아이콘 → 폰트명 → 메시지
 * - Tailwind 디자인 레퍼런스 기준
 */
export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title = '폰트 삭제',
    fontName,
    message = '이 폰트를 삭제할까요?',
    confirmText = '삭제',
    cancelText = '취소',
}: ConfirmDialogProps) {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm" showCloseButton={false}>
            <div className="w-96 bg-white rounded-xl inline-flex flex-col">
                {/* 헤더: 제목 + 닫기 버튼 */}
                <div className="px-6 py-4 flex justify-between items-center">
                    <h2 className="text-gray-900 text-lg font-semibold font-sans leading-7 line-clamp-1">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="w-6 h-6 relative flex items-center justify-center text-gray-900 hover:text-gray-500 transition-colors"
                        aria-label="닫기"
                    >
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L11 11M1 11L11 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                    </button>
                </div>

                {/* 본문: 휴지통 아이콘 + 폰트명 + 메시지 */}
                <div className="px-6 py-5 flex flex-col items-center gap-3">
                    {/* 휴지통 아이콘 */}
                    <div className="w-14 h-14 flex items-center justify-center">
                        <svg width="40" height="44" viewBox="0 0 40 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* 쓰레기통 몸체 */}
                            <rect x="4" y="10" width="32" height="30" rx="3" fill="#D6D6D6" />
                            {/* 뚜껑 */}
                            <rect x="2" y="6" width="36" height="6" rx="2" fill="#D6D6D6" />
                            {/* 손잡이 */}
                            <rect x="14" y="2" width="12" height="6" rx="2" fill="none" stroke="#D6D6D6" strokeWidth="2" />
                            {/* 세로줄 */}
                            <line x1="13" y1="17" x2="13" y2="33" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            <line x1="20" y1="17" x2="20" y2="33" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            <line x1="27" y1="17" x2="27" y2="33" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            {/* 빨간 줄 (위험 강조) */}
                            <rect x="4" y="8" width="32" height="4" rx="1" fill="#EF4444" />
                        </svg>
                    </div>

                    {/* 폰트명 */}
                    {fontName && (
                        <p className="text-center text-gray-900 text-2xl font-medium font-sans leading-7">
                            {fontName}
                        </p>
                    )}

                    {/* 메시지 */}
                    <p className="text-center text-gray-500 text-base font-medium font-sans whitespace-pre-line">
                        {message}
                        {'\n'}이 작업은 되돌릴 수 없습니다.
                    </p>
                </div>

                {/* 하단: 취소 + 삭제 버튼 */}
                <div className="px-6 py-4 flex justify-end items-start gap-2">
                    <button
                        onClick={onClose}
                        className="h-8 px-4 bg-gray-200 rounded-md flex items-center justify-center hover:bg-gray-300 transition-colors"
                    >
                        <span className="text-center text-gray-900 text-sm font-normal font-sans leading-5">
                            {cancelText}
                        </span>
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="h-8 px-4 bg-red-500 rounded-md flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                        <span className="text-center text-white text-xs font-bold font-sans leading-4">
                            {confirmText}
                        </span>
                    </button>
                </div>
            </div>
        </Modal>
    );
}
