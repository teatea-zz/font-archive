/**
 * Supabase Storage Cleanup Script
 * 
 * DB의 fonts 테이블에 존재하지 않는 orphaned 이미지 파일을 
 * Storage에서 찾아서 삭제합니다.
 * 
 * 사용법: npx tsx scripts/cleanup-storage.ts
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// .env.local 파일 자동 로드 (보안 정보는 코드에 노출되지 않음)
config({ path: resolve(process.cwd(), '.env.local') });

// 환경 변수 검증
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Error: Missing required environment variables');
    console.error('');
    console.error('Please ensure .env.local contains:');
    console.error('  - NEXT_PUBLIC_SUPABASE_URL');
    console.error('  - SUPABASE_SERVICE_ROLE_KEY');
    console.error('');
    process.exit(1);
}

// Supabase 클라이언트 (Admin)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

async function cleanupOrphanedImages() {
    console.log('🧹 Starting storage cleanup...\n');

    try {
        // 1. DB에서 모든 폰트의 image_urls 가져오기
        const { data: fonts, error: fetchError } = await supabaseAdmin
            .from('fonts')
            .select('image_urls');

        if (fetchError) {
            console.error('❌ Error fetching fonts:', fetchError);
            return;
        }

        // 2. DB에 존재하는 모든 이미지 파일명 수집
        const usedImageFiles = new Set<string>();
        fonts?.forEach((font: any) => {
            if (font.image_urls && Array.isArray(font.image_urls)) {
                font.image_urls.forEach((url: string) => {
                    // URL에서 파일명 추출
                    const fileName = url.split('/').pop();
                    if (fileName) {
                        usedImageFiles.add(fileName);
                    }
                });
            }
        });

        console.log(`📚 Found ${usedImageFiles.size} images in DB\n`);

        // 3. Storage에서 모든 파일 목록 가져오기
        const { data: storageFiles, error: listError } = await supabaseAdmin.storage
            .from('font-images')
            .list();

        if (listError) {
            console.error('❌ Error listing storage files:', listError);
            return;
        }

        console.log(`📦 Found ${storageFiles?.length || 0} files in Storage\n`);

        // 4. orphaned 파일 찾기
        const orphanedFiles: string[] = [];
        storageFiles?.forEach((file) => {
            if (!usedImageFiles.has(file.name)) {
                orphanedFiles.push(file.name);
            }
        });

        console.log(`🗑️  Found ${orphanedFiles.length} orphaned files\n`);

        if (orphanedFiles.length === 0) {
            console.log('✅ No orphaned files to delete. Storage is clean!\n');
            return;
        }

        // 5. orphaned 파일 목록 출력
        console.log('Orphaned files:');
        orphanedFiles.forEach((file, index) => {
            console.log(`  ${index + 1}. ${file}`);
        });
        console.log('');

        // 6. Storage에서 삭제
        console.log('🗑️  Deleting orphaned files...\n');
        const { data: deleteData, error: deleteError } = await supabaseAdmin.storage
            .from('font-images')
            .remove(orphanedFiles);

        if (deleteError) {
            console.error('❌ Error deleting files:', deleteError);
            return;
        }

        console.log(`✅ Successfully deleted ${orphanedFiles.length} orphaned files!\n`);

        // 7. 결과 요약
        console.log('📊 Cleanup Summary:');
        console.log(`   - Total files in Storage: ${storageFiles?.length || 0}`);
        console.log(`   - Files in DB: ${usedImageFiles.size}`);
        console.log(`   - Orphaned files deleted: ${orphanedFiles.length}`);
        console.log(`   - Remaining files: ${(storageFiles?.length || 0) - orphanedFiles.length}\n`);

    } catch (error) {
        console.error('❌ Unexpected error:', error);
    }
}

// 실행
cleanupOrphanedImages().then(() => {
    console.log('🎉 Cleanup complete!');
    process.exit(0);
}).catch((error) => {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
});
