'use client';

import React, { useState } from 'react';

interface TagInputProps {
    tags: string[];
    onTagsChange: (tags: string[]) => void;
    placeholder?: string;
}

export default function TagInput({ tags, onTagsChange, placeholder = '태그 입력 후 Enter' }: TagInputProps) {
    const [input, setInput] = useState('');

    const handleAddTag = () => {
        const trimmedInput = input.trim();
        if (trimmedInput && !tags.includes(trimmedInput)) {
            onTagsChange([...tags, trimmedInput]);
            setInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        onTagsChange(tags.filter(tag => tag !== tagToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    return (
        <div>
            {/* 입력 필드 */}
            <div className="relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full rounded-lg border border-border bg-white px-4 py-2 text-text-primary placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
                />
                {input.trim() && (
                    <button
                        type="button"
                        onClick={handleAddTag}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm text-primary hover:bg-primary hover:text-white rounded transition-smooth"
                    >
                        추가
                    </button>
                )}
            </div>

            {/* 태그 목록 */}
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                    {tags.map((tag) => (
                        <div
                            key={tag}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-background-secondary text-text-secondary border border-border"
                        >
                            <span>#{tag}</span>
                            <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-1 text-text-secondary hover:text-text-primary transition-smooth"
                                aria-label={`${tag} 태그 삭제`}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
