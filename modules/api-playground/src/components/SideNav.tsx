// lib
import { useCallback, MouseEvent } from 'react';

// components
import { Box } from '@sprinklrjs/spaceweb/box';
import { Typography } from '@sprinklrjs/spaceweb/typography';
import { TemplateConfig } from '../types';

type Props = {
  config: TemplateConfig[];
  activeNavItem: string;
  onNavItemClick: (id: string) => void;
};

export const SideNav = ({ config, activeNavItem, onNavItemClick }: Props): JSX.Element => {
  const handleItemClick = useCallback(
    (ev: MouseEvent<HTMLDivElement>) => {
      const { id } = ev.currentTarget.dataset;
      if (id) {
        onNavItemClick(id);
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
              'px-4 py-3 cursor-pointer border-0 border-solid spr-border-03',
              config.id === activeNavItem ? 'spr-ui-04 spr-text-05' : 'hover:spr-ui-02',
              // config.children?.length ? '' : 'border-b-1',
            ]}
            onClick={handleItemClick}
            data-id={config.id}
          >
            <Typography variant="body-16">{config.title}</Typography>
          </Box>
          <Box>
            {/* {navItem.children?.map(child => (
              <Box
                key={child.id}
                className={[
                  'pl-8 pr-4 py-3 cursor-pointer spr-border-03',
                  child.id === activeSubGame ? 'spr-ui-03' : 'hover:spr-ui-02',
                ]}
                onClick={handleItemClick}
                data-game={navItem.id}
                data-subgame={child.id}
              >
                <Typography variant="body-16">{child.label}</Typography>
              </Box>
            ))} */}
          </Box>
        </Box>
      ))}
    </Box>
  );
};
