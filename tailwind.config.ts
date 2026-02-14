import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#0265DC', // Spectrum Blue
                    hover: '#0151B0',
                    down: '#013D83',
                },
                background: {
                    DEFAULT: '#F8F8F8', // Gray 50
                    surface: '#FFFFFF', // White
                    secondary: '#F5F5F5',
                },
                text: {
                    primary: '#222222', // Gray 900
                    secondary: '#6E6E6E', // Gray 600
                },
                border: '#E1E1E1', // Gray 300
                accent: '#FF477E',
            },
            fontFamily: {
                sans: ['Pretendard', '-apple-system', 'sans-serif'],
            },
            spacing: {
                'safe': 'max(1rem, env(safe-area-inset-bottom))',
                '1': '4px',
                '2': '8px',
                '3': '12px',
                '4': '16px',
                '5': '20px',
                '6': '24px',
                '8': '32px',
                '10': '40px',
            },
            borderRadius: {
                'sm': '2px', // Small
                DEFAULT: '4px', // Default
                'lg': '8px',
                'xl': '12px',
                '2xl': '16px',
            },
            boxShadow: {
                '100': '0 1px 4px rgba(0,0,0,0.15)',
                '200': '0 2px 8px rgba(0,0,0,0.15)',
                '300': '0 4px 16px rgba(0,0,0,0.15)',
                '400': '0 8px 24px rgba(0,0,0,0.15)',
            }
        },
    },
    plugins: [],
};

export default config;
