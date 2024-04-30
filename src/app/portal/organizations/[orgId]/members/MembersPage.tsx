'use client';

import { OrganizationMembersContextProvider } from "../../../../../web/contexts/OrganizationMembersContext";
import { type OrganizationMembersType } from "../../../../../web/services/organizationMembers";
import { MembersTable } from "./MembersTable";

export default function Members({ members = [] }: { members: OrganizationMembersType }) {
  return (
    <OrganizationMembersContextProvider members={members}>
      <MembersTable />
    </OrganizationMembersContextProvider>
  );
}
