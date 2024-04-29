import { redirect } from 'next/navigation';
import { auth } from '../authentication';
import { type ReactNode } from 'react';
import Portal from '../../web/components/pages/Portal';
import { findOrganizationsForUser } from '../../server/models/Organization';

export default async function PortalLayout({ children }: { children: ReactNode }) {
  const user = await auth();
  if (!user) {
    return redirect('/signin');
  }
  const organizations = await findOrganizationsForUser(user);

  return (
    <Portal orgs={organizations}>
      {children}
    </Portal>
  );
}
