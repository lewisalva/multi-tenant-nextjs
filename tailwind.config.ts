import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import forms from '@tailwindcss/forms';

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
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-400',
    'bg-yellow-400',
    'bg-lime-400',
    'bg-green-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-cyan-400',
    'bg-sky-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-violet-500',
    'bg-purple-500',
    'bg-fuchsia-400',
    'bg-pink-400',
    'bg-rose-400',
    'bg-zinc-600',
  ]
} satisfies Config;
