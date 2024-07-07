import { useQuery } from '@tanstack/react-query';
import { createContext } from 'react';

import { signin, signout, signup } from '~/web/actions/auth';
import { getUser } from '~/web/actions/users';
import { type SimpleUser } from '../../server/models/User';

export type AuthenticationContextType = {
  isLoggedIn: boolean;
  user?: SimpleUser | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
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

  const signIn = async (email: string, password: string) => {
    await signin({ email, password });

    await refetch();
  };

  const signUp = async (name: string, email: string, password: string) => {
    await signup({ name, email, password });

    await refetch();
  };

  const signOut = async () => {
    await signout();

    await refetch();
  };

  const defaultValue: AuthenticationContextType = {
    user: currentUser,
    isLoggedIn: !!currentUser,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthenticationContext.Provider value={defaultValue}>{children}</AuthenticationContext.Provider>
  );
};
