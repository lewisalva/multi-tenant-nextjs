'use client';
import { type ReactNode, useState } from 'react';

import { SiteNav } from '~/web/components/SiteNav';
import { OrganizationContextProvider } from '~/web/contexts/OrganizationContext';
import { type Organization } from '../../../server/models/Organization';

export default function Portal({ children, orgs = [] }: { children: ReactNode, orgs?: Organization[] }) {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <OrganizationContextProvider orgs={orgs}>
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
