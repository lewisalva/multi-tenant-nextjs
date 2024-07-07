export const Logo = ({ className = 'h-8 w-auto' }) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className={className}
      src="/images/logo.svg"
      alt="J1Support"
    />
  );
};
