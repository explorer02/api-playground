//lib
import { memo } from 'react';

// components
import { MenuItem } from './components/MenuItem';

//types
import { TemplateConfig } from '~/types';

type Props = {
  config: TemplateConfig[];
  activeNavItem: string;
  activeSubNavItem: string | undefined;
  onNavItemClick: (id: string, subId?: string) => void;
  onAddTab?: (id: string, subId?: string) => void;
};

const SideNav = ({ config, activeNavItem, activeSubNavItem, onNavItemClick, onAddTab }: Props): JSX.Element => {
  return (
    <nav aria-label="API Playground navigation">
      <ul
        role="menu"
        className="flex flex-col border-1 border-b-0 border-solid expr-border-03 rounded-8 overflow-hidden w-48 expr-ui-01 list-none p-0 m-0"
      >
        {config.map(item => {
          return (
            <MenuItem
              key={item.id}
              activeNavItem={activeNavItem}
              activeSubNavItem={activeSubNavItem}
              config={item}
              onNavItemClick={onNavItemClick}
              onAddTab={onAddTab}
            />
          );
        })}
      </ul>
    </nav>
  );
};

const MemoizedSideNav = memo(SideNav);

export { MemoizedSideNav as SideNav };
