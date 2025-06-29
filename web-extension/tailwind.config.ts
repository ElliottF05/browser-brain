module.exports = {
    darkMode: 'class',
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
        "./src/popup/popup.html"
    ],
    theme: {
        extend: {
            colors: {
                'bb-bg': '#181a1b', // charcoal
                'bb-accent': '#ffb300', // neon orange
                'bb-accent2': '#ff512f', // hot orange
                'bb-user-gradient-from': '#ff512f',
                'bb-user-gradient-to': '#f09819',
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
            },
            boxShadow: {
                'bb-glow': '0 0 16px 0 #ffb300, 0 1.5px 8px 0 rgba(0,0,0,0.25)',
                'bb-card': '0 4px 32px 0 #ffb30022, 0 1.5px 8px 0 rgba(0,0,0,0.25)',
            },
            backdropBlur: {
                xs: '2px',
                sm: '4px',
                md: '8px',
            },
            keyframes: {
                'bb-pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.6 },
                },
                'bb-glow': {
                    '0%, 100%': { boxShadow: '0 0 16px 0 #ffb300' },
                    '50%': { boxShadow: '0 0 32px 4px #ff512f' },
                },
            },
            animation: {
                'bb-pulse': 'bb-pulse 1.5s infinite',
                'bb-glow': 'bb-glow 2s infinite',
            },
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('tailwind-scrollbar')({ nocompatible: true }),
    ],
};