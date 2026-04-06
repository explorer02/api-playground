//lib
import { VscAdd, VscClose } from 'react-icons/vsc';

//components
import { Button } from '~/shared/button/Button';
import { Input } from '~/shared/input';
import { Typography } from '~/shared/typography';

//types
import { Header } from '../types';

type Props = {
  headers: Header[];
  addHeader: () => void;
  removeHeader: (index: number) => void;
  updateHeader: (index: number, field: 'key' | 'value', value: string) => void;
};

export const HeadersEditor = ({ headers, addHeader, removeHeader, updateHeader }: Props) => (
  <div className="flex-none flex flex-col gap-2">
    <div className="flex items-center gap-2">
      <Typography variant="h6">Headers</Typography>
      <Button size="xs" variant="secondary" onClick={addHeader} icon tooltipContent="Add Header">
        <VscAdd size={14} />
      </Button>
    </div>
    {headers.map((header, index) => (
      <div key={index} className="flex gap-2 items-center">
        <Input
          size="xs"
          placeholder="Key"
          value={header.key}
          onChange={e => updateHeader(index, 'key', e.target.value)}
          className="flex-1"
        />
        <Input
          size="xs"
          placeholder="Value"
          value={header.value}
          onChange={e => updateHeader(index, 'value', e.target.value)}
          className="flex-1"
        />
        <Button size="xs" variant="secondary" onClick={() => removeHeader(index)} icon tooltipContent="Remove">
          <VscClose size={14} />
        </Button>
      </div>
    ))}
  </div>
);
