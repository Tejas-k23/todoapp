export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6B1C3E",
          light: "#8B2252",
          dark: "#4A1229",
        },
        accent: "#00B4A6",
        sand: "#F7F0EA",
      },
      fontFamily: {
        sans: ["Sora", "system-ui", "sans-serif"],
      },
      screens: {
        xs: "375px",
      },
      boxShadow: {
        float: "0 20px 45px rgba(107, 28, 62, 0.18)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.35s ease-out",
      },
    },
  },
  plugins: [],
}
