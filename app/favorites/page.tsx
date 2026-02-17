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
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useCompareStore } from '@/store/compareStore';

export default function FavoritesPage() {
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
                // 즐겨찾기만 필터링 (API에서 필터링 지원하면 좋겠지만 일단 클라이언트에서)
                setFonts(transformedData.filter((font: Font) => font.isFavorite));
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

    const handleFontAdded = () => {
        setIsAddModalOpen(false);
        setEditingFont(null);
        fetchFonts();
    };

    const handleViewDetail = (font: Font) => {
        setSelectedFont(font);
        setIsDetailModalOpen(true);
    };

    const handleEdit = (font: Font) => {
        setEditingFont(font);
        setIsAddModalOpen(true);
        setIsDetailModalOpen(false);
    };

    const handleDeleteClick = (font: Font) => {
        setSelectedFont(font);
        setIsDetailModalOpen(false);
        setIsDeleteDialogOpen(true);
    };

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
                alert('폰트 삭제에 실패했습니다.');
            }
        } catch (error) {
            console.error('폰트 삭제 에러:', error);
            alert('폰트 삭제 중 오류가 발생했습니다.');
        }
    };

    const handleToggleFavorite = async (fontId: string) => {
        // Optimistic UI: 즐겨찾기 해제 시 목록에서 제거됨
        // 하지만 즉시 사라지면 당황스러울 수 있으므로, 
        // 여기서는 상태만 변경하고 필터링은 하지 않거나,
        // 아니면 즉시 사라지게 할 수도 있음.
        // 기획의도: 즐겨찾기 페이지니까 해제하면 사라지는게 맞음.

        setFonts(fonts.filter(f => f.id !== fontId)); // 목록에서 즉시 제거

        if (selectedFont?.id === fontId) {
            setSelectedFont({ ...selectedFont, isFavorite: false });
        }

        try {
            const response = await fetch(`/api/fonts/${fontId}`, {
                method: 'PATCH',
            });
            if (!response.ok) {
                fetchFonts(); // 실패 시 원복 (재로딩)
            }
        } catch (error) {
            console.error('즐겨찾기 토글 에러:', error);
            fetchFonts();
        }
    };

    const filteredAndSortedFonts = useMemo(() => {
        let result = [...fonts];

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter((font) =>
                font.name.toLowerCase().includes(query) ||
                font.designer.toLowerCase().includes(query) ||
                font.tags.some((tag: string) => tag.toLowerCase().includes(query))
            );
        }

        if (selectedCategory !== 'all') {
            result = result.filter((font) => font.category === selectedCategory);
        }

        result.sort((a, b) => {
            switch (sortBy) {
                case 'name': return a.name.localeCompare(b.name);
                case 'designer': return a.designer.localeCompare(b.designer);
                case 'latest':
                default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
        });

        return result;
    }, [searchQuery, selectedCategory, sortBy, fonts]);

    const { selectedFonts, clearAll } = useCompareStore();

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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-text-secondary">즐겨찾기 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen bg-background"
            onClick={handleBackgroundClick}
        >
            <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} onAddClick={() => setIsAddModalOpen(true)} />

            <FilterBar selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} sortBy={sortBy} onSortChange={setSortBy} />

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="mb-6 flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-text-primary">⭐ 즐겨찾기</h1>
                    <span className="text-text-secondary">({filteredAndSortedFonts.length})</span>
                </div>

                {filteredAndSortedFonts.length > 0 ? (
                    <FontGrid
                        fonts={filteredAndSortedFonts}
                        onViewDetail={handleViewDetail}
                        onToggleFavorite={handleToggleFavorite}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-text-primary mb-2">즐겨찾기한 폰트가 없습니다</h3>
                        <p className="text-text-secondary mb-6">마음에 드는 폰트에 별표를 눌러보세요!</p>
                        <Link href="/dashboard">
                            <Button>모든 폰트 보러가기</Button>
                        </Link>
                    </div>
                )}
            </main>

            <TabbedAddFontModal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(false); setEditingFont(null); }} onSuccess={handleFontAdded} editFont={editingFont} />
            <FontDetailModal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} font={selectedFont} onEdit={handleEdit} onDelete={handleDeleteClick} onToggleFavorite={handleToggleFavorite} />
            <ConfirmDialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} onConfirm={handleDeleteConfirm} title="폰트 삭제" message="정말로 이 폰트를 삭제하시겠습니까?" highlightText={selectedFont?.name} confirmText="삭제" cancelText="취소" variant="danger" />

            <CompareBar onOpenOverlay={() => setIsComparisonOpen(true)} />
            <ComparisonOverlay isOpen={isComparisonOpen} onClose={() => setIsComparisonOpen(false)} onToggleFavorite={handleToggleFavorite} />

            <FloatingAddButton onClick={() => setIsAddModalOpen(true)} />
        </div>
    );
}
