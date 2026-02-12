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
                    DEFAULT: '#0D66D0',
                    hover: '#095ABA',
                },
                background: {
                    DEFAULT: '#FFFFFF',
                    secondary: '#F5F5F5',
                },
                text: {
                    primary: '#2C2C2C',
                    secondary: '#6E6E6E',
                },
                border: '#E1E1E1',
                accent: '#FF477E',
            },
            fontFamily: {
                sans: ['Pretendard', '-apple-system', 'sans-serif'],
            },
            spacing: {
                'safe': 'max(1rem, env(safe-area-inset-bottom))',
            },
        },
    },
    plugins: [],
};

export default config;
