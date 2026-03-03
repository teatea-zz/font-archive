import type { Metadata } from "next";
import localFont from "next/font/local";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";

const pretendard = localFont({
    src: [
        { path: "../public/fonts/Pretendard-Thin.woff2", weight: "100", style: "normal" },
        { path: "../public/fonts/Pretendard-ExtraLight.woff2", weight: "200", style: "normal" },
        { path: "../public/fonts/Pretendard-Light.woff2", weight: "300", style: "normal" },
        { path: "../public/fonts/Pretendard-Regular.woff2", weight: "400", style: "normal" },
        { path: "../public/fonts/Pretendard-Medium.woff2", weight: "500", style: "normal" },
        { path: "../public/fonts/Pretendard-SemiBold.woff2", weight: "600", style: "normal" },
        { path: "../public/fonts/Pretendard-Bold.woff2", weight: "700", style: "normal" },
        { path: "../public/fonts/Pretendard-ExtraBold.woff2", weight: "800", style: "normal" },
        { path: "../public/fonts/Pretendard-Black.woff2", weight: "900", style: "normal" },
    ],
    display: "swap",
    variable: "--font-pretendard",
});

const robotoMono = Roboto_Mono({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-roboto-mono",
});

export const metadata: Metadata = {
    title: "폰트 정보 아카이브",
    description: "디자이너를 위한 개인용 폰트 정보 관리 플랫폼",
    // SEO 차단 설정
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
            index: false,
            follow: false,
        },
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko" className={`${pretendard.variable} ${robotoMono.variable}`}>
            <head>
                <meta name="robots" content="noindex, nofollow" />
            </head>
            <body className={`${pretendard.className} min-h-screen`}>
                {children}
            </body>
        </html>
    );
}

