'use client';

// lib
import { ComponentType, useCallback, useMemo, useState } from 'react';

// components
import { SideNav } from './components/sideNav';
import { StaticDataViewer } from './components/StaticDataViewer';
import { CacheViewer } from './components/cacheViewer';
import { QueryExecutor } from './components/queryExecutor';
import { MutationExecutor } from './components/mutationExecutor';
import { CustomQuery } from './components/customQuery';
import { CustomMutation } from './components/customMutation';
import { FetchAndMutate } from './components/fetchAndMutate';
import { SchemaViewer } from './components/schemaViewer';
import { RestApi } from './components/restApi';
import { TabBar, TabInstance } from './components/tabBar/TabBar';
import { SnackbarProvider } from './context/SnackbarContext';
import { HistoryProvider } from './context/HistoryContext';
import { TabStateProvider, useTabState } from './context/TabStateContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Typography } from './shared/typography';

//constants
import { Template } from './constants/template';

//types
import { APIPlaygroundProps, NestedTemplateConfig, TemplateConfig } from './types';

// Resolve a template config by navItem + optional subNavItem
const resolveTemplateConfig = (config: TemplateConfig[], navItem: string, subNavItem?: string): TemplateConfig => {
  const primary = config.find(c => c.id === navItem);
  if (!primary) return config[0];
  if (subNavItem) {
    const secondary = (primary as NestedTemplateConfig).templates?.find(t => t.id === subNavItem);
    return secondary ?? primary;
  }
  return primary;
};

// Generate a unique tab ID
let tabCounter = 0;
const nextTabId = () => `tab-${++tabCounter}`;

const createTab = (
  config: TemplateConfig[],
  navItem: string,
  subNavItem?: string,
  existingTabs: TabInstance[] = []
): TabInstance => {
  const templateConfig = resolveTemplateConfig(config, navItem, subNavItem);
  const sameTypeTabs = existingTabs.filter(t => t.templateId === navItem && t.subTemplateId === subNavItem);
  return {
    id: nextTabId(),
    templateId: navItem,
    subTemplateId: subNavItem,
    title: templateConfig.title,
    instanceIndex: sameTypeTabs.length + 1,
  };
};

const TEMPLATE_COMPONENT_MAP: Partial<Record<Template, ComponentType<{ config: any; tabId: string }>>> = {
  [Template.STATIC_DATA]: StaticDataViewer,
  [Template.CACHE_VIEWER]: CacheViewer,
  [Template.QUERY_EXECUTOR]: QueryExecutor,
  [Template.MUTATION_EXECUTOR]: MutationExecutor,
  [Template.CUSTOM_QUERY]: CustomQuery,
  [Template.CUSTOM_MUTATION]: CustomMutation,
  [Template.FETCH_AND_MUTATE]: FetchAndMutate,
  [Template.SCHEMA_VIEWER]: SchemaViewer,
  [Template.REST_API]: RestApi,
};

