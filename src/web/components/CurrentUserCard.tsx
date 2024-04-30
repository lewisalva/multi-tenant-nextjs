import { Menu, Transition } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { clsx } from 'clsx';
import { Fragment } from 'react';

import { useAuthenticationContext } from '../contexts/useAuthenticationContext';
import { useOrganizationContext } from '../contexts/useOrganizationContext';
import Link from 'next/link';
import Image from 'next/image';

const MenuItems = () => {
  const itemGroups = [
    [
      { name: 'Settings', to: '', isDisabled: true },
      { name: 'Notifications', to: '', isDisabled: true },
    ],
    [{ name: 'Support', to: '', isDisabled: true }],
    [{ name: 'Logout', to: '/portal/signout', isDisabled: false }],
  ];

  return itemGroups.map((group, index) => (
    <div key={`group-${index}`} className="py-1">
      {group.map((item) => (
        <Menu.Item key={item.name} disabled={item.isDisabled}>
          {({ active }) => (
            <Link
              href={item.to}
              className={clsx(
                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                item.isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
                'block px-4 py-2 text-sm'
              )}
            >
              {item.name}
            </Link>
          )}
        </Menu.Item>
      ))}
    </div>
  ));
};

export const CurrentUserCard = ({ isInStaticNav = true }) => {
  const { user } = useAuthenticationContext();
  const { selectedOrganization } = useOrganizationContext();
  return (
    <Menu
      as="div"
      className={clsx(isInStaticNav ? 'inline-block px-3 text-left' : 'ml-3', 'relative')}
    >
      <div>
        <Menu.Button className="group w-full rounded-md bg-gray-100 px-3.5 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
          <span className="flex w-full items-center justify-between">
            <span className="flex min-w-0 items-center justify-between space-x-3">
              <Image
                className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"
                src="https://images.unsplash.com/photo-1654013313410-c7b0044462dd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&w=256&h=256&q=80"
                alt={user?.name ?? 'User'}
              />
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium text-gray-900">{user?.name}</span>
                <span className="truncate text-sm text-gray-500">{selectedOrganization?.name}</span>
              </span>
            </span>
            <ChevronUpDownIcon
              className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
              aria-hidden="true"
            />
          </span>
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={clsx(
            isInStaticNav ? 'left-0 mx-3 mt-1 origin-top' : 'mt-2 w-48 origin-top-right',
            'absolute right-0 z-10 divide-y divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'
          )}
        >
          <MenuItems />
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
