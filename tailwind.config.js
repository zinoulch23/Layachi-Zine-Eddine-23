/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#95EDF5",
          foreground: "#131313",
          container: "#79D1D8",
        },
        secondary: {
          DEFAULT: "#ACCDCF",
          foreground: "#131313",
        },
        tertiary: {
          DEFAULT: "#FFD7BD",
          foreground: "#131313",
        },
        surface: {
          DEFAULT: "#1B1B1B",
          lowest: "#0E0E0E",
          low: "#1B1B1B",
          container: "#242424",
          high: "#2A2A2A",
          highest: "#353535",
          bright: "#393939",
          dim: "#1A1A1A",
        },
        destructive: {
          DEFAULT: "#FFB4AB",
          foreground: "#131313",
        },
        success: {
          DEFAULT: "#95EDF5",
          foreground: "#131313",
        },
        warning: {
          DEFAULT: "#FFD7BD",
          foreground: "#131313",
        },
        error: {
          DEFAULT: "#FFB4AB",
          foreground: "#131313",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        "on-surface": {
          DEFAULT: "#E2E2E2",
          variant: "#BDC9C9",
        },
        outline: {
          DEFAULT: "#889394",
          variant: "#3E494A",
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
        "2xl": "1.5rem",
        "3xl": "2rem",
        full: "9999px",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        card: "0 4px 16px rgba(0, 0, 0, 0.2)",
        "card-hover": "0 8px 24px rgba(0, 0, 0, 0.3)",
        modal: "0 20px 40px rgba(0, 0, 0, 0.4)",
        glow: "0 0 30px rgba(149, 237, 245, 0.15)",
        "glow-strong": "0 4px 16px rgba(149, 237, 245, 0.3)",
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
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "slide-in": {
          from: { transform: "translateX(100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "slide-in": "slide-in 0.3s ease-out",
        "fade-in": "fade-in 0.25s ease-out",
        "scale-in": "scale-in 0.25s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
