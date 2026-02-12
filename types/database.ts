export type Database = {
    public: {
        Tables: {
            fonts: {
                Row: {
                    id: string;
                    name: string;
                    designer: string;
                    foundry: string | null;
                    download_url: string;
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
                    google_fonts_data: any | null;
                };
                Insert: Omit<Database['public']['Tables']['fonts']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['fonts']['Insert']>;
            };
        };
    };
};
