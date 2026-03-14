import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glass: "rgba(255,255,255,0.05)",
        "glass-hover": "rgba(255,255,255,0.08)",
        accent: "#00d4ff",
        "accent-purple": "#6366f1",
      },
      backgroundImage: {
        "radial-glow": "radial-gradient(ellipse at top, #0f0f1a 0%, #0a0a0f 100%)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(0,212,255,0.15)",
        "glow-gold": "0 0 20px rgba(255,200,0,0.2)",
        "glow-silver": "0 0 20px rgba(180,180,180,0.2)",
        "glow-bronze": "0 0 20px rgba(180,100,40,0.2)",
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: ["dark"],
  },
};