import { Typography } from '@/spaceweb/typography';

import { Option } from '../types';

type Props = {
  options: Option[];
  onClose: () => void;
  onChange: (option: Option) => void;
  selected?: Option;
};

export const Menu = ({ options, onClose, onChange, selected }: Props) => {
  if (!options.length) {
    return (
      <div className="py-1.5 px-2 rounded-8 hover:spr-ui-05">
        <Typography>No Results</Typography>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto select-menu" style={{ maxHeight: '300px' }}>
      {options.map(option => (
        <div
          key={option.id}
          className={`py-1.5 px-2 rounded-8 cursor-pointer break-all ${
            selected?.id === option.id ? 'spr-ui-05' : 'hover:spr-ui-05'
          }`}
          onClick={() => {
            onChange(option);
            onClose();
          }}
        >
          <Typography>{option.label}</Typography>
        </div>
      ))}
    </div>
  );
};
