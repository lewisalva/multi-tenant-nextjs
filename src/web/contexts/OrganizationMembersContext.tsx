'use client';

import { useQuery } from '@tanstack/react-query';
import { createContext, useState } from 'react';

import { useOrganizationContext } from './useOrganizationContext';
import { type OrganizationMembers, getOrganizationMembers } from '../actions/organizationMembers';

export type OrganizationMembersContextType = {
  selectedOrganizationMember?: OrganizationMembers[number];
  setSelectedOrganizationMember: (member?: OrganizationMembers[number]) => void;
  organizationMembers?: OrganizationMembers;
  isLoadingOrganizationMembers: boolean;
  reloadOrganizationMembers: () => Promise<void>;
};

type Props = {
  children: React.ReactNode;
  members: OrganizationMembers
};

export const OrganizationMembersContext = createContext<OrganizationMembersContextType | null>(
  null
);

export const OrganizationMembersContextProvider = ({ children, members = [] }: Props) => {
  const [selectedOrganizationMember, setSelectedOrganizationMember] = useState<
  OrganizationMembers[number] | undefined
  >(undefined);
  const { selectedOrganization } = useOrganizationContext();
  const {
    data: organizationMembers,
    refetch: reloadOrganizationMembers,
    isLoading: isLoadingOrganizationMembers,
  } = useQuery({
    queryKey: ['organizationMembers', selectedOrganization?.id],
    queryFn: () => {
      return getOrganizationMembers(selectedOrganization!.id);
    },
    initialData: members,
    staleTime: 5000,
    enabled: !!selectedOrganization,
  });

  const defaultValue: OrganizationMembersContextType = {
    selectedOrganizationMember,
    setSelectedOrganizationMember,
    organizationMembers,
    isLoadingOrganizationMembers,
    reloadOrganizationMembers: async () => {await reloadOrganizationMembers();},
  };

  return (
    <OrganizationMembersContext.Provider value={defaultValue}>
      {children}
    </OrganizationMembersContext.Provider>
  );
};
