import { create } from 'zustand';
import type { Font } from '@/types/font';

interface CompareStore {
    selectedFonts: Font[];
    addFont: (font: Font) => void;
    removeFont: (fontId: string) => void;
    clearAll: () => void;
    isSelected: (fontId: string) => boolean;
    toggleFont: (font: Font) => void;
}

export const useCompareStore = create<CompareStore>((set, get) => ({
    selectedFonts: [],

    addFont: (font) => {
        const { selectedFonts } = get();

        // 중복 체크
        if (selectedFonts.some(f => f.id === font.id)) {
            return;
        }

        // 최대 3개 제한
        if (selectedFonts.length >= 3) {
            return;
        }

        set({ selectedFonts: [...selectedFonts, font] });
    },

    removeFont: (fontId) => {
        set((state) => ({
            selectedFonts: state.selectedFonts.filter(f => f.id !== fontId)
        }));
    },

    clearAll: () => {
        set({ selectedFonts: [] });
    },

    isSelected: (fontId) => {
        return get().selectedFonts.some(f => f.id === fontId);
    },

    toggleFont: (font) => {
        const { isSelected, addFont, removeFont } = get();
        if (isSelected(font.id)) {
            removeFont(font.id);
        } else {
            addFont(font);
        }
    },
}));
