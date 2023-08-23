//lib
import { LegacyRef, useMemo, useState } from 'react';

//components
import { Input } from '../input';
import { Popover } from './components/Popover';
import { Menu } from './components/Menu';
import { VscChevronDown } from 'react-icons/vsc';

//types
import { Option } from './types';

type Props = {
  size?: 'xs' | 'md';
  placeholder?: string;
  onChange: (option: Option) => void;
  options: Option[];
  value?: Option;
  className?: string;
};

export const Select = ({ options, onChange, placeholder = 'Select...', size = 'md', value, className = '' }: Props) => {
  const [search, setSearch] = useState('');

  const filteredOptions = useMemo(
    () => options.filter(option => option.label.toLowerCase().includes(search.toLowerCase())),
    [options, search]
  );

  return (
    <div className={`explorer-space-select ${className}`}>
      <Popover
        content={({ close }) => (
          <Menu
            options={filteredOptions}
            onClose={close}
            onChange={option => {
              onChange(option);
              setSearch(option.label as string);
            }}
            selected={value}
          />
        )}
      >
        {({ onClick, isOpen, ref }) => (
          <div className="relative" onClick={onClick} ref={ref as LegacyRef<HTMLDivElement>}>
            <Input
              size={size}
              placeholder={placeholder}
              isActive={isOpen}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div
              className="absolute flex items-center cursor-pointer spr-ui-01"
              style={{ right: '8px', top: '4px', bottom: '4px' }}
            >
              <VscChevronDown
                style={{
                  rotate: isOpen ? '-180deg' : '0deg',
                  transitionDuration: '300ms',
                }}
              />
            </div>
          </div>
        )}
      </Popover>
    </div>
  );
};
