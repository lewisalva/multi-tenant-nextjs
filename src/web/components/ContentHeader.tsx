import { type ReactNode } from 'react';

export const ContentHeader = ({ children, title }: { children: ReactNode; title: string }) => {
  return (
    <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between lg:px-8 mb-8">
      <div className="min-w-0 flex-1">
        <h1 className="text-lg font-medium leading-6 text-gray-900 sm:truncate">{title}</h1>
      </div>
      <div className="flex ml-4 mt-0">{children}</div>
    </div>
  );
};
