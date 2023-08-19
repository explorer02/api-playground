'use client';

// lib
import { useCallback, useMemo, useState } from 'react';

// components
import { SideNav } from './components/SideNav';
import { StaticDataViewer } from './components/StaticDataViewer';
import { CacheViewer } from './components/cacheViewer';
import { QueryExecutor } from './components/queryExecutor';
import { MutationExecutor } from './components/mutationExecutor';
import { CustomQuery } from './components/customQuery';
import { CustomMutation } from './components/customMutation';
import { FetchAndMutate } from './components/fetchAndMutate';

//constants
import { Template } from './constants/template';

//types
import { APIPlaygroundProps, NestedTemplateConfig } from './types';

export const APIPlayground = ({ config }: APIPlaygroundProps): JSX.Element => {
  const [activeNavItem, setActiveNavItem] = useState<string>(config[0].id);
  const [activeSubNavItem, setActiveSubNavItem] = useState<string>();

  const onNavItemClick = useCallback((navItem: string, subNavItem?: string) => {
    setActiveNavItem(navItem);
    setActiveSubNavItem(subNavItem);
  }, []);

  const activeTemplateConfig = useMemo(() => {
    const primaryConfig = config.find(c => c.id === activeNavItem)!;
    if (activeSubNavItem) {
      const secondaryConfig = (primaryConfig as NestedTemplateConfig).templates.find(t => t.id === activeSubNavItem)!;
      return secondaryConfig;
    }
    return primaryConfig;
  }, [activeNavItem, activeSubNavItem, config]);

  const activeTemplate = activeTemplateConfig.type;

  let el;
  if (activeTemplate === Template.STATIC_DATA) {
    el = <StaticDataViewer config={activeTemplateConfig} key={activeNavItem + activeSubNavItem} />;
  } else if (activeTemplate === Template.CACHE_VIEWER) {
    el = <CacheViewer config={activeTemplateConfig} key={activeNavItem + activeSubNavItem} />;
  } else if (activeTemplate === Template.QUERY_EXECUTOR) {
    el = <QueryExecutor config={activeTemplateConfig} key={activeNavItem + activeSubNavItem} />;
  } else if (activeTemplate === Template.MUTATION_EXECUTOR) {
    el = <MutationExecutor config={activeTemplateConfig} key={activeNavItem + activeSubNavItem} />;
  } else if (activeTemplate === Template.CUSTOM_QUERY) {
    el = <CustomQuery config={activeTemplateConfig} key={activeNavItem + activeSubNavItem} />;
  } else if (activeTemplate === Template.CUSTOM_MUTATION) {
    el = <CustomMutation config={activeTemplateConfig} key={activeNavItem + activeSubNavItem} />;
  } else if (activeTemplate === Template.FETCH_AND_MUTATE) {
    el = <FetchAndMutate config={activeTemplateConfig} key={activeNavItem + activeSubNavItem} />;
  }

  return (
    <div className="explorer-container hyperspace-light" style={{ height: '100%' }}>
      <div className="w-full flex gap-8 h-full">
        <div className="flex-none">
          <SideNav
            config={config}
            activeNavItem={activeNavItem}
            activeSubNavItem={activeSubNavItem}
            onNavItemClick={onNavItemClick}
          />
        </div>
        <div className="flex-1">{el}</div>
      </div>
    </div>
  );
};
