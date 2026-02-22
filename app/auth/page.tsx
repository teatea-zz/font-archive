'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AuthPage() {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleKeyPress = (num: number) => {
        if (pin.length < 4) {
            const newPin = pin + num.toString();
            setPin(newPin);

            // 4자리가 되면 자동으로 검증
            if (newPin.length === 4) {
                verifyPin(newPin);
            }
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
            const response = await fetch('/api/auth/verify-pin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pin: pinCode }),
            });

            const data = await response.json();

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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-background">
            <div className="w-full max-w-md px-8">
                {/* 로고 및 환영 메시지 */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-4">
                        <Image
                            src="/images/logo_text_L.svg"
                            alt="폰트 아카이브"
                            width={240}
                            height={56}
                            priority
                        />
                    </div>
                    <p className="text-text-secondary text-lg">
                        개인 폰트 아카이브에 오신 것을 환영합니다
                    </p>
                </div>

                {/* PIN 입력 표시 */}
                <div className="mb-8">
                    <div className="flex justify-center gap-4 mb-2">
                        {[0, 1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`w-16 h-16 rounded-lg border-2 flex items-center justify-center text-2xl ${pin.length > i
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border bg-background-secondary'
                                    }`}
                            >
                                {pin.length > i && '●'}
                            </div>
                        ))}
                    </div>
                    {error && (
                        <p className="text-center text-red-500 text-sm mt-4">{error}</p>
                    )}
                </div>

                {/* 숫자 키패드 */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                            key={num}
                            onClick={() => handleKeyPress(num)}
                            disabled={loading}
                            className="h-16 rounded-lg bg-background-secondary hover:bg-border transition-smooth text-xl font-semibold disabled:opacity-50"
                        >
                            {num}
                        </button>
                    ))}
                    <div /> {/* Empty space */}
                    <button
                        onClick={() => handleKeyPress(0)}
                        disabled={loading}
                        className="h-16 rounded-lg bg-background-secondary hover:bg-border transition-smooth text-xl font-semibold disabled:opacity-50"
                    >
                        0
                    </button>
                    <button
                        onClick={handleBackspace}
                        disabled={loading || pin.length === 0}
                        className="h-16 rounded-lg bg-background-secondary hover:bg-border transition-smooth text-xl font-semibold disabled:opacity-30"
                    >
                        ←
                    </button>
                </div>

                {/* 안내 문구 */}
                <p className="text-center text-text-secondary text-sm">
                    4자리 PIN 코드를 입력하세요
                </p>
            </div>
        </div>
    );
}
