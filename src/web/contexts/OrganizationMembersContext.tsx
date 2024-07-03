import { useQuery } from '@tanstack/react-query';
import { createContext, useState } from 'react';

import { useOrganizationContext } from './useOrganizationContext';
import { getOrganizationMembers, type OrganizationMemberType, type OrganizationMembersType } from '../actions/organizationMembers';

export type OrganizationMembersContextType = {
  selectedOrganizationMember?: OrganizationMemberType;
  setSelectedOrganizationMember: (member?: OrganizationMemberType) => void;
  organizationMembers?: OrganizationMembersType;
  isLoadingOrganizationMembers: boolean;
  reloadOrganizationMembers: () => Promise<void>;
};

type Props = {
  children: React.ReactNode;
  members: OrganizationMembersType
};

export const OrganizationMembersContext = createContext<OrganizationMembersContextType | null>(
  null
);

export const OrganizationMembersContextProvider = ({ children, members = [] }: Props) => {
  const [selectedOrganizationMember, setSelectedOrganizationMember] = useState<
    OrganizationMemberType | undefined
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
