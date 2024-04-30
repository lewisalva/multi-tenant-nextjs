import MembersPage from './MembersPage';
import { findUsersInOrganization } from '../../../../../server/models/OrganizationMember';

const Members = async ({ params }: { params: { orgId: string }}) => {
  const members = await findUsersInOrganization(params.orgId);

  return (<MembersPage members={members} />
  );
};

export default Members;
