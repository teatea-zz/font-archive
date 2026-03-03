/** @type {import('next').NextConfig} */
const nextConfig = {
    compress: true, // gzip 압축 활성화
    experimental: {
        optimizePackageImports: [
            'react-hook-form',
            'zod',
            '@hookform/resolvers',
        ],
    },
    async headers() {
        return [
            {
                // 모든 경로에 X-Robots-Tag 헤더 적용
                source: '/:path*',
                headers: [
                    {
                        key: 'X-Robots-Tag',
                        value: 'noindex, nofollow',
                    },
                ],
            },
        ];
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.supabase.co',
                pathname: '/storage/v1/object/public/**',
            },
        ],
    },
};

module.exports = nextConfig;
