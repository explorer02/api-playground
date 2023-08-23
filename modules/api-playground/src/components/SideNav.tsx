//lib
import { memo, useState } from 'react';

// components
import { Typography } from '@/spaceweb/typography';
import { BsArrowReturnRight } from 'react-icons/bs';
import { VscChevronDown } from 'react-icons/vsc';

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
    <div
      key={id}
      className={`pl-4 pr-4 py-3 cursor-pointer flex items-center gap-2 spr-border-03 ${
        selected ? 'spr-ui-03' : 'hover-spr-ui-02'
      }`}
      onClick={() => onClick(id)}
      data-child={id}
    >
      <BsArrowReturnRight size={12} />
      <Typography variant="body-14" className="truncate">
        {title}
      </Typography>
    </div>
  );
};

const MenuItem = ({
  config,
  activeNavItem,
  activeSubNavItem,
  onNavItemClick,
}: {
  config: TemplateConfig;
} & Pick<Props, 'activeNavItem' | 'activeSubNavItem' | 'onNavItemClick'>) => {
  const [open, setOpen] = useState(true);

  const isSelected = config.id === activeNavItem;
  const isNestedTemplate = config.type === Template.NESTED_TEMPLATE;

  const onMenuItemClick = () => {
    if (isSelected) {
      return;
    }
    if (config.type === Template.NESTED_TEMPLATE) {
      onNavItemClick(config.id, config.templates[0]?.id);
    } else {
      onNavItemClick(config.id);
    }
  };

  const onChildItemClick = (child: string) => {
    onNavItemClick(config.id, child);
  };

  return (
    <div className="border-0 border-solid spr-border-03 border-b-1">
      <div
        className={`px-4 py-3 cursor-pointer flex gap-2 items-center ${isSelected ? 'spr-ui-04' : 'hover-spr-ui-02'} `}
        onClick={onMenuItemClick}
      >
        <Typography variant="body-14" className={`flex-1 ${isSelected ? 'spr-text-05' : ''}`}>
          {config.title}
        </Typography>
        {isNestedTemplate ? (
          <VscChevronDown
            size={16}
            strokeWidth={0.5}
            fill={isSelected ? 'var(--spr-icon-05)' : 'var(--spr-icon-01)'}
            stroke={isSelected ? 'var(--spr-icon-05)' : 'var(--spr-icon-01)'}
            onClick={e => {
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
      <div>
        {isNestedTemplate &&
          open &&
          config.templates.map(child => (
            <ChildMenuItem
              key={child.id}
              onClick={onChildItemClick}
              config={child}
              selected={activeSubNavItem === child.id}
            />
          ))}
      </div>
    </div>
  );
};

const SideNav = ({ config, activeNavItem, activeSubNavItem, onNavItemClick }: Props): JSX.Element => {
  return (
    <div className="flex flex-col border-1 border-b-0 border-solid spr-border-03 rounded-8 overflow-hidden w-48 spr-ui-01">
      {config.map(config => {
        return (
          <MenuItem
            key={config.id}
            activeNavItem={activeNavItem}
            activeSubNavItem={activeSubNavItem}
            config={config}
            onNavItemClick={onNavItemClick}
          />
        );
      })}
    </div>
  );
};

const MemoizedSideNav = memo(SideNav);

export { MemoizedSideNav as SideNav };
