import { useQuery } from '@tanstack/react-query';
import { createContext, useCallback, useEffect, useState } from 'react';

import {
  getOrganizations,
  postOrganization,
} from '../actions/organizations';
import { type CreateOrganization, type Organization } from '../../server/models/Organization';

export type OrganizationContextType = {
  selectedOrganization?: Organization;
  setSelectedOrganization: (org: Organization) => void;
  organizations: Organization[];
  createOrganization: (body: CreateOrganization) => Promise<void>;
};

type Props = {
  children: React.ReactNode;
  orgs?: Organization[];
};

export const OrganizationContext = createContext<OrganizationContextType | null>(null);

export const OrganizationContextProvider = ({ children, orgs = [] }: Props) => {
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | undefined>(orgs[0]);
  const { data: organizations, refetch } = useQuery({
    queryKey: ['organizations'],
    queryFn: () => getOrganizations(),
    initialData: orgs,
    staleTime: 5000,
  });

  const createOrganization = useCallback(
    async ({ name }: CreateOrganization) => {
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
