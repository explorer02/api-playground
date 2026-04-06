//lib
import { VscSend } from 'react-icons/vsc';

//components
import { Button } from '~/shared/button/Button';
import { Input } from '~/shared/input';
import { Select } from '~/shared/select/Select';

//types
import { HttpMethod } from '../types';

const HTTP_METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
const HTTP_METHOD_OPTIONS = HTTP_METHODS.map(m => ({ id: m, label: m }));

type Props = {
  method: HttpMethod;
  setMethod: (method: HttpMethod) => void;
  url: string;
  setUrl: (url: string) => void;
  execute: () => void;
};

export const RequestBar = ({ method, setMethod, url, setUrl, execute }: Props) => (
  <div className="flex-none flex gap-3 items-center">
    <div style={{ width: '120px' }}>
      <Select
        size="xs"
        options={HTTP_METHOD_OPTIONS}
        value={HTTP_METHOD_OPTIONS.find(o => o.id === method)}
        onChange={o => setMethod(o.id as HttpMethod)}
      />
    </div>
    <Input className="flex-1" placeholder="Enter URL" value={url} onChange={e => setUrl(e.target.value)} />
    <Button className="flex-none" size="xs" tooltipContent="Execute" onClick={execute} icon>
      <VscSend />
    </Button>
  </div>
);
