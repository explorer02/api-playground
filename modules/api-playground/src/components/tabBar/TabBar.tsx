import { memo } from 'react';
import { VscClose } from 'react-icons/vsc';
import { Typography } from '@/shared/typography';

export type TabInstance = {
  id: string;
  templateId: string;
  subTemplateId?: string;
  title: string;
  instanceIndex: number;
};

type Props = {
  tabs: TabInstance[];
  activeTabId: string;
  onTabClick: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
};

const TabBar = ({ tabs, activeTabId, onTabClick, onTabClose }: Props) => {
  if (tabs.length <= 1) return null;

  return (
    <div className="flex-none flex items-center border-0 border-b-1 border-solid spr-border-03 gap-0 overflow-x-auto mb-2">
      {tabs.map(tab => {
        const isActive = tab.id === activeTabId;
        return (
          <div
            key={tab.id}
            className={`flex items-center gap-2 px-3 py-2 cursor-pointer border-0 border-b-2 border-solid ${
              isActive ? 'spr-ui-01 border-b-interactive' : 'spr-ui-02 border-b-transparent hover-spr-ui-02'
            }`}
            style={{ borderBottomColor: isActive ? 'var(--spr-interactive-01)' : 'transparent' }}
            onClick={() => onTabClick(tab.id)}
          >
            <Typography variant="body-14" className={isActive ? 'spr-text-01' : 'spr-text-03'}>
              {tab.title}
              {tab.instanceIndex > 1 ? ` (${tab.instanceIndex})` : ''}
            </Typography>
            <VscClose
              size={14}
              className="spr-text-03 cursor-pointer"
              onClick={e => {
                e.stopPropagation();
                onTabClose(tab.id);
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

const MemoizedTabBar = memo(TabBar);
export { MemoizedTabBar as TabBar };
