/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#0B1220",
        surface: "#111827",
        elevated: "#1A2236",
        primary: "#00E5FF",
        success: "#00C896",
        warning: "#F5A524",
        danger: "#FF4D67",
        textPrimary: "#E6EDF3",
        textSecondary: "#9DA7B3",
        textMuted: "#6B7280",
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0,0,0,0.3)",
        glow: "0 0 20px rgba(0,229,255,0.15)",
      },
      borderColor: {
        subtle: "rgba(255,255,255,0.06)",
      },
    },
  },
  plugins: [],
};