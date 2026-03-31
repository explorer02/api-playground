'use client';

// lib
import { ComponentType, useCallback, useMemo, useState } from 'react';

// components
import { SideNav } from './components/SideNav';
import { StaticDataViewer } from './components/StaticDataViewer';
import { CacheViewer } from './components/cacheViewer';
import { QueryExecutor } from './components/queryExecutor';
import { MutationExecutor } from './components/mutationExecutor';
import { CustomQuery } from './components/customQuery';
import { CustomMutation } from './components/customMutation';
import { FetchAndMutate } from './components/fetchAndMutate';
import { SnackbarProvider } from './context/SnackbarContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Typography } from './shared/typography';

//constants
import { Template } from './constants/template';

//types
import { APIPlaygroundProps, NestedTemplateConfig, TemplateConfig } from './types';


const TEMPLATE_COMPONENT_MAP: Partial<Record<Template, ComponentType<{ config: any }>>> = {
  [Template.STATIC_DATA]: StaticDataViewer,
  [Template.CACHE_VIEWER]: CacheViewer,
  [Template.QUERY_EXECUTOR]: QueryExecutor,
  [Template.MUTATION_EXECUTOR]: MutationExecutor,
  [Template.CUSTOM_QUERY]: CustomQuery,
  [Template.CUSTOM_MUTATION]: CustomMutation,
  [Template.FETCH_AND_MUTATE]: FetchAndMutate,
};

export const APIPlayground = ({ config }: APIPlaygroundProps): JSX.Element => {
  if (!config || config.length === 0) {
    return (
      <div className="explorer-container hyperspace-light flex items-center justify-center" style={{ height: '100%' }}>
        <Typography variant="body-16" className="spr-text-03">
          No templates configured
        </Typography>
      </div>
    );
  }

  return <APIPlaygroundInner config={config} />;
};

const APIPlaygroundInner = ({ config }: { config: TemplateConfig[] }): JSX.Element => {
  const [activeNavItem, setActiveNavItem] = useState<string>(config[0].id);
  const [activeSubNavItem, setActiveSubNavItem] = useState<string | undefined>(
    (config[0] as NestedTemplateConfig).templates?.[0]?.id
  );

  const onNavItemClick = useCallback((navItem: string, subNavItem?: string) => {
    setActiveNavItem(navItem);
    setActiveSubNavItem(subNavItem);
  }, []);

  const activeTemplateConfig = useMemo(() => {
    const primaryConfig = config.find(c => c.id === activeNavItem);
    if (!primaryConfig) return config[0];
    if (activeSubNavItem) {
      const secondaryConfig = (primaryConfig as NestedTemplateConfig).templates?.find(t => t.id === activeSubNavItem);
      return secondaryConfig ?? primaryConfig;
    }
    return primaryConfig;
  }, [activeNavItem, activeSubNavItem, config]);

  const templateKey = `${activeNavItem}/${activeSubNavItem ?? ''}`;

  let el;
  if (activeTemplateConfig.type === Template.CUSTOM) {
    const { Component } = activeTemplateConfig;
    el = <Component key={templateKey} />;
  } else {
    const TemplateComponent = TEMPLATE_COMPONENT_MAP[activeTemplateConfig.type];
    el = TemplateComponent ? <TemplateComponent config={activeTemplateConfig} key={templateKey} /> : null;
  }

  return (
    <div className="explorer-container hyperspace-light" style={{ height: '100%' }}>
      <SnackbarProvider>
        <div className="w-full flex gap-8 h-full">
          <div className="flex-none" style={{ maxWidth: '350px', minWidth: '200px' }}>
            <SideNav
              config={config}
              activeNavItem={activeNavItem}
              activeSubNavItem={activeSubNavItem}
              onNavItemClick={onNavItemClick}
            />
          </div>
          <div className="flex-1">
            <ErrorBoundary>{el}</ErrorBoundary>
          </div>
        </div>
      </SnackbarProvider>
    </div>
  );
};
