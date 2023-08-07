// lib
import { useCallback, MouseEvent } from 'react';

// components
import { Box } from '@sprinklrjs/spaceweb/box';
import { Typography } from '@sprinklrjs/spaceweb/typography';

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
    <Box className="flex flex-col border-1 border-solid spr-border-03 rounded-8 overflow-hidden w-48 spr-ui-01">
      {config.map(config => (
        <Box key={config.id}>
          <Box
            className={[
              'px-4 py-3 border-0 border-solid spr-border-03',
              config.id === activeNavItem ? 'spr-ui-04 spr-text-05' : 'hover:spr-ui-02',
              config.type === Template.NESTED_TEMPLATE ? '' : 'border-b-1 cursor-pointer',
            ]}
            onClick={config.type === Template.NESTED_TEMPLATE ? undefined : handleItemClick}
            data-id={config.id}
          >
            <Typography variant="body-16">{config.title}</Typography>
          </Box>
          <Box>
            {config.type === Template.NESTED_TEMPLATE &&
              config.templates.map(child => (
                <Box
                  key={child.id}
                  className={[
                    'pl-8 pr-4 py-3 cursor-pointer spr-border-03',
                    child.id === activeSubNavItem ? 'spr-ui-03' : 'hover:spr-ui-02',
                  ]}
                  onClick={handleItemClick}
                  data-id={config.id}
                  data-child={child.id}
                >
                  <Typography variant="body-16">{child.title}</Typography>
                </Box>
              ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};
