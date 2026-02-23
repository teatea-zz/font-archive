import { useEffect, useState } from 'react';

/**
 * 비선형 반응형 크기 훅 — M → L → M → L
 *
 * Large (true):
 *   - 768px ~ 1366px : 태블릿 / iPad (터치 타겟 최적화)
 *   - 1920px 이상    : FHD 및 대형 데스크탑 모니터
 *
 * Medium (false):
 *   - 768px 미만     : 모바일
 *   - 1367px ~ 1919px: 노트북 (13″ ~ 17″)
 */
export function useIsLarge(): boolean {
    const [isLarge, setIsLarge] = useState(false);

    useEffect(() => {
        const tablet = window.matchMedia('(min-width: 768px) and (max-width: 1366px)');
        const fhd = window.matchMedia('(min-width: 1920px)');

        const update = () => setIsLarge(tablet.matches || fhd.matches);

        update();
        tablet.addEventListener('change', update);
        fhd.addEventListener('change', update);

        return () => {
            tablet.removeEventListener('change', update);
            fhd.removeEventListener('change', update);
        };
    }, []);

    return isLarge;
}
