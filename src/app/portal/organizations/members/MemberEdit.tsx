'use client';

import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { type FormEvent, useState } from 'react';

import { useOrganizationMembersContext } from '~/web/contexts/useOrganizationMembersContext';
import { type OrganizationMemberType } from '~/web/services/organizationMembers';

export const MemberEdit = ({
  closePanel,
  member,
}: {
  closePanel: () => void;
  member?: OrganizationMemberType;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { removeOrganizationMember, updateOrganizationMember } = useOrganizationMembersContext();

  if (!member) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = {
      userId: member.userId,
      permission: data.get('role') as 'member' | 'admin',
      organizationId: member.organizationId,
    };
    try {
      await updateOrganizationMember(body);
      closePanel();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemove = async () => {
    setIsSubmitting(true);

    try {
      await removeOrganizationMember({
        userId: member.userId,
        organizationId: member.organizationId,
      });
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
              Edit Member
            </Dialog.Title>
            <div className="ml-3 flex h-7 items-center">
              <button
                type="button"
                className="relative rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                onClick={closePanel}
              >
                <span className="absolute -inset-2.5" />
                <span className="sr-only">ClosePanel panel</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="mt-1">
            <p className="text-sm text-indigo-300">
              Update the role for a member of your organization.
            </p>
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div className="divide-y divide-gray-200 px-4 sm:px-6">
            <div className="space-y-6 pb-5 pt-6">
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  User&apos;s name
                </label>
                <div className="mt-2">{member.user.name}</div>
              </div>
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  User&apos;s email
                </label>
                <div className="mt-2">{member.user.email}</div>
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
                        defaultChecked={member.permission === 'member'}
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
                          defaultChecked={member.permission === 'admin'}
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
      <div className="flex flex-shrink-0 justify-between px-4 py-4">
        <button
          type="button"
          className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-black shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-400"
          onClick={handleRemove}
          disabled={isSubmitting}
        >
          Remove User
        </button>
        <div>
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
      </div>
    </form>
  );
};
