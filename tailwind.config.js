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
        textclr: '#E6E6Ef'
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
      boxShadow: {
        default: '0px 8px 13px -3px rgba(0, 0, 0, 0.07)',
      },
    },
  },
  plugins: [],
};

