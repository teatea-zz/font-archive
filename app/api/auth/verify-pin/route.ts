import { NextResponse } from 'next/server';
import { verifyPinCode, generateAuthToken } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const { pin } = await request.json();

        // PIN 검증
        if (verifyPinCode(pin)) {
            // 세션 쿠키 생성 (7일 유효) - async function으로 변경
            const token = await generateAuthToken();
            const response = NextResponse.json({ success: true });

            // 디버깅: 생성된 토큰 확인
            console.log('✅ PIN 검증 성공');
            console.log('🔑 생성된 JWT 토큰 (jose):', token.substring(0, 20) + '...');

            response.cookies.set({
                name: 'auth-session',
                value: token,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax', // 'strict'는 localhost에서 문제 발생 가능
                maxAge: 60 * 60 * 24 * 7, // 7일
                path: '/',
            });

            console.log('🍪 쿠키 설정 완료: auth-session');

            return response;
        }

        // PIN 불일치
        console.log('❌ PIN 검증 실패:', pin);
        return NextResponse.json(
            { success: false, message: 'Invalid PIN' },
            { status: 401 }
        );
    } catch (error) {
        console.error('❌ 서버 에러:', error);
        return NextResponse.json(
            { success: false, message: 'Server error' },
            { status: 500 }
        );
    }
}
