/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "rgba(var(--color-background))",
        border: "rgba(var(--color-border))",
        border2: "rgba(var(--color-border2))",
        card: "rgba(var(--color-card))",

        text: "rgba(var(--color-text))",
        text2: "rgba(var(--color-text2))",      

        cta: "rgba(var(--color-cta))",
        ctactive: "rgba(var(--color-ctactive))",
        ctatext: "rgba(var(--color-ctatext))",
        acttext: "rgba(var(--color-acttext))",
        hvrr: "rgba(var(--color-hvrr))",
        cobabg: "rgba(var(--color-cobabg))",
        coba: "rgba(var(--color-coba))",

        primary: "#000000",
        secondary: "#FFFFFF",
        hijau: '#009900',
        showTombol: '#14ADD6',
        createTombol: '#1D8CF8',
        deleteTombol: '#FF0000',
        hijau2: '#008000',
        hitam2: '#1C1C1C',
        baseclr: '#11121A',
        hoverclr: '#222533',
        accentclr: '#5E63FF',
        boxdark: '#24303F',
        primaryp: '#3C50E0',
        stroke: '#E2E8F0',
        strokedark: '#2E3A47',
        primaryy: '#3C50E0',
        textclr: '#E6E6Ef',
        contoh: '#292929',
        contoh1: '#363636',
        meta: {
          1: '#DC3545',
          2: '#EFF2F7',
          3: '#10B981',
          4: '#313D4A',
          5: '#259AE6',
          6: '#FFBA00',
          7: '#FF6766',
          8: '#F0950C',
          9: '#E5E7EB',
          10: '#0FADCF',
        },
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem"
        }
      },
      spacing: {
        4.5: '1.125rem',
        5.5: '1.375rem',
        6.5: '1.625rem',
        7.5: '1.875rem',
        8.5: '2.125rem',
        9.5: '2.375rem',
        10.5: '2.625rem'
      },
      boxShadow: {
        default: '0px 8px 13px -3px rgba(0, 0, 0, 0.07)',
        buatcard: '0px 6px 8px 0px rgba(0, 0, 0, 0.25)'
      },
    },
  },
  plugins: [],
};

