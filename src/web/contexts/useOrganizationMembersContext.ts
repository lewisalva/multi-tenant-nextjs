import { useContext } from 'react';

import { OrganizationMembersContext } from './OrganizationMembersContext';

export const useOrganizationMembersContext = () => {
  const context = useContext(OrganizationMembersContext);

  if (!context) {
    throw new Error(
      'useOrganizationMembersContext must be used within OrganizationMembersContextProvider'
    );
  }

  return context;
};
