import { Dialog, Transition } from '@headlessui/react';
import { Bars3CenterLeftIcon, Bars4Icon, HomeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';
import { Fragment, type ReactNode, useMemo } from 'react';

import { CurrentUserCard } from './CurrentUserCard';
import { Logo } from './Logo';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const NavItems = ({ isInStaticNav = true }) => {
  const pathname = usePathname();

  const navigation = useMemo(() => {
    const navigation = [
      {
        name: 'Organizations',
        href: '/portal/organizations',
        icon: HomeIcon,
        current: pathname === '/portal/organizations',
      },
      {
        name: 'Members',
        href: '/portal/organizations/members',
        icon: Bars4Icon,
        current: pathname === '/portal/organizations/members',
      },
    ];

    return navigation;
  }, [pathname]);

  return (
    <>
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={clsx(
            item.current
              ? `bg-gray-${isInStaticNav ? '200' : '100'} text-gray-900`
              : `text-gray-${isInStaticNav ? '700' : '600'} hover:bg-gray-50 hover:text-gray-900`,
            isInStaticNav ? 'text-sm' : 'text-base leading-5',
            'group flex items-center rounded-md px-2 py-2 font-medium'
          )}
          aria-current={item.current ? 'page' : undefined}
        >
          <item.icon
            className={clsx(
              item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
              'mr-3 h-6 w-6 flex-shrink-0'
            )}
            aria-hidden="true"
          />
          {item.name}
        </Link>
      ))}
    </>
  );
};

export const SiteNav = ({
  children,
  sidebarOpen,
  setSidebarOpen,
}: {
  children: ReactNode;
  sidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}) => {
  return (
    <>
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white pb-4 pt-5">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute right-0 top-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="relative ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Close sidebar</span>
                      <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <div className="px-4 flex flex-shrink-0 items-center">
                  <Logo />
                </div>
                <div className="mt-5 h-0 flex-1 overflow-y-auto">
                  <nav className="px-2">
                    <div className="space-y-1">
                      <NavItems isInStaticNav={false} />
                    </div>
                  </nav>
                </div>
              </Dialog.Panel>
            </Transition.Child>
            <div className="w-14 flex-shrink-0" aria-hidden="true"></div>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-gray-200 lg:bg-gray-100 lg:pb-4 lg:pt-5">
        <div className="px-6 flex flex-shrink-0 items-center">
          <Logo />
        </div>
        <div className="mt-5 flex h-0 flex-1 flex-col overflow-y-auto pt-1">
          <CurrentUserCard isInStaticNav />
          <nav className="mt-6 px-3">
            <div className="space-y-1">
              <NavItems isInStaticNav />
            </div>
          </nav>
        </div>
      </div>

      <div className="flex flex-col lg:pl-64">
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white lg:hidden">
          <button
            type="button"
            className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3CenterLeftIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="px-4 flex flex-shrink-0 items-center">
            <Logo />
          </div>
          <div className="flex flex-1 justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex flex-1"></div>
            <div className="flex items-center">
              <CurrentUserCard isInStaticNav={false} />
            </div>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};
