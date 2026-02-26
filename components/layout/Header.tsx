'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Input from '../ui/Input';

interface HeaderProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onAddClick?: () => void;
}

export default function Header({ searchQuery, onSearchChange, onAddClick }: HeaderProps) {
    const router = useRouter();
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push('/auth');
        } catch (error) {
            console.error('로그아웃 실패:', error);
        }
    };

    return (
        <header className={`sticky top-0 z-[100] transition-all duration-200 ${isScrolled ? 'bg-white/90 backdrop-blur-lg border-b border-border' : 'bg-white border-b border-transparent'}`}>
            {/* max-w 1280px, padding 0 320px (CSS_header 기준 — max-w-7xl + px-6으로 반응형 처리) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 lg:gap-[105px]">

                {/* 로고 영역 — CSS_header: logo width 140px */}
                <div
                    className="cursor-pointer hover:opacity-80 transition-opacity shrink-0"
                    onClick={() => router.push('/dashboard')}
                >
                    <Image
                        src="/images/logo_mobile.svg"
                        alt="폰트 아카이브"
                        width={32}
                        height={32}
                        className="block md:hidden"
                        priority
                    />
                    <Image
                        src="/images/logo_text.svg"
                        alt="폰트 아카이브"
                        width={140}
                        height={18}
                        className="hidden md:block"
                        priority
                    />
                </div>

                {/* 오른쪽 nav 영역 — space-between 안에서 flex */}
                {/* CSS_header: nav width 533px, height 42px, gap 16px */}
                <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-end ml-0 sm:ml-auto">

                    {/* 검색바 — CSS_header: width 262px, height 42px */}
                    <div className="flex-1 md:flex-none md:w-[262px] max-w-[262px] min-w-[130px]">
                        <Input
                            type="text"
                            placeholder="폰트를 검색해 주세요"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            onClear={() => onSearchChange('')}
                            inputHeight="h-[42px] md:h-9"
                            icon={
                                /* Search Size=24 (mobile) -> 16 (desktop), gray/500 */
                                <svg viewBox="0 0 16 16" fill="none" className="w-6 h-6 md:w-4 md:h-4">
                                    <path d="M14 14L10 10M11.3333 6.66667C11.3333 7.2795 11.2126 7.88634 10.9781 8.45252C10.7436 9.01871 10.3998 9.53316 9.9665 9.9665C9.53316 10.3998 9.01871 10.7436 8.45252 10.9781C7.88634 11.2126 7.2795 11.3333 6.66667 11.3333C6.05383 11.3333 5.447 11.2126 4.88081 10.9781C4.31462 10.7436 3.80018 10.3998 3.36683 9.9665C2.93349 9.53316 2.58975 9.01871 2.35523 8.45252C2.12071 7.88634 2 7.2795 2 6.66667C2 5.42899 2.49167 4.242 3.36683 3.36683C4.242 2.49167 5.42899 2 6.66667 2C7.90434 2 9.09133 2.49167 9.9665 3.36683C10.8417 4.242 11.3333 5.42899 11.3333 6.66667Z" stroke="#6E6E6E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            }
                        />
                    </div>

                    {/* Btn 그룹 — gap 8px */}
                    <div className="flex items-center gap-2">

                        {/* 폰트 추가 버튼 — 검색 바로 다음
                            Enabled : bg #FF5429
                            Hover   : bg #FF6240
                            Active  : bg #DA411B + ring
                            Focus   : bg #FF5429 + ring
                        */}
                        <button
                            onClick={onAddClick}
                            className="hidden md:flex items-center justify-center px-4 h-[42px] md:h-9 rounded-md
                                text-white text-sm font-bold border-0 whitespace-nowrap
                                transition-all duration-150
                                bg-[#FF5429]
                                hover:bg-[#FF6240]
                                active:bg-[#DA411B] active:shadow-[0_0_0_3px_rgba(255,84,41,0.2)]
                                focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(255,84,41,0.2)]"
                        >
                            폰트 추가
                        </button>

                        {/* 즐겨찾기 — h-9(36px)
                            Hover  : bg #F5F5F5 + border #D6D6D6
                            Active : bg #EDEDED
                            Focus  : bg #F5F5F5 + border #D6D6D6 (hover와 동일)
                        */}
                        <button
                            onClick={() => router.push('/favorites')}
                            className="flex items-center gap-1.5 px-2 md:px-3 h-[42px] md:h-9 rounded-lg
                                border border-transparent text-[#121212]
                                transition-all duration-150
                                hover:bg-[#F5F5F5] hover:border-[#D6D6D6]
                                active:bg-[#EDEDED]
                                focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_#E5E7EB]"
                            aria-label="즐겨찾기"
                        >
                            {/* Heart Size=24 (mobile) -> 16 (desktop) */}
                            <svg viewBox="0 0 20 20" fill="none" className="shrink-0 w-6 h-6 md:w-4 md:h-4">
                                <path d="M13.8408 3.7002C15.7509 3.7003 17.2997 5.24906 17.2998 7.15918V7.24023C17.2998 8.73594 16.3466 10.4674 14.9883 12.1172C13.8203 13.5357 12.434 14.798 11.3613 15.6592L10.9219 16.0029C10.6659 16.1962 10.3432 16.2998 10 16.2998C9.6514 16.2998 9.32847 16.1969 9.08105 16.0059V16.0049L9.07812 16.0029L8.63867 15.6592C7.566 14.798 6.17968 13.5357 5.01172 12.1172C3.65338 10.4674 2.7002 8.73594 2.7002 7.24023V7.15918C2.7003 5.24906 4.24906 3.7003 6.15918 3.7002C7.26943 3.7002 8.31457 4.23321 8.96387 5.13184L8.96484 5.13281L9.43359 5.7793L10 6.56152L10.5664 5.7793L11.0352 5.13281L11.0361 5.13184C11.6854 4.23321 12.7306 3.7002 13.8408 3.7002Z" stroke="#1E1E1E" strokeWidth="1.6" />
                            </svg>
                            <span className="hidden lg:inline text-sm font-medium">즐겨찾기</span>
                        </button>

                        {/* 로그아웃 — 동일 스타일 */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 px-2 md:px-3 h-[42px] md:h-9 rounded-lg
                                border border-transparent text-[#121212]
                                transition-all duration-150
                                hover:bg-[#F5F5F5] hover:border-[#D6D6D6]
                                active:bg-[#EDEDED]
                                focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_#E5E7EB]"
                            aria-label="로그아웃"
                        >
                            {/* Logout Size=24 (mobile) -> 16 (desktop) */}
                            <svg viewBox="0 0 16 16" fill="none" className="shrink-0 w-6 h-6 md:w-4 md:h-4">
                                <path d="M11.3333 10.6667L14 8.00008M14 8.00008L11.3333 5.33341M14 8.00008H4.66667M8.66667 10.6667V11.3334C8.66667 11.8638 8.45595 12.3726 8.08088 12.7476C7.70581 13.1227 7.1971 13.3334 6.66667 13.3334H4C3.46957 13.3334 2.96086 13.1227 2.58579 12.7476C2.21071 12.3726 2 11.8638 2 11.3334V4.66675C2 4.13632 2.21071 3.62761 2.58579 3.25253C2.96086 2.87746 3.46957 2.66675 4 2.66675H6.66667C7.1971 2.66675 7.70581 2.87746 8.08088 3.25253C8.45595 3.62761 8.66667 4.13632 8.66667 4.66675V5.33341" stroke="#1E1E1E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="hidden lg:inline text-sm font-medium">로그아웃</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
