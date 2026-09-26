/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        flux: {
          space: "#081C36",
          card: "#0D2547",
          border: "rgba(53, 214, 255, 0.2)",
          blue: "#377DFF",
          cyan: "#35D6FF",
          yellow: "#FFD84D",
          white: "#F4F8FC",
          muted: "#A1B5D8",
          crimson: "#FF5353",
        },
      },
    },
  },
  plugins: [],
};