const APIPlaygroundView = ({ config }: { config: TemplateConfig[] }): JSX.Element => {
  const { removeState } = useTabState();
  const firstNavItem = config[0].id;
  const firstSubNavItem = (config[0] as NestedTemplateConfig).templates?.[0]?.id;

  const [tabs, setTabs] = useState<TabInstance[]>(() => [createTab(config, firstNavItem, firstSubNavItem)]);
  const [activeTabId, setActiveTabId] = useState<string>(tabs[0].id);
  const [activeNavItem, setActiveNavItem] = useState<string>(firstNavItem);
  const [activeSubNavItem, setActiveSubNavItem] = useState<string | undefined>(firstSubNavItem);

  const onNavItemClick = useCallback(
    (navItem: string, subNavItem?: string) => {
      setActiveNavItem(navItem);
      setActiveSubNavItem(subNavItem);

      // Find existing tab for this template, or create one
      const existing = tabs.find(t => t.templateId === navItem && t.subTemplateId === subNavItem);
      if (existing) {
        setActiveTabId(existing.id);
      } else {
        const newTab = createTab(config, navItem, subNavItem, tabs);
        setTabs(prev => [...prev, newTab]);
        setActiveTabId(newTab.id);
      }
    },
    [config, tabs]
  );

  const onAddTab = useCallback(
    (navItem: string, subNavItem?: string) => {
      const newTab = createTab(config, navItem, subNavItem, tabs);
      setTabs(prev => [...prev, newTab]);
      setActiveTabId(newTab.id);
      setActiveNavItem(navItem);
      setActiveSubNavItem(subNavItem);
    },
    [config, tabs]
  );

  const onTabClick = useCallback(
    (tabId: string) => {
      setActiveTabId(tabId);
      const tab = tabs.find(t => t.id === tabId);
      if (tab) {
        setActiveNavItem(tab.templateId);
        setActiveSubNavItem(tab.subTemplateId);
      }
    },
    [tabs]
  );

  const onTabClose = useCallback(
    (tabId: string) => {
      removeState(tabId);
      setTabs(prev => {
        const updated = prev.filter(t => t.id !== tabId);
        if (updated.length === 0) {
          // Re-create a default tab if all are closed
          const defaultTab = createTab(config, firstNavItem, firstSubNavItem);
          setActiveTabId(defaultTab.id);
          setActiveNavItem(firstNavItem);
          setActiveSubNavItem(firstSubNavItem);
          return [defaultTab];
        }
        // If we closed the active tab, switch to the last remaining tab
        if (tabId === activeTabId) {
          const last = updated[updated.length - 1];
          setActiveTabId(last.id);
          setActiveNavItem(last.templateId);
          setActiveSubNavItem(last.subTemplateId);
        }
        return updated;
      });
    },
    [activeTabId, config, firstNavItem, firstSubNavItem, removeState]
  );

  // Render the active tab's template
  const activeTab = tabs.find(t => t.id === activeTabId);
  const activeTemplateConfig = useMemo(() => {
    if (!activeTab) return config[0];
    return resolveTemplateConfig(config, activeTab.templateId, activeTab.subTemplateId);
  }, [activeTab, config]);

  let el;
  if (activeTemplateConfig.type === Template.CUSTOM) {
    const { Component } = activeTemplateConfig;
    el = <Component key={activeTabId} />;
  } else {
    const TemplateComponent = TEMPLATE_COMPONENT_MAP[activeTemplateConfig.type];
    el = TemplateComponent ? (
      <TemplateComponent config={activeTemplateConfig} tabId={activeTabId} key={activeTabId} />
    ) : null;
  }

  return (
    <div className="expr-container hyperspace-light" style={{ height: '100%' }}>
      <TabStateProvider>
        <HistoryProvider instanceId={config[0]?.id ?? 'default'}>
          <SnackbarProvider>
            <div className="w-full flex gap-8 h-full">
              <div className="flex-none" style={{ maxWidth: '350px', minWidth: '200px' }}>
                <SideNav
                  config={config}
                  activeNavItem={activeNavItem}
                  activeSubNavItem={activeSubNavItem}
                  onNavItemClick={onNavItemClick}
                  onAddTab={onAddTab}
                />
              </div>
              <div className="flex-1 flex flex-col h-full">
                <TabBar tabs={tabs} activeTabId={activeTabId} onTabClick={onTabClick} onTabClose={onTabClose} />
                <div className="flex-1 min-h-0">
                  <ErrorBoundary>{el}</ErrorBoundary>
                </div>
              </div>
            </div>
          </SnackbarProvider>
        </HistoryProvider>
      </TabStateProvider>
    </div>
  );
};

export const APIPlayground = ({ config }: APIPlaygroundProps): JSX.Element => {
  if (!config || config.length === 0) {
    return (
      <div className="expr-container hyperspace-light flex items-center justify-center" style={{ height: '100%' }}>
        <Typography variant="body-16" className="expr-text-03">
          No templates configured
        </Typography>
      </div>
    );
  }

  return <APIPlaygroundView config={config} />;
};
