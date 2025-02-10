npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
