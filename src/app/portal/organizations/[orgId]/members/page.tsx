import MembersPage from './MembersPage';
import { findUsersInOrganization } from '../../../../../server/models/OrganizationMember';
import { OrganizationMembersContextProvider } from '../../../../../web/contexts/OrganizationMembersContext';

const Members = async ({ params }: { params: { orgId: string }}) => {
  const members = await findUsersInOrganization(params.orgId);

  return (
    <OrganizationMembersContextProvider members={members}>
      <MembersPage />
    </OrganizationMembersContextProvider>
  );
};

export default Members;
