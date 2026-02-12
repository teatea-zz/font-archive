'use client';

import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    highlightText?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
}

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    highlightText,
    confirmText = '확인',
    cancelText = '취소',
    variant = 'danger'
}: ConfirmDialogProps) {
    // Variant에 따른 아이콘 색상
    const getIconColor = () => {
        switch (variant) {
            case 'danger':
                return 'text-red-500';
            case 'warning':
                return 'text-yellow-500';
            case 'info':
                return 'text-blue-500';
            default:
                return 'text-red-500';
        }
    };

    // Variant에 따른 버튼 색상
    const getButtonVariant = () => {
        switch (variant) {
            case 'danger':
                return 'bg-red-500 hover:bg-red-600';
            case 'warning':
                return 'bg-yellow-500 hover:bg-yellow-600';
            case 'info':
                return 'bg-blue-500 hover:bg-blue-600';
            default:
                return 'bg-red-500 hover:bg-red-600';
        }
    };

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} maxWidth="sm">
            <div className="p-6">
                {/* 제목 */}
                <h2 className="text-xl font-bold text-text-primary mb-6">
                    {title}
                </h2>

                {/* 아이콘 */}
                <div className={`flex justify-center mb-6 ${getIconColor()}`}>
                    <svg className="w-16 h-16" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                {/* 메시지 */}
                <div className="text-center mb-6">
                    <p className="text-text-primary mb-3">
                        {message}
                    </p>
                    {highlightText && (
                        <p className="text-lg font-bold text-text-primary">
                            "{highlightText}"
                        </p>
                    )}
                    <p className="text-sm text-text-secondary mt-3">
                        이 작업은 되돌릴 수 없습니다.
                    </p>
                </div>

                {/* 버튼 (반응형: 모바일 전체너비, PC 우측정렬) */}
                <div className="flex gap-3 justify-between sm:justify-end">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="w-full sm:w-auto"
                    >
                        {cancelText}
                    </Button>
                    <button
                        onClick={handleConfirm}
                        className={`px-4 py-2 rounded-lg text-white font-medium transition-smooth w-full sm:w-auto ${getButtonVariant()}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
