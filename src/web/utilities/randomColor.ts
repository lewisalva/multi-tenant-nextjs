const tailwindColors = {
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  amber: 'bg-amber-400',
  yellow: 'bg-yellow-400',
  lime: 'bg-lime-400',
  green: 'bg-green-500',
  emerald: 'bg-emerald-500',
  teal: 'bg-teal-500',
  cyan: 'bg-cyan-400',
  sky: 'bg-sky-500',
  blue: 'bg-blue-500',
  indigo: 'bg-indigo-500',
  violet: 'bg-violet-500',
  purple: 'bg-purple-500',
  fuchsia: 'bg-fuchsia-400',
  pink: 'bg-pink-400',
  rose: 'bg-rose-400',
  zinc: 'bg-zinc-600',
} as const;

export const randomColor = () => {
  const colors = Object.values(tailwindColors);
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};
