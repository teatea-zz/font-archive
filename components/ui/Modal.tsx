'use client';

import React, { useEffect, useRef } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
    showCloseButton?: boolean;
}

/**
 * 범용 모달 컴포넌트
 * - 다양한 컨텐츠를 담을 수 있는 재사용 가능한 모달
 * - mouseDown + mouseUp 모두 배경에서 일어날 때만 닫힘
 */
export default function Modal({
    isOpen,
    onClose,
    children,
    maxWidth = 'lg',
    showCloseButton = true
}: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const mouseDownOnOverlay = useRef(false);

    // ESC 키로 모달 닫기
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // 모달이 열릴 때 body 스크롤 방지 (모바일 최적화)
    useEffect(() => {
        if (isOpen) {
            // 현재 스크롤 위치 저장
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
        } else {
            // 스크롤 위치 복원
            const scrollY = document.body.style.top;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            if (scrollY) {
                window.scrollTo(0, parseInt(scrollY || '0') * -1);
            }
        }

        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // mouseDown이 배경에서 일어났는지 추적
    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.target === overlayRef.current) {
            mouseDownOnOverlay.current = true;
        } else {
            mouseDownOnOverlay.current = false;
        }
    };

    // mouseUp도 배경에서 일어났을 때만 닫기
    const handleMouseUp = (e: React.MouseEvent) => {
        if (e.target === overlayRef.current && mouseDownOnOverlay.current) {
            onClose();
        }
        mouseDownOnOverlay.current = false;
    };

    if (!isOpen) return null;

    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
    };

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75"
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
        >
            <div
                className={`relative bg-white rounded-lg shadow-xl ${maxWidthClasses[maxWidth]} w-full max-h-[90vh] overflow-hidden flex flex-col`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* 선택적 닫기 버튼 (우측 상단) */}
                {showCloseButton && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 text-text-secondary hover:text-text-primary transition-smooth p-1"
                        aria-label="닫기"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}

                {/* Content - 자식 컴포넌트가 전체 구조 제어 */}
                {children}
            </div>
        </div>
    );
}
