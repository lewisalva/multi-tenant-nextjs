'use client';

import { type OrganizationMembers } from "../../../../../web/actions/organizationMembers";
import { OrganizationMembersContextProvider } from "../../../../../web/contexts/OrganizationMembersContext";
import { MembersTable } from "./MembersTable";

export default function Members({ members = [] }: { members: OrganizationMembers }) {
  return (
    <OrganizationMembersContextProvider members={members}>
      <MembersTable />
    </OrganizationMembersContextProvider>
  );
}
