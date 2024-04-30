'use client';

import { clsx } from 'clsx';
import { useState } from 'react';

import { ContentHeader } from '~/web/components/ContentHeader';
import { SidePanel } from '~/web/components/SidePanel';
import { useOrganizationMembersContext } from '~/web/contexts/useOrganizationMembersContext';
import { dayjs } from '~/web/utilities/dayjs';
import { MemberAdd } from './MemberAdd';
import { MemberEdit } from './MemberEdit';
import { type OrganizationMembersType } from '../../../../../web/services/organizationMembers';

const Table = ({organizationMembers, setSelectedOrganizationMember}: { organizationMembers: OrganizationMembersType; setSelectedOrganizationMember: (member: OrganizationMembersType[number]) => void }) => {
  return (
    <div className="inline-block min-w-full border-b border-l border-r border-gray-200 align-middle">
      <table className="min-w-full">
        <thead>
          <tr className="border-t border-gray-200">
            <th
              className="border-b border-gray-200 bg-gray-50 px-6 py-3 text-left text-sm font-semibold text-gray-900"
              scope="col"
            >
              <span className="lg:pl-2">Name</span>
            </th>
            <th
              className="hidden border-b whitespace-nowrap border-gray-200 bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900 md:table-cell"
              scope="col"
            >
              Role
            </th>
            <th
              className="hidden border-b whitespace-nowrap border-gray-200 bg-gray-50 px-6 py-3 text-right text-sm font-semibold text-gray-900 md:table-cell"
              scope="col"
            >
              Last updated
            </th>
            <th
              className="border-b border-gray-200 bg-gray-50 py-3 pr-6 text-right text-sm font-semibold text-gray-900"
              scope="col"
            />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {organizationMembers.map((member) => (
            <tr key={member.userId}>
              <td className="w-full max-w-0 whitespace-nowrap py-3 text-sm font-medium text-gray-900">
                <div className="flex items-center space-x-3 lg:pl-2">
                  <div
                    className={clsx('h-2.5 w-2.5 flex-shrink-0 rounded-full')}
                    aria-hidden="true"
                  />
                  <span>
                    {member.user.name}{' '}
                    <span className="font-normal text-xs text-gray-500">
                      {member.user.email}
                    </span>
                  </span>
                </div>
              </td>
              <td className="hidden whitespace-nowrap px-6 py-3 text-right text-sm text-gray-500 md:table-cell">
                {member.permission}
              </td>
              <td className="hidden whitespace-nowrap px-6 py-3 text-right text-sm text-gray-500 md:table-cell">
                {dayjs(member.updatedAt).fromNow()}
              </td>
              <td className="whitespace-nowrap px-6 py-3 text-right text-sm font-medium">
                <div
                  className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                  onClick={() => setSelectedOrganizationMember(member)}
                >
                  Edit
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export const MembersTable = () => {
  const { organizationMembers, selectedOrganizationMember, setSelectedOrganizationMember } =
    useOrganizationMembersContext();
  const [isAddMemberPanelOpen, setIsAddMemberPanelOpen] = useState(false);

  return (
    <>
      <ContentHeader title="Members">
        <button
          type="button"
          className="order-0 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:order-1 sm:ml-3"
          onClick={() => setIsAddMemberPanelOpen(true)}
        >
          Add
        </button>
      </ContentHeader>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {organizationMembers && organizationMembers.length > 0 && (
            <Table organizationMembers={organizationMembers} setSelectedOrganizationMember={setSelectedOrganizationMember}/>
          )}
          { !organizationMembers || organizationMembers.length === 0 && (
            <div>No members, add some!</div>
          )}
      </div>
      <SidePanel isOpen={isAddMemberPanelOpen} closePanel={() => setIsAddMemberPanelOpen(false)}>
        <MemberAdd closePanel={() => setIsAddMemberPanelOpen(false)} />
      </SidePanel>
      <SidePanel
        isOpen={!!selectedOrganizationMember}
        closePanel={() => setSelectedOrganizationMember(undefined)}
      >
        <MemberEdit
          closePanel={() => setSelectedOrganizationMember(undefined)}
          member={selectedOrganizationMember}
        />
      </SidePanel>
    </>
  );
};
