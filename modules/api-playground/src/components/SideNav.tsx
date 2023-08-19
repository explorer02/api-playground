// lib
import { useCallback, MouseEvent } from 'react';

// components
import { Typography } from '@/spaceweb/typography';

//constants
import { Template } from '@/constants/template';

//types
import { TemplateConfig } from '../types';

type Props = {
  config: TemplateConfig[];
  activeNavItem: string;
  activeSubNavItem: string | undefined;
  onNavItemClick: (id: string, subId?: string) => void;
};

export const SideNav = ({ config, activeNavItem, activeSubNavItem, onNavItemClick }: Props): JSX.Element => {
  const handleItemClick = useCallback(
    (ev: MouseEvent<HTMLDivElement>) => {
      const { id, child } = ev.currentTarget.dataset;

      if (id) {
        onNavItemClick(id, child);
      }
    },
    [onNavItemClick]
  );

  return (
    <div className="flex flex-col border-1 border-b-0 border-solid spr-border-03 rounded-8 overflow-hidden w-48 spr-ui-01">
      {config.map(config => {
        const isSelected = config.id === activeNavItem;
        const isNestedTemplate = config.type === Template.NESTED_TEMPLATE;

        return (
          <div key={config.id}>
            <div
              className={`px-4 py-3 border-0 border-solid spr-border-03 ${
                isSelected ? 'spr-ui-04' : 'hover:spr-ui-02'
              } ${isNestedTemplate ? '' : 'border-b-1 cursor-pointer'}`}
              onClick={isNestedTemplate ? undefined : handleItemClick}
              data-id={config.id}
            >
              <Typography variant="body-14" className={isSelected ? 'spr-text-05' : ''}>
                {config.title}
              </Typography>
            </div>
            <div>
              {isNestedTemplate &&
                config.templates.map(child => (
                  <div
                    key={child.id}
                    className={`pl-8 pr-4 py-3 cursor-pointer spr-border-03 ${
                      child.id === activeSubNavItem ? 'spr-ui-03' : 'hover:spr-ui-02'
                    }`}
                    onClick={handleItemClick}
                    data-id={config.id}
                    data-child={child.id}
                  >
                    <Typography variant="body-14">{child.title}</Typography>
                  </div>
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
