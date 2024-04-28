import { useQuery } from '@tanstack/react-query';
import { createContext } from 'react';

import { signin, signout, signup } from '~/web/services/auth';
import { getUser, type User } from '~/web/services/users';

export type AuthenticationContextType = {
  isLoggedIn: boolean;
  user?: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

type Props = {
  children: React.ReactNode;
};

export const AuthenticationContext = createContext<AuthenticationContextType | null>(null);

export const AuthenticationContextProvider = ({ children }: Props) => {
  const { data: user, refetch } = useQuery({
    queryKey: ['validateSession'],
    queryFn: () => getUser(),
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
    user,
    isLoggedIn: !!user,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthenticationContext.Provider value={defaultValue}>{children}</AuthenticationContext.Provider>
  );
};
