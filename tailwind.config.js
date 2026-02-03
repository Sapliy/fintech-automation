module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./src/**/*.css"],
  theme: {
    extend: {
      transitionProperty: {
        all: "all",
      },
      transitionDuration: {
        200: "200ms",
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "scale(0.95)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
      },
      ringWidth: {
        2: "2px",
      },
      animation: {
        pulse: "pulse 1s cubic-bezier(0.4, 0, 0.6, 1)",
      },
      keyframes: {
        pulse: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.5 },
        },
      },
      variants: {
        extend: {
          opacity: ["group-hover"],
          ringWidth: ["focus"],
          ringColor: ["focus"],
        },
      },
    },
  },
};
