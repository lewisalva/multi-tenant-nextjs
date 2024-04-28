import { useContext } from 'react';

import { AuthenticationContext } from './AuthenticationContext';

export const useAuthenticationContext = () => {
  const context = useContext(AuthenticationContext);

  if (!context) {
    throw new Error('useAuthenticationContext must be used within AuthenticationContextProvider');
  }

  return context;
};
