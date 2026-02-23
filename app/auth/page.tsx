'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useIsLarge } from '@/hooks/useIsLarge';

export default function AuthPage() {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const isLarge = useIsLarge(); // Medium(M) vs Large(L) 비선형 분기

    const [imgError, setImgError] = useState(false);

    const handleKeyPress = (num: number) => {
        if (pin.length < 4) {
            const newPin = pin + num.toString();
            setPin(newPin);
            if (newPin.length === 4) verifyPin(newPin);
        }
    };

    const handleBackspace = () => {
        setPin(pin.slice(0, -1));
        setError('');
    };

    const verifyPin = async (pinCode: string) => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/auth/verify-pin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ pin: pinCode }),
            });
            const data = await res.json();
            if (data.success) {
                router.push('/dashboard');
            } else {
                setError('잘못된 PIN 코드입니다');
                setPin('');
            }
        } catch {
            setError('오류가 발생했습니다');
            setPin('');
        } finally {
            setLoading(false);
        }
    };

    /* ─── 사이즈 토큰 ────────────────────────────────────────
     *
     * 비선형 반응형:  M → L → M → L
     *   Large (L): 768–1366px (tablet/iPad) | 1920px+ (FHD/large desktop)
     *   Medium(M): <768px (mobile)          | 1367–1919px (laptop)
     *
     * ──────────────────────────────────────────────────────── */
    const sz = {
        // 외부 gap (profile ↔ content box)
        outerGap: isLarge ? 'gap-6' : 'gap-4',
        // 프로필 원형 크기
        profileSize: isLarge ? 'w-32 h-32' : 'w-20 h-20',
        // 콘텐츠 박스 너비
        boxWidth: isLarge ? 'w-[384px]' : 'w-[300px]',
        // 로고 + 서브텍스트 gap
        logoGap: isLarge ? 'gap-6' : 'gap-4',
        // 로고 높이
        logoHeight: isLarge ? 'h-[34px]' : 'h-[18px]',
        // 서브텍스트 크기
        subText: isLarge ? 'text-base' : 'text-sm',
        // PIN 인디케이터 gap
        pinGap: isLarge ? 'gap-4' : 'gap-3',
        // PIN 인디케이터 크기
        pinBox: isLarge ? 'w-16 h-16' : 'w-14 h-14',
        // PIN 내부 원 크기
        pinDot: isLarge ? 'w-5 h-5' : 'w-4 h-4',
        // PIN → 키패드 상단 margin
        pinMarginTop: isLarge ? 'mt-10' : 'mt-[45px]',
        // 로고영역 → PIN 상단 margin
        logoToPinMt: isLarge ? 'mt-10' : 'mt-[45px]',
        // 키패드 그리드 너비
        gridWidth: isLarge ? 'w-[320px]' : 'w-[272px]',
        // 숫자 버튼 높이
        btnHeight: isLarge ? 'h-16' : 'h-14',
        // 숫자 텍스트 크기
        numText: isLarge ? 'text-xl' : 'text-base',
    };

    return (
        <div
            className={`min-h-screen flex flex-col items-center justify-center ${sz.outerGap}`}
            style={{ background: 'linear-gradient(120.93deg, #FAF7F5 -0.73%, #FFFFFF 90.22%)' }}
        >
            {/* ── 1. 프로필 이미지 ── */}
            <div className={`rounded-full overflow-hidden shrink-0 bg-orange-100 flex items-center justify-center ${sz.profileSize}`}>
                {imgError ? (
                    <span className="text-orange-400 text-sm font-medium select-none">프로필</span>
                ) : (
                    <img
                        src="/images/profile_img.jpg"
                        alt="프로필"
                        className="w-full h-full object-cover"
                        onError={() => setImgError(true)}
                    />
                )}
            </div>

            {/* ── 2. 콘텐츠 박스 ── */}
            <div className={`${sz.boxWidth}`}>

                {/* 로고 + 서브텍스트 */}
                <div className={`flex flex-col items-center ${sz.logoGap}`}>
                    <img
                        src="/images/logo_text_L.svg"
                        alt="폰트 아카이브"
                        className={`${sz.logoHeight} w-auto`}
                    />
                    <p className={`text-[#121212] ${sz.subText} text-center leading-none`}>
                        디자인 영감을 위한 퍼스널 폰트 라이브러리
                    </p>
                </div>

                {/* ── PIN 인디케이터 ── */}
                <div className={`flex justify-center ${sz.pinGap} ${sz.logoToPinMt}`}>
                    {[0, 1, 2, 3].map((i) => {
                        const isFilled = pin.length > i;
                        return (
                            <div
                                key={i}
                                className={`rounded-xl transition-all duration-150 flex items-center justify-center ${sz.pinBox}`}
                                style={
                                    isFilled
                                        ? { background: 'rgba(255,84,41,0.08)', border: '2px solid #FF5429', borderRadius: '12px' }
                                        : { background: '#FAF7F5', border: '1px solid #E5D0C7', borderRadius: '12px' }
                                }
                            >
                                {isFilled && (
                                    <div className={`rounded-full bg-[#FF5429] ${sz.pinDot}`} />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* 에러 메시지 */}
                {error && (
                    <p className="text-center text-red-500 text-sm mt-3">{error}</p>
                )}

                {/* ── 숫자 키패드 ── */}
                <div className={`${sz.gridWidth} mx-auto grid grid-cols-3 gap-4 mt-10`}>
                    {/* 1~9 */}
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                            key={num}
                            onClick={() => handleKeyPress(num)}
                            disabled={loading || pin.length >= 4}
                            className={`flex items-center justify-center rounded-xl ${sz.btnHeight} bg-[#F6F1EE] hover:bg-[#E5D0C7] transition-colors duration-100 disabled:opacity-50 disabled:pointer-events-none`}
                            style={{ fontFamily: "'Roboto Mono', monospace", fontWeight: 500, color: '#1E1E1E' }}
                        >
                            <span className={sz.numText}>{num}</span>
                        </button>
                    ))}

                    {/* 빈 슬롯 */}
                    <div />

                    {/* 0 */}
                    <button
                        onClick={() => handleKeyPress(0)}
                        disabled={loading || pin.length >= 4}
                        className={`flex items-center justify-center rounded-xl ${sz.btnHeight} bg-[#F6F1EE] hover:bg-[#E5D0C7] transition-colors duration-100 disabled:opacity-50 disabled:pointer-events-none`}
                        style={{ fontFamily: "'Roboto Mono', monospace", fontWeight: 500, color: '#1E1E1E' }}
                    >
                        <span className={sz.numText}>0</span>
                    </button>

                    {/* Backspace ← */}
                    <button
                        onClick={handleBackspace}
                        disabled={loading || pin.length === 0}
                        className={`
                            flex items-center justify-center rounded-xl ${sz.btnHeight}
                            transition-colors duration-100
                            ${pin.length === 0
                                ? 'bg-[#F5F5F5] opacity-30 pointer-events-none'
                                : 'bg-[#E5D0C7] hover:bg-[#D4BAB0]'
                            }
                        `}
                        aria-label="지우기"
                    >
                        <span style={{
                            fontFamily: 'Pretendard, sans-serif',
                            fontWeight: 700,
                            fontSize: '20px',
                            lineHeight: '28px',
                            color: '#1E1E1E',
                        }}>←</span>
                    </button>
                </div>

                {/* 안내 문구 */}
                <p
                    className="text-center text-[#121212] text-sm mt-6"
                    style={{ fontFamily: 'Pretendard, sans-serif', fontWeight: 400 }}
                >
                    4자리 PIN 코드를 입력하세요
                </p>
            </div>
        </div>
    );
}
