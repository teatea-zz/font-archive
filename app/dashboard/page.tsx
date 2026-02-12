'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Font, SortBy } from '@/types/font';
import Header from '@/components/layout/Header';
import FilterBar from '@/components/layout/FilterBar';
import FontGrid from '@/components/fonts/FontGrid';
import TabbedAddFontModal from '@/components/modals/TabbedAddFontModal';
import FloatingAddButton from '@/components/ui/FloatingAddButton';

export default function DashboardPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [fonts, setFonts] = useState<Font[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState<SortBy>('latest');

    // API에서 폰트 목록 가져오기
    const fetchFonts = async () => {
        try {
            const response = await fetch('/api/fonts');
            if (response.ok) {
                const data = await response.json();
                // DB 컬럼명(snake_case)을 Font 타입(camelCase)으로 변환
                const transformedData = data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    designer: item.designer,
                    foundry: item.foundry,
                    downloadUrl: item.download_url,
                    officialUrl: item.official_url,
                    category: item.category,
                    license: item.license,
                    tags: item.tags,
                    description: item.description,
                    usageNotes: item.usage_notes,
                    imageUrls: item.image_urls,
                    thumbnailUrl: item.thumbnail_url,
                    createdAt: item.created_at,
                    updatedAt: item.updated_at,
                    isFavorite: item.is_favorite,
                    googleFontsData: item.google_fonts_data,
                }));
                setFonts(transformedData);
            } else {
                console.error('폰트 로드 실패:', response.status);
            }
        } catch (error) {
            console.error('폰트 로드 에러:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFonts();
    }, []);

    // 모달에서 폰트 추가 성공 시
    const handleFontAdded = () => {
        setIsAddModalOpen(false);
        fetchFonts(); // 폰트 목록 새로고침
    };

    // 검색, 필터링, 정렬 로직
    const filteredAndSortedFonts = useMemo(() => {
        let result = [...fonts];

        // 1. 검색 필터링
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter((font) => {
                return (
                    font.name.toLowerCase().includes(query) ||
                    font.designer.toLowerCase().includes(query) ||
                    font.tags.some((tag: string) => tag.toLowerCase().includes(query))
                );
            });
        }

        // 2. 카테고리 필터링
        if (selectedCategory !== 'all') {
            result = result.filter((font) => font.category === selectedCategory);
        }

        // 3. 정렬
        result.sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'designer':
                    return a.designer.localeCompare(b.designer);
                case 'latest':
                default:
                    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
        });

        return result;
    }, [searchQuery, selectedCategory, sortBy, fonts]);

    // 로딩 중 표시
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-text-secondary">폰트 데이터를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <Header
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onAddClick={() => setIsAddModalOpen(true)}
            />

            {/* FilterBar */}
            <FilterBar
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                sortBy={sortBy}
                onSortChange={setSortBy}
            />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* 결과 개수 표시 */}
                <div className="mb-6">
                    <p className="text-text-secondary">
                        {filteredAndSortedFonts.length}개의 폰트
                        {searchQuery && ` (검색: "${searchQuery}")`}
                    </p>
                </div>

                {/* 폰트 그리드 */}
                <FontGrid fonts={filteredAndSortedFonts} />
            </main>

            {/* 폰트 추가 모달 */}
            <TabbedAddFontModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={handleFontAdded}
            />

            {/* 모바일 플로팅 추가 버튼 */}
            <FloatingAddButton onClick={() => setIsAddModalOpen(true)} />
        </div>
    );
}
