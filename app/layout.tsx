import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";

const robotoMono = Roboto_Mono({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-roboto-mono",
    preload: false,
});

export const metadata: Metadata = {
    title: "폰트 정보 아카이브",
    description: "디자이너를 위한 개인용 폰트 정보 관리 플랫폼",
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: { index: false, follow: false },
    },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="ko" className={robotoMono.variable}>
            <head>
                <meta name="robots" content="noindex, nofollow" />
            </head>
            <body className="min-h-screen">
                {children}
            </body>
        </html>
    );
}
