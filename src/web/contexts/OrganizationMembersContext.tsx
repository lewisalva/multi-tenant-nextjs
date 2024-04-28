import { useQuery } from '@tanstack/react-query';
import { createContext, useCallback, useState } from 'react';

import {
  deleteOrganizationMember,
  getOrganizationMembers,
  type OrganizationMemberCreateType,
  type OrganizationMemberDeleteType,
  type OrganizationMembersType,
  type OrganizationMemberType,
  type OrganizationMemberUpdateType,
  postOrganizationMember,
  putOrganizationMember,
} from '../services/organizationMembers';
import { useOrganizationContext } from './useOrganizationContext';

export type OrganizationMembersContextType = {
  selectedOrganizationMember?: OrganizationMemberType;
  setSelectedOrganizationMember: (member?: OrganizationMemberType) => void;
  organizationMembers?: OrganizationMembersType;
  isLoadingOrganizationMembers: boolean;
  addOrganizationMember: (body: OrganizationMemberCreateType) => Promise<void>;
  updateOrganizationMember: (body: OrganizationMemberUpdateType) => Promise<void>;
  removeOrganizationMember: (body: OrganizationMemberDeleteType) => Promise<void>;
};

type Props = {
  children: React.ReactNode;
};

export const OrganizationMembersContext = createContext<OrganizationMembersContextType | null>(
  null
);

export const OrganizationMembersContextProvider = ({ children }: Props) => {
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
      if (selectedOrganization) {
        return getOrganizationMembers(selectedOrganization?.id);
      }
      return [];
    },
  });

  const addOrganizationMember = useCallback(
    async (body: OrganizationMemberCreateType) => {
      await postOrganizationMember(body);
      await reloadOrganizationMembers();
    },
    [reloadOrganizationMembers]
  );

  const updateOrganizationMember = useCallback(
    async (body: OrganizationMemberUpdateType) => {
      await putOrganizationMember(body);
      await reloadOrganizationMembers();
    },
    [reloadOrganizationMembers]
  );

  const removeOrganizationMember = useCallback(
    async (body: OrganizationMemberDeleteType) => {
      await deleteOrganizationMember(body);
      await reloadOrganizationMembers();
    },
    [reloadOrganizationMembers]
  );

  const defaultValue: OrganizationMembersContextType = {
    selectedOrganizationMember,
    setSelectedOrganizationMember,
    organizationMembers,
    isLoadingOrganizationMembers,
    addOrganizationMember,
    updateOrganizationMember,
    removeOrganizationMember,
  };

  return (
    <OrganizationMembersContext.Provider value={defaultValue}>
      {children}
    </OrganizationMembersContext.Provider>
  );
};
