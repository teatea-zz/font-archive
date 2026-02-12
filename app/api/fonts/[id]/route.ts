import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAuthToken } from '@/lib/auth';

/**
 * GET /api/fonts/[id]
 * 특정 폰트 조회
 */
export async function GET(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const cookieStore = await cookies();
        const authSession = cookieStore.get('auth-session');
        if (!authSession || !(await verifyAuthToken(authSession.value))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const params = await context.params;
        const { data, error } = await supabaseAdmin
            .from('fonts')
            .select('*')
            .eq('id', params.id)
            .single();

        if (error) {
            console.error('폰트 조회 실패:', error);
            return NextResponse.json({ error: error.message }, { status: 404 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('API 에러:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/fonts/[id]
 * 폰트 정보 수정
 */
export async function PUT(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const cookieStore = await cookies();
        const authSession = cookieStore.get('auth-session');
        if (!authSession || !(await verifyAuthToken(authSession.value))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        const { data, error } = await supabaseAdmin
            .from('fonts')
            .update(body)
            .eq('id', params.id)
            .select()
            .single();

        if (error) {
            console.error('폰트 수정 실패:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        console.log('✅ 폰트 수정 성공:', params.id);
        return NextResponse.json(data);
    } catch (error) {
        console.error('API 에러:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/fonts/[id]
 * 폰트 삭제 (Storage 이미지도 함께 삭제)
 */
export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const cookieStore = await cookies();
        const authSession = cookieStore.get('auth-session');
        if (!authSession || !(await verifyAuthToken(authSession.value))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. 이미지 URL 가져오기
        const { data: font } = await supabaseAdmin
            .from('fonts')
            .select('image_urls')
            .eq('id', params.id)
            .single();

        // 2. Storage에서 이미지 삭제
        if (font?.image_urls && Array.isArray(font.image_urls) && font.image_urls.length > 0) {
            const fileNames = (font.image_urls as string[]).map((url: string) => {
                // URL에서 파일명 추출
                const parts = url.split('/');
                return parts[parts.length - 1];
            });

            const { error: storageError } = await supabaseAdmin.storage
                .from('font-images')
                .remove(fileNames);

            if (storageError) {
                console.warn('⚠️ Storage 삭제 실패 (계속 진행):', storageError);
            } else {
                console.log('🗑️ Storage 이미지 삭제:', fileNames.length, '개');
            }
        }

        // 3. DB에서 폰트 삭제
        const { error } = await supabaseAdmin
            .from('fonts')
            .delete()
            .eq('id', params.id);

        if (error) {
            console.error('폰트 삭제 실패:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        console.log('✅ 폰트 삭제 성공:', params.id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('API 에러:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

/**
 * PATCH /api/fonts/[id]
 * 즐겨찾기 토글 (자동 토글)
 */
export async function PATCH(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const params = await context.params;
        const cookieStore = await cookies();
        const authSession = cookieStore.get('auth-session');
        if (!authSession || !(await verifyAuthToken(authSession.value))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 현재 즐겨찾기 상태 가져오기
        const { data: currentFont } = await supabaseAdmin
            .from('fonts')
            .select('is_favorite')
            .eq('id', params.id)
            .single();

        // 토글
        const newFavoriteStatus = !currentFont?.is_favorite;

        const { data, error } = await supabaseAdmin
            .from('fonts')
            .update({ is_favorite: newFavoriteStatus })
            .eq('id', params.id)
            .select()
            .single();

        if (error) {
            console.error('즐겨찾기 토글 실패:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        console.log('✅ 즐겨찾기 토글:', params.id, '→', newFavoriteStatus);
        return NextResponse.json(data);
    } catch (error) {
        console.error('API 에러:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
