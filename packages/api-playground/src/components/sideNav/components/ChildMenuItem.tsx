// components
import { Typography } from '~/shared/typography';
import { BsArrowReturnRight } from 'react-icons/bs';

// utils
import { handleKeyDown } from '../utils';

//types
import { TemplateConfig } from '~/types';

type Props = {
  config: TemplateConfig;
  selected?: boolean;
  onClick: (id: string) => void;
};

export const ChildMenuItem = ({ config: { id, title }, selected, onClick }: Props) => {
  return (
    <li
      role="menuitem"
      tabIndex={0}
      aria-current={selected ? 'true' : undefined}
      className={`pl-4 pr-4 py-3 cursor-pointer flex items-center gap-2 expr-border-03 ${
        selected ? 'expr-ui-03' : 'hover-expr-ui-02'
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
