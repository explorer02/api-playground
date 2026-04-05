//lib
import { KeyboardEvent, memo, useCallback, useState } from 'react';

// components
import { Typography } from '@/shared/typography';
import { BsArrowReturnRight } from 'react-icons/bs';
import { VscChevronDown, VscAdd } from 'react-icons/vsc';

//constants
import { Template } from '@/constants/template';

//types
import { TemplateConfig } from '../types';

type Props = {
  config: TemplateConfig[];
  activeNavItem: string;
  activeSubNavItem: string | undefined;
  onNavItemClick: (id: string, subId?: string) => void;
  onAddTab?: (id: string, subId?: string) => void;
};

const handleKeyDown = (e: KeyboardEvent, action: () => void) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    action();
  }
};

const ChildMenuItem = ({
  config: { id, title },
  selected,
  onClick,
}: {
  config: TemplateConfig;
  selected?: boolean;
  onClick: (id: string) => void;
}) => {
  return (
    <li
      role="menuitem"
      tabIndex={0}
      aria-current={selected ? 'true' : undefined}
      className={`pl-4 pr-4 py-3 cursor-pointer flex items-center gap-2 spr-border-03 ${
        selected ? 'spr-ui-03' : 'hover-spr-ui-02'
      }`}
      onClick={() => onClick(id)}
      onKeyDown={e => handleKeyDown(e, () => onClick(id))}
      data-child={id}
    >
      <BsArrowReturnRight size={12} />
      <Typography variant="body-14" className="truncate">
        {title}
      </Typography>
    </li>
  );
};

const MenuItem = ({
  config,
  activeNavItem,
  activeSubNavItem,
  onNavItemClick,
  onAddTab,
}: {
  config: TemplateConfig;
} & Pick<Props, 'activeNavItem' | 'activeSubNavItem' | 'onNavItemClick' | 'onAddTab'>) => {
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
    <li className="border-0 border-solid spr-border-03 border-b-1" role="none">
      <div
        role="menuitem"
        tabIndex={0}
        aria-current={isSelected ? 'true' : undefined}
        aria-expanded={isNestedTemplate ? open : undefined}
        className={`px-4 py-3 cursor-pointer flex gap-2 items-center ${isSelected ? 'spr-ui-04' : 'hover-spr-ui-02'} `}
        onClick={onMenuItemClick}
        onKeyDown={e => handleKeyDown(e, onMenuItemClick)}
      >
        <Typography variant="body-14" className={`flex-1 ${isSelected ? 'spr-text-05' : ''}`}>
          {config.title}
        </Typography>
        {onAddTab && !isNestedTemplate ? (
          <VscAdd
            size={14}
            className="spr-text-03 cursor-pointer"
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
            fill={isSelected ? 'var(--spr-icon-05)' : 'var(--spr-icon-01)'}
            stroke={isSelected ? 'var(--spr-icon-05)' : 'var(--spr-icon-01)'}
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

const SideNav = ({ config, activeNavItem, activeSubNavItem, onNavItemClick, onAddTab }: Props): JSX.Element => {
  return (
    <nav aria-label="API Playground navigation">
      <ul
        role="menu"
        className="flex flex-col border-1 border-b-0 border-solid spr-border-03 rounded-8 overflow-hidden w-48 spr-ui-01 list-none p-0 m-0"
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
