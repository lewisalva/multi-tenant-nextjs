import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import forms from '@tailwindcss/forms';
import { colorsUsed } from './src/web/utilities/randomColor';

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [ forms ],
  safelist: [
    ...colorsUsed
  ]
} satisfies Config;
