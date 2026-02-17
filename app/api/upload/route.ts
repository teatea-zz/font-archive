import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAuthToken } from '@/lib/auth';

/**
 * POST /api/upload
 * 이미지를 Supabase Storage에 업로드
 */
export async function POST(request: Request) {
    try {
        // 세션 검증
        const cookieStore = await cookies();
        const authSession = cookieStore.get('auth-session');
        if (!authSession || !(await verifyAuthToken(authSession.value))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // 파일 검증 (이미지만 허용, 5MB 제한)
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: '이미지 파일만 업로드 가능합니다' }, { status: 400 });
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB
            return NextResponse.json({ error: '파일 크기는 5MB 이하여야 합니다' }, { status: 400 });
        }

        // 파일명 생성 (타임스탬프 + 원본 파일명)
        const timestamp = Date.now();
        const sanitizedFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${timestamp}-${sanitizedFilename}`;

        // File을 ArrayBuffer로 변환
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Supabase Storage에 업로드
        const { error } = await supabaseAdmin.storage
            .from('font-images')
            .upload(filename, buffer, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('이미지 업로드 실패:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        // Public URL 생성
        const { data: { publicUrl } } = supabaseAdmin.storage
            .from('font-images')
            .getPublicUrl(filename);

        console.log('✅ 이미지 업로드 성공:', filename);
        return NextResponse.json({ url: publicUrl, filename });
    } catch (error) {
        console.error('API 에러:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
