'use client';

// import { LinkUnstyled } from '../../components/LinkUnstyled';
import { clsx } from 'clsx';
import { useMemo, useState } from 'react';

import { ContentHeader } from '~/web/components/ContentHeader';
import { SidePanel } from '~/web/components/SidePanel';
import { useOrganizationContext } from '~/web/contexts/useOrganizationContext';
import { colorByIndex/*, randomColor*/ } from '~/web/utilities/randomColor';
import { OrganizationCreate } from './OrganizationCreate';
import { type Organization } from '../../../server/models/Organization';

type OrganizationCardProps = {
  isSelected?: boolean;
  loading?: boolean;
  organization: Organization;
  setSelectedOrganization: () => void;
  index: number;
};

const OrganizationCard = ({
  isSelected = false,
  // loading,
  organization,
  setSelectedOrganization,
  index,
}: OrganizationCardProps) => {
  // const cardColor = useMemo(() => randomColor(), []);
  const cardColor = useMemo(() => colorByIndex(index), [index]);

  return (
    <li
      key={organization.id}
      className={clsx(
        isSelected ? 'bg-gray-100' : 'bg-white',
        'col-span-1 flex rounded-md shadow-sm cursor-pointer'
      )}
      onClick={setSelectedOrganization}
    >
      <div
        className={clsx(
          cardColor,
          'flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white'
        )}
      >
        {organization.name.charAt(0)}
      </div>
      <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 ">
        <div className="flex-1 truncate px-4 py-2 text-sm">
          <p className="font-medium text-gray-900">{organization.name}</p>
          {/* <p className="text-gray-500">{organization.members} Members</p> */}
        </div>
      </div>
    </li>
  );
};

export const Organizations = () => {
  const { organizations, selectedOrganization, setSelectedOrganization } = useOrganizationContext();
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  return (
    <>
      <ContentHeader title="Organizations">
        <button
          type="button"
          className="order-0 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:order-1 sm:ml-3"
          onClick={() => setIsSidePanelOpen(true)}
        >
          Create
        </button>
      </ContentHeader>
      <div className="container mx-auto sm:px-6 lg:px-8">
        <ul role="list" className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {organizations.map((organization, index) => (
            <OrganizationCard
              key={organization.id}
              organization={organization}
              isSelected={selectedOrganization?.id === organization.id}
              setSelectedOrganization={() => setSelectedOrganization(organization)}
              index={index}
            />
          ))}
        </ul>
      </div>
      <SidePanel isOpen={isSidePanelOpen} closePanel={() => setIsSidePanelOpen(false)}>
        <OrganizationCreate closePanel={() => setIsSidePanelOpen(false)} />
      </SidePanel>
    </>
  );
};

export default Organizations;
