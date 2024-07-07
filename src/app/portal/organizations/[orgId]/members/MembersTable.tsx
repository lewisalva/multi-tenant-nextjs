'use client';

import { clsx } from 'clsx';
import { dayjs } from '~/web/utilities/dayjs';
import { type OrganizationMembers } from '../../../../../web/actions/organizationMembers';

export const MembersTable = ({organizationMembers, setSelectedOrganizationMember}: { organizationMembers: OrganizationMembers; setSelectedOrganizationMember: (member: OrganizationMembers[number]) => void }) => {
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
