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
                    DEFAULT: '#FF5429', // orange.600
                    hover: '#FF6240', // orange.500
                    down: '#DA411B', // orange.800
                },
                background: {
                    DEFAULT: '#F8F8F8', // white.bg-gray
                    surface: '#FFFFFF', // white.solid
                    secondary: '#F5F5F5', // gray.100
                    warm: '#FAF7F5', // white.warm (hover bg)
                    'bg-warm': '#FFF8F7', // white.bg-warm (license badge bg)
                },
                text: {
                    primary: '#1E1E1E', // gray.900
                    secondary: '#6E6E6E', // gray.500
                    mono: '#444444', // gray.700 (Roboto Mono 버튼용)
                },
                border: '#D6D6D6', // gray.300
                accent: '#FF5429', // orange.600 (primary 통일)
                orange: {
                    '100': '#F6F1EE',
                    '200': '#E5D0C7',
                    '300': '#F8A581',
                    '400': '#FF8266',
                    '500': '#FF6240',
                    '600': '#FF5429',
                    '700': '#DE8324',
                    '800': '#DA411B',
                },
                gray: {
                    '100': '#F5F5F5',
                    '200': '#EDEDED',
                    '300': '#D6D6D6',
                    '400': '#BDBDBD',
                    '500': '#6E6E6E',
                    '700': '#444444',
                    '900': '#1E1E1E',
                },
            },
            fontFamily: {
                sans: ['Pretendard', '-apple-system', 'sans-serif'],
                mono: ['Roboto Mono', 'monospace'],
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
                'sm': '2px',
                DEFAULT: '4px',
                'md': '6px',   // badge, card
                'lg': '8px',   // searchform
                'xl': '12px',  // category pill, dropdown
                '2xl': '16px',
                'full': '9999px',
            },
            boxShadow: {
                '100': '0 1px 4px rgba(0,0,0,0.15)',
                '200': '0px 4px 20px rgba(110, 110, 110, 0.24)', // FontCard Hover
                '300': '0 4px 16px rgba(0,0,0,0.15)',
                '400': '0 8px 24px rgba(0,0,0,0.15)',
                'focus': '0px 0px 0px 3px #F9DAD3', // searchform focus ring
            },
            transitionTimingFunction: {
                smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
            },
        },
    },
    plugins: [],
};

export default config;
