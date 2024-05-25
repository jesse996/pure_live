// const flowbite = require("flowbite-react/tailwind");
import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{html,js,ts,tsx}",
    flowbite.content(),
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [flowbite.plugin()],
};
