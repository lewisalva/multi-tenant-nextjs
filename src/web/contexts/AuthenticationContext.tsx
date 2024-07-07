import { useQuery } from '@tanstack/react-query';
import { createContext } from 'react';

import { getUser } from '~/web/actions/users';
import { type SimpleUser } from '../../server/models/User';

export type AuthenticationContextType = {
  isLoggedIn: boolean;
  user?: SimpleUser | null;
  refetch: () => Promise<void>;
};

type Props = {
  children: React.ReactNode;
  user: SimpleUser | null;
};

export const AuthenticationContext = createContext<AuthenticationContextType | null>(null);

export const AuthenticationContextProvider = ({ children, user }: Props) => {
  const { data: currentUser, refetch } = useQuery({
    queryKey: ['validateSession'],
    queryFn: () => getUser(),
    initialData: user,
    staleTime: 5000,
  });

  const defaultValue: AuthenticationContextType = {
    user: currentUser,
    isLoggedIn: !!currentUser,
    refetch: async () => {await refetch()},
  };

  return (
    <AuthenticationContext.Provider value={defaultValue}>{children}</AuthenticationContext.Provider>
  );
};
