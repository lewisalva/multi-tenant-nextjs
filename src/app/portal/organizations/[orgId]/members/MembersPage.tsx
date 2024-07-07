'use client';

import { MembersTable } from "./MembersTable";
import { useState } from 'react';

import { ContentHeader } from '~/web/components/ContentHeader';
import { SidePanel } from '~/web/components/SidePanel';
import { useOrganizationMembersContext } from '~/web/contexts/useOrganizationMembersContext';
import { MemberAdd } from './MemberAdd';
import { MemberEdit } from './MemberEdit';

export default function Members() {
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
            <MembersTable organizationMembers={organizationMembers} setSelectedOrganizationMember={setSelectedOrganizationMember}/>
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
}
