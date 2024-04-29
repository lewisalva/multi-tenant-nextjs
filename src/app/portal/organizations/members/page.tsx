'use client';

import { OrganizationMembersContextProvider } from '~/web/contexts/OrganizationMembersContext';
import { MembersTable } from './MembersTable';

export const Members = () => {
  return (
    <OrganizationMembersContextProvider>
      <MembersTable />
    </OrganizationMembersContextProvider>
  );
};

export default Members;
