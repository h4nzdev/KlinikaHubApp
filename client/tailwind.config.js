/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.js",
    "./index.js",
    // The core 'src' folder paths:
    "./src/**/*.{js,jsx}", // Catches all files in the 'src' folder and all subfolders
    "./src/screens/**/*.{js,jsx}", // Explicitly includes the screens folder
    "./src/components/**/*.{js,jsx}", // Explicitly includes the components folder
    "./src/navigation/**/*.{js,jsx}", // Includes navigation files

    // Original path, slightly redundant if using "./src/**/*.{js,jsx}" but harmless:
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
