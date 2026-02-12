import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAuthToken } from '@/lib/auth';

/**
 * GET /api/fonts
 * 전체 폰트 목록 조회 (최신순)
 */
export async function GET() {
    try {
        // 세션 검증
        const cookieStore = await cookies();
        const authSession = cookieStore.get('auth-session');
        if (!authSession || !(await verifyAuthToken(authSession.value))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Supabase에서 폰트 목록 조회
        const { data, error } = await supabaseAdmin
            .from('fonts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('폰트 조회 실패:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
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
 * POST /api/fonts
 * 새로운 폰트 추가
 */
export async function POST(request: Request) {
    try {
        // 세션 검증
        const cookieStore = await cookies();
        const authSession = cookieStore.get('auth-session');
        if (!authSession || !(await verifyAuthToken(authSession.value))) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Supabase에 폰트 추가
        const { data, error } = await supabaseAdmin
            .from('fonts')
            .insert([body])
            .select()
            .single();

        if (error) {
            console.error('폰트 추가 실패:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        console.log('✅ 폰트 추가 성공:', data.id);
        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error('API 에러:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
