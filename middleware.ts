import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAuthToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
    const authSession = request.cookies.get('auth-session');
    const isAuthPage = request.nextUrl.pathname === '/auth';

    // 디버깅 로그
    console.log('🔍 Middleware (Edge Runtime):', {
        path: request.nextUrl.pathname,
        hasCookie: !!authSession,
    });

    // PIN 입력 페이지는 통과
    if (isAuthPage) {
        // 이미 세션이 있으면 dashboard로 리다이렉트
        if (authSession) {
            const isValid = await verifyAuthToken(authSession.value);
            if (isValid) {
                console.log('✅ 이미 인증됨, dashboard로 리다이렉트');
                return NextResponse.redirect(new URL('/dashboard', request.url));
            }
        }
        console.log('✅ Auth 페이지 접근 허용');
        return NextResponse.next();
    }

    // 세션이 없으면 스플래시 스크린으로 리다이렉트
    if (!authSession) {
        console.log('❌ 세션 없음, /auth로 리다이렉트');
        return NextResponse.redirect(new URL('/auth', request.url));
    }

    // 세션 검증 (JWT 토큰 검증)
    const isValid = await verifyAuthToken(authSession.value);
    console.log('🔐 토큰 검증 결과:', isValid);

    if (!isValid) {
        // 유효하지 않은 세션이면 쿠키 삭제 후 인증 페이지로
        console.log('❌ 유효하지 않은 토큰, /auth로 리다이렉트');
        const response = NextResponse.redirect(new URL('/auth', request.url));
        response.cookies.delete('auth-session');
        return response;
    }

    console.log('✅ 인증 성공, 페이지 접근 허용');
    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - api/auth/verify-pin (PIN 검증 API)
         * - _next/static (static files)
         * - _next/image (image optimization)
         * - favicon.ico
         * - robots.txt
         */
        '/((?!api/auth/verify-pin|_next/static|_next/image|favicon.ico|robots.txt).*)',
    ],
};
