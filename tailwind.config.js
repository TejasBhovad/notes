/** @type {import('tailwindcss').Config} */
import { withUt } from "uploadthing/tw";
function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}
export default withUt({
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: withOpacity("--color-border"),
        primary: withOpacity("--color-primary"),
        primaryMuted: withOpacity("--color-primary-muted"),
        text: withOpacity("--color-text"),
        textMuted: withOpacity("--color-text-muted"),
        util: withOpacity("--color-util"),
        danger: withOpacity("--color-danger"),
        dangerMuted: withOpacity("--color-danger-muted"),
      },
      backgroundColor: {
        secondary: withOpacity("--color-background-secondary"),
        base: withOpacity("--color-background-base"),
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
});
