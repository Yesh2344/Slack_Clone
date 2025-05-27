/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#2DD4BF", // Teal 400 for lighter accents
          DEFAULT: "#14B8A6", // Teal 500 - Main vibrant accent
          dark: "#0D9488",  // Teal 600 - Darker shade
          hover: "#0F766E", // Teal 700 for hover
        },
        background: {
          DEFAULT: "#1F2937", // Cool Gray 800 - Main dark background
          light: "#374151",   // Cool Gray 700 - Lighter surface
          dark: "#111827",    // Cool Gray 900 - Darker surface/borders
        },
        text: {
          primary: "#F3F4F6",    // Cool Gray 100 - Main text color
          secondary: "#9CA3AF", // Cool Gray 400 - Secondary text
          accent: "#14B8A6",     // Teal 500 for accented text
        },
        // Keep auth colors distinct or adapt them
        auth: {
          primary: "#4F46E5", // Original primary for auth section if needed
          hover: "#4338CA",
        }
      },
      fontFamily: {
        sans: [
          "Inter Variable",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          '"Noto Sans"',
          "sans-serif",
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        // Optionally add a more "techy" font here if desired
        // mono: ['"Roboto Mono"', 'monospace'],
      },
      borderRadius: {
        container: "0.5rem",
        lg: "0.75rem", // Slightly larger default rounded corners
        xl: "1rem",
      },
      boxShadow: {
        'glow-primary': '0 0 15px 2px rgba(20, 184, 166, 0.5)', // Teal glow
        'glow-sm': '0 0 8px 1px rgba(20, 184, 166, 0.4)',
      }
    },
  },
  plugins: [],
};
