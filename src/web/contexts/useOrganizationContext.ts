import { useContext } from 'react';

import { OrganizationContext } from './OrganizationContext';

export const useOrganizationContext = () => {
  const context = useContext(OrganizationContext);

  if (!context) {
    throw new Error('useOrganizationContext must be used within OrganizationContextProvider');
  }

  return context;
};
