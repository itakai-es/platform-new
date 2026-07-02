import type { Tab } from '~/components/molecules/TabNavigation.vue'

/**
 * Composable to manage tab state for pages
 * @param tabsConfig - Array of tab configurations
 * @param defaultTab - Optional default tab ID (defaults to first tab)
 * @returns Object with tabs array, activeTab ref, and setActiveTab function
 */
export const useTabs = (tabsConfig: Tab[], defaultTab?: string) => {
  const tabs = ref<Tab[]>(tabsConfig)
  const activeTab = ref<string>(defaultTab || tabsConfig[0]?.id || '')

  const setActiveTab = (tabId: string) => {
    if (tabs.value.some(tab => tab.id === tabId)) {
      activeTab.value = tabId
    }
  }

  return {
    tabs,
    activeTab,
    setActiveTab,
  }
}
