'use client';

import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { type FormEvent, useState } from 'react';

import { useOrganizationContext } from '~/web/contexts/useOrganizationContext';
import { useOrganizationMembersContext } from '~/web/contexts/useOrganizationMembersContext';
import { postOrganizationMember } from '~/web/actions/organizationMembers';

export const MemberAdd = ({ closePanel }: { closePanel: () => void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { selectedOrganization } = useOrganizationContext();
  const { reloadOrganizationMembers } = useOrganizationMembersContext();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = {
      email: data.get('email')!.toString() + '',
      permission: data.get('role') as 'member' | 'admin',
      organizationId: selectedOrganization?.id ?? '',
    };
    try {
      await postOrganizationMember(body);
      await reloadOrganizationMembers();
      closePanel();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
      onSubmit={handleSubmit}
    >
      <div className="h-0 flex-1 overflow-y-auto">
        <div className="bg-indigo-700 px-4 py-6 sm:px-6">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-base font-semibold leading-6 text-white">
              Add Member
            </Dialog.Title>
            <div className="ml-3 flex h-7 items-center">
              <button
                type="button"
                className="relative rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                onClick={closePanel}
              >
                <span className="absolute -inset-2.5" />
                <span className="sr-only">Close panel</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="mt-1">
            <p className="text-sm text-indigo-300">
              Add an existing user on our platform to your organization.
            </p>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div className="divide-y divide-gray-200 px-4 sm:px-6">
            <div className="space-y-6 pb-5 pt-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  User&apos;s email
                </label>
                <div className="mt-2">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <fieldset>
                <legend className="text-sm font-medium leading-6 text-gray-900">Role</legend>
                <div className="mt-2 space-y-4">
                  <div className="relative flex items-start">
                    <div className="absolute flex h-6 items-center">
                      <input
                        id="role-member"
                        name="role"
                        aria-describedby="role-member-description"
                        type="radio"
                        value="member"
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        defaultChecked
                      />
                    </div>
                    <div className="pl-7 text-sm leading-6">
                      <label htmlFor="role-member" className="font-medium text-gray-900">
                        Member
                      </label>
                      <p id="role-member-description" className="text-gray-500">
                        A member of the organization.
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="relative flex items-start">
                      <div className="absolute flex h-6 items-center">
                        <input
                          id="role-admin"
                          name="role"
                          aria-describedby="role-admin-description"
                          type="radio"
                          value="admin"
                          className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                        />
                      </div>
                      <div className="pl-7 text-sm leading-6">
                        <label htmlFor="role-admin" className="font-medium text-gray-900">
                          Admin
                        </label>
                        <p id="role-admin-description" className="text-gray-500">
                          An Admin of the organization.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-shrink-0 justify-end px-4 py-4">
        <button
          type="button"
          className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          onClick={closePanel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="ml-4 inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          disabled={isSubmitting}
        >
          Add
        </button>
      </div>
    </form>
  );
};
