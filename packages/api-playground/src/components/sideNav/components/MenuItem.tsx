//lib
import { useCallback, useState } from 'react';

// components
import { Typography } from '~/shared/typography';
import { VscChevronDown, VscAdd } from 'react-icons/vsc';
import { ChildMenuItem } from './ChildMenuItem';

//constants
import { Template } from '~/constants/template';

// utils
import { handleKeyDown } from '../utils';

//types
import { TemplateConfig } from '~/types';

type Props = {
  config: TemplateConfig;
  activeNavItem: string;
  activeSubNavItem: string | undefined;
  onNavItemClick: (id: string, subId?: string) => void;
  onAddTab?: (id: string, subId?: string) => void;
};

export const MenuItem = ({ config, activeNavItem, activeSubNavItem, onNavItemClick, onAddTab }: Props) => {
  const [open, setOpen] = useState(true);

  const isSelected = config.id === activeNavItem;
  const isNestedTemplate = config.type === Template.NESTED_TEMPLATE;

  const onMenuItemClick = useCallback(() => {
    if (isSelected) {
      return;
    }
    if (config.type === Template.NESTED_TEMPLATE) {
      onNavItemClick(config.id, config.templates[0]?.id);
    } else {
      onNavItemClick(config.id);
    }
  }, [isSelected, config, onNavItemClick]);

  const onChildItemClick = useCallback(
    (child: string) => {
      onNavItemClick(config.id, child);
    },
    [config.id, onNavItemClick]
  );

  return (
    <li className="border-0 border-solid expr-border-03 border-b-1" role="none">
      <div
        role="menuitem"
        tabIndex={0}
        aria-current={isSelected ? 'true' : undefined}
        aria-expanded={isNestedTemplate ? open : undefined}
        className={`px-4 py-3 cursor-pointer flex gap-2 items-center ${isSelected ? 'expr-ui-04' : 'hover-expr-ui-02'} `}
        onClick={onMenuItemClick}
        onKeyDown={e => handleKeyDown(e, onMenuItemClick)}
      >
        <Typography variant="body-14" className={`flex-1 ${isSelected ? 'expr-text-05' : ''}`}>
          {config.title}
        </Typography>
        {onAddTab && !isNestedTemplate ? (
          <VscAdd
            size={14}
            className={`${isSelected ? 'expr-text-05' : 'expr-text-03'} cursor-pointer`}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              onAddTab(config.id);
            }}
          />
        ) : null}
        {isNestedTemplate ? (
          <VscChevronDown
            size={16}
            strokeWidth={0.5}
            fill={isSelected ? 'var(--expr-icon-05)' : 'var(--expr-icon-01)'}
            stroke={isSelected ? 'var(--expr-icon-05)' : 'var(--expr-icon-01)'}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              setOpen(a => !a);
            }}
            style={{
              rotate: open ? '-180deg' : '0deg',
              transitionDuration: '300ms',
            }}
          />
        ) : null}
      </div>
      {isNestedTemplate && open ? (
        <ul role="menu" className="list-none p-0 m-0">
          {config.templates.map(child => (
            <ChildMenuItem
              key={child.id}
              onClick={onChildItemClick}
              config={child}
              selected={activeSubNavItem === child.id}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
};
