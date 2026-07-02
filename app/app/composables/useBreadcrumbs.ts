import type { BreadcrumbItem } from '~/components/molecules/Breadcrumb.vue'

/**
 * Composable to manage breadcrumbs for pages
 * @param items - Array of breadcrumb items to display
 * @returns Object with breadcrumbs array
 */
export const useBreadcrumbs = (items: BreadcrumbItem[]) => {
  const breadcrumbs = ref<BreadcrumbItem[]>(items)

  return {
    breadcrumbs,
  }
}
