module.exports = {
  theme: {
    extend: {
      colors: {
        spaceBg: "#0f0f1e", // Dark space background
        spaceAccent: "#1a1a2e", // Slightly lighter accent
        textPrimary: "#ffcc00", // Star Wars yellow
      },
      animation: {
        stars: "stars 200s linear infinite",
      },
      backgroundImage: {
        stars: "url('https://www.transparenttextures.com/patterns/stardust.png')",
      },
      keyframes: {
        stars: {
          from: { backgroundPosition: "0 0" },
          to: { backgroundPosition: "1000px 1000px" },
        },
      },
    },
  },
  plugins: [],
};
