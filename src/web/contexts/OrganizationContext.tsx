import { useQuery } from '@tanstack/react-query';
import { createContext, useCallback, useEffect, useState } from 'react';

import {
  getOrganizations,
  type OrganizationCreateType,
  type OrganizationsType,
  type OrganizationType,
  postOrganization,
} from '../services/organizations';

export type OrganizationContextType = {
  selectedOrganization?: OrganizationType;
  setSelectedOrganization: (org: OrganizationType) => void;
  organizations: OrganizationsType;
  createOrganization: (body: OrganizationCreateType) => Promise<void>;
};

type Props = {
  children: React.ReactNode;
};

export const OrganizationContext = createContext<OrganizationContextType | null>(null);

export const OrganizationContextProvider = ({ children }: Props) => {
  const [selectedOrganization, setSelectedOrganization] = useState<OrganizationType | undefined>();
  const { data: organizations, refetch } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => getOrganizations(),
    initialData: [],
  });

  const createOrganization = useCallback(
    async ({ name }: OrganizationCreateType) => {
      const id = await postOrganization({ name });
      if (!id) throw new Error('Failed to create organization');

      setSelectedOrganization({
        id,
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await refetch();
    },
    [setSelectedOrganization, refetch]
  );

  useEffect(() => {
    if (organizations.length && !selectedOrganization) setSelectedOrganization(organizations[0]);
  }, [selectedOrganization, organizations]);

  const defaultValue: OrganizationContextType = {
    selectedOrganization,
    setSelectedOrganization,
    organizations,
    createOrganization,
  };

  return (
    <OrganizationContext.Provider value={defaultValue}>{children}</OrganizationContext.Provider>
  );
};
