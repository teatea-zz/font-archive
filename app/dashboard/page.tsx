'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Font, SortBy } from '@/types/font';
import Header from '@/components/layout/Header';
import FilterBar from '@/components/layout/FilterBar';
import FontGrid from '@/components/fonts/FontGrid';
import TabbedAddFontModal from '@/components/modals/TabbedAddFontModal';
import FontDetailModal from '@/components/modals/FontDetailModal';
import ConfirmDialog from '@/components/modals/ConfirmDialog';
import FloatingAddButton from '@/components/ui/FloatingAddButton';
import CompareBar from '@/components/comparison/CompareBar';
import ComparisonOverlay from '@/components/modals/ComparisonOverlay';
import { useCompareStore } from '@/store/compareStore';

export default function DashboardPage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isComparisonOpen, setIsComparisonOpen] = useState(false);

    const [fonts, setFonts] = useState<Font[]>([]);
    const [selectedFont, setSelectedFont] = useState<Font | null>(null);
    const [editingFont, setEditingFont] = useState<Font | null>(null);

    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState<SortBy>('latest');

    const { selectedFonts, clearAll } = useCompareStore();

    // API에서 폰트 목록 가져오기
    const fetchFonts = async () => {
        try {
            const response = await fetch('/api/fonts');
            if (response.ok) {
                const data = await response.json();
                // DB 응답 타입 정의
                interface DatabaseFont {
                    id: string;
                    name: string;
                    designer: string;
                    foundry: string | null;
                    download_url: string | null;
                    official_url: string | null;
                    category: string;
                    license: string;
                    tags: string[];
                    description: string | null;
                    usage_notes: string | null;
                    image_urls: string[];
                    thumbnail_url: string | null;
                    created_at: string;
                    updated_at: string;
                    is_favorite: boolean;
                    google_fonts_data: unknown;
                }

                // DB 컬럼명(snake_case)을 Font 타입(camelCase)으로 변환
                const transformedData: Font[] = data.map((item: DatabaseFont) => ({
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

    // 모달에서 폰트 추가/수정 성공 시
    const handleFontAdded = () => {
        setIsAddModalOpen(false);
        setEditingFont(null);
        fetchFonts(); // 폰트 목록 새로고침
    };

    // 상세보기
    const handleViewDetail = (font: Font) => {
        setSelectedFont(font);
        setIsDetailModalOpen(true);
    };

    // 편집
    const handleEdit = (font: Font) => {
        setEditingFont(font);  // selectedFont를 editingFont로 복사
        setIsAddModalOpen(true);
        setIsDetailModalOpen(false);
    };

    // 삭제 클릭
    const handleDeleteClick = (font: Font) => {
        setSelectedFont(font);
        setIsDetailModalOpen(false);
        setIsDeleteDialogOpen(true);
    };

    // 삭제 확인
    const handleDeleteConfirm = async () => {
        if (!selectedFont) return;

        try {
            const response = await fetch(`/api/fonts/${selectedFont.id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setIsDeleteDialogOpen(false);
                setSelectedFont(null);
                fetchFonts();
            } else {
                console.error('폰트 삭제 실패:', response.status);
                alert('폰트 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('폰트 삭제 에러:', error);
            alert('폰트 삭제 중 오류가 발생했습니다.');
        }
    };

    // 즐겨찾기 토글
    const handleToggleFavorite = async (fontId: string) => {
        // Optimistic UI
        setFonts(fonts.map(f =>
            f.id === fontId ? { ...f, isFavorite: !f.isFavorite } : f
        ));

        // 상세 모달이 열려있으면 선택된 폰트도 업데이트
        if (selectedFont?.id === fontId) {
            setSelectedFont({
                ...selectedFont,
                isFavorite: !selectedFont.isFavorite
            });
        }

        try {
            const response = await fetch(`/api/fonts/${fontId}`, {
                method: 'PATCH',
            });

            if (!response.ok) {
                // 실패 시 롤백
                setFonts(fonts.map(f =>
                    f.id === fontId ? { ...f, isFavorite: !f.isFavorite } : f
                ));
                if (selectedFont?.id === fontId) {
                    setSelectedFont({
                        ...selectedFont,
                        isFavorite: !selectedFont.isFavorite
                    });
                }
            }
        } catch (error) {
            console.error('즐겨찾기 토글 에러:', error);
        }
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

    // 배경 클릭 시 선택 해제 핸들러
    const handleBackgroundClick = (e: React.MouseEvent) => {
        if (selectedFonts.length === 0) return;

        const target = e.target as HTMLElement;
        const isInteractive = (element: HTMLElement) => {
            return element.closest('.group') || // FontCard
                element.closest('.fixed.bottom-0') || // CompareBar
                element.closest('button') || // Buttons
                element.closest('[role="dialog"]'); // Modals
        };

        if (target && !isInteractive(target)) {
            clearAll();
        }
    };

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
        <div
            className="min-h-screen bg-background"
            onClick={handleBackgroundClick}
        >
            <Header
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onAddClick={() => setIsAddModalOpen(true)}
            />

            <FilterBar
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                sortBy={sortBy}
                onSortChange={setSortBy}
            />

            <main className="max-w-7xl mx-auto px-6 pt-6 pb-10">
                <div className="mb-6">
                    <p className="text-text-secondary">
                        {filteredAndSortedFonts.length}개의 폰트
                        {searchQuery && ` (검색: "${searchQuery}")`}
                    </p>
                </div>

                <FontGrid
                    fonts={filteredAndSortedFonts}
                    onViewDetail={handleViewDetail}
                    onToggleFavorite={handleToggleFavorite}
                />
            </main>

            <TabbedAddFontModal
                isOpen={isAddModalOpen}
                onClose={() => {
                    setIsAddModalOpen(false);
                    setEditingFont(null);
                }}
                onSuccess={handleFontAdded}
                editFont={editingFont}
            />

            <FontDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                font={selectedFont}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onToggleFavorite={handleToggleFavorite}
            />

            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="폰트 삭제"
                message="정말로 이 폰트를 삭제하시겠습니까?"
                highlightText={selectedFont?.name}
                confirmText="삭제"
                cancelText="취소"
                variant="danger"
            />

            {/* 비교하기 바 (클릭 전파 방지) */}
            <div onClick={(e) => e.stopPropagation()}>
                <CompareBar onOpenOverlay={() => setIsComparisonOpen(true)} />
            </div>

            <ComparisonOverlay
                isOpen={isComparisonOpen}
                onClose={() => setIsComparisonOpen(false)}
                onToggleFavorite={handleToggleFavorite}
            />

            {/* 모바일 플로팅 추가 버튼 (선택된 폰트 없을 때만 표시) */}
            {selectedFonts.length === 0 && (
                <div onClick={(e) => e.stopPropagation()}>
                    <FloatingAddButton onClick={() => setIsAddModalOpen(true)} />
                </div>
            )}
        </div>
    );
}
