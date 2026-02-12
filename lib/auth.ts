import { SignJWT, jwtVerify } from 'jose';

// JWT Secret을 Uint8Array로 변환 (Edge Runtime 호환)
const JWT_SECRET_STRING = process.env.JWT_SECRET || 'any-random-string-here-for-development';
const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

// 디버깅: 환경 변수 확인
if (!process.env.JWT_SECRET) {
    console.warn('⚠️ JWT_SECRET 환경 변수가 설정되지 않았습니다. Fallback 사용');
} else {
    console.log('✅ JWT_SECRET 로드됨 (Edge Runtime 호환)');
}

/**
 * JWT 토큰 생성 (Edge Runtime 호환)
 */
export async function generateAuthToken(): Promise<string> {
    console.log('🔑 토큰 생성 중 (jose 라이브러리)');

    const token = await new SignJWT({
        authenticated: true,
        timestamp: Date.now(),
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d') // 7일 유효
        .sign(JWT_SECRET);

    console.log('✅ 토큰 생성 완료:', token.substring(0, 20) + '...');
    return token;
}

/**
 * JWT 토큰 검증 (Edge Runtime 호환)
 */
export async function verifyAuthToken(token: string): Promise<boolean> {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        console.log('✅ 토큰 검증 성공:', payload);
        return true;
    } catch (error) {
        console.error('❌ 토큰 검증 실패:', error instanceof Error ? error.message : error);
        return false;
    }
}

/**
 * PIN 코드 검증
 */
export function verifyPinCode(inputPin: string): boolean {
    const CORRECT_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN;

    if (!CORRECT_PIN) {
        console.error('❌ NEXT_PUBLIC_ADMIN_PIN 환경 변수가 설정되지 않았습니다');
        return false;
    }

    return inputPin === CORRECT_PIN;
}
