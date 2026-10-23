/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        cosmic: {
          void: '#070711', midnight: '#0B0B1A', deep: '#11112A', surface: '#171733',
          raised: '#202044', border: '#303052', violet: '#8B5CF6', nebula: '#6D4AFF',
          indigo: '#3730A3', teal: '#5EEAD4', aqua: '#99F6E4', gold: '#F6C96B',
          stardust: '#E8E7FF', muted: '#A7A5C7', rose: '#F0ABFC', danger: '#FDA4AF'
        }
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        'glow-violet': '0 0 36px rgba(139,92,246,.22)',
        'glow-teal': '0 0 28px rgba(94,234,212,.18)'
      },
      backgroundImage: {
        'nebula': 'radial-gradient(ellipse at 18% 0%, rgba(109,74,255,.18), transparent 42%), radial-gradient(ellipse at 90% 30%, rgba(94,234,212,.08), transparent 38%)'
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } },
        twinkle: { '0%,100%': { opacity: '.35' }, '50%': { opacity: '1' } }
      },
      animation: { float: 'float 6s ease-in-out infinite', twinkle: 'twinkle 4s ease-in-out infinite' }
    }
  },
  plugins: []
};
