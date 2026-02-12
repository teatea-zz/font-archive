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
    { params }: { params: { id: string } }
) {
    try {
        const cookieStore = await cookies();
        const authSession = cookieStore.get('auth-session');
        if (!authSession || !(await verifyAuthToken(authSession.value))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

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
    { params }: { params: { id: string } }
) {
    try {
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
 * 폰트 삭제
 */
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const cookieStore = await cookies();
        const authSession = cookieStore.get('auth-session');
        if (!authSession || !(await verifyAuthToken(authSession.value))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

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
 * 즐겨찾기 토글 전용 (Phase 5+)
 */
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const cookieStore = await cookies();
        const authSession = cookieStore.get('auth-session');
        if (!authSession || !(await verifyAuthToken(authSession.value))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { is_favorite } = await request.json();

        const { data, error } = await supabaseAdmin
            .from('fonts')
            .update({ is_favorite })
            .eq('id', params.id)
            .select()
            .single();

        if (error) {
            console.error('즐겨찾기 토글 실패:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        console.log('✅ 즐겨찾기 토글:', params.id, '→', is_favorite);
        return NextResponse.json(data);
    } catch (error) {
        console.error('API 에러:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
