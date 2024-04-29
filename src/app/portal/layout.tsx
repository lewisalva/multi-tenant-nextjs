'use client';

import { type ReactNode, useState } from 'react';

import { SiteNav } from '~/web/components/SiteNav';
import { OrganizationContextProvider } from '~/web/contexts/OrganizationContext';
import { useAuthenticationContext } from '~/web/contexts/useAuthenticationContext';
import { useRouter } from 'next/navigation';

export const PortalTemplate = ({ children }: { children: ReactNode}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isLoggedIn } = useAuthenticationContext();
  const router = useRouter();

  if (isLoggedIn !== true) {
    router.push('/');
    return null;
  }

  return (
    <OrganizationContextProvider>
      <div className="min-h-full">
        <SiteNav sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
          <main className="flex-1">
            {children}
          </main>
        </SiteNav>
      </div>
    </OrganizationContextProvider>
  );
};

export default PortalTemplate
