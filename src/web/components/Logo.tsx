import Image from "next/image";

export const Logo = ({ className = 'h-8 w-auto' }) => {
  return (
    <Image
      className={className}
      src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
      alt="J1Support"
    />
  );
};
