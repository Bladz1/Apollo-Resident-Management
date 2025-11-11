/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'var(--font-inter)',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
        heading: [
          'var(--font-be-vietnam)',
          'Be Vietnam Pro',
          'Inter',
          'sans-serif',
        ],
      },
      colors: {
        primary: "#1E40AF",   // xanh dương đậm
        secondary: "#9333EA", // tím
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
