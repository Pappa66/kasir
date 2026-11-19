/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f2f2e',
        'ink-soft': '#4a5c5a',
        line: '#dfe4e2',
        surface: '#f6f7f6',
        paper: '#ffffff',
        accent: '#0f3d3e',
        'accent-2': '#146b6d',
        ok: '#0a7a4f',
        warn: '#b45309',
        bad: '#b42318',
      },
      borderRadius: {
        DEFAULT: '4px',
        md: '4px',
        lg: '6px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        '2xs': ['11px', '16px'],
        xs: ['12px', '17px'],
        sm: ['13px', '20px'],
        base: ['14px', '21px'],
        lg: ['16px', '23px'],
        xl: ['20px', '28px'],
        '2xl': ['26px', '32px'],
        '3xl': ['34px', '40px'],
      },
      transitionDuration: {
        DEFAULT: '120ms',
      },
    },
  },
  plugins: [],
}
