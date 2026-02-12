import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function HomePage() {
    // 세션 쿠키 확인
    const cookieStore = await cookies();
    const authSession = cookieStore.get('auth-session');

    // 세션이 있으면 대시보드로, 없으면 인증 페이지로 리다이렉트
    if (authSession) {
        redirect('/dashboard');
    } else {
        redirect('/auth');
    }
}
