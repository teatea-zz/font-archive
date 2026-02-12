'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface HeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onAddClick?: () => void;
}

export default function Header({ searchQuery, onSearchChange, onAddClick }: HeaderProps) {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
            });
            router.push('/auth');
        } catch (error) {
            console.error('로그아웃 실패:', error);
        }
    };

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-border">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
                {/* 로고 */}
                <div className="flex items-center gap-2">
                    <div className="text-2xl">🎨</div>
                    <h1 className="text-xl font-bold text-text-primary">
                        폰트 아카이브
                    </h1>
                </div>

                {/* 검색바 */}
                <div className="flex-1 max-w-xl">
                    <Input
                        type="text"
                        placeholder="폰트 검색 (이름, 디자이너, 태그)"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        onClear={() => onSearchChange('')}
                        icon={
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        }
                    />
                </div>

                {/* 액션 버튼들 */}
                <div className="flex items-center gap-2">
                    {/* 즐겨찾기 버튼 (Phase 4+) */}
                    <Button variant="ghost" className="hidden sm:flex">
                        <svg className="w-5 h-5 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        <span className="hidden md:inline">즐겨찾기</span>
                    </Button>

                    {/* 추가 버튼 */}
                    <Button
                        variant="primary"
                        className="hidden md:flex"
                        onClick={onAddClick}
                    >
                        <svg className="w-5 h-5 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="hidden md:inline">추가</span>
                    </Button>

                    {/* 로그아웃 버튼 */}
                    <Button variant="ghost" onClick={handleLogout}>
                        <svg className="w-5 h-5 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="hidden md:inline">로그아웃</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}
