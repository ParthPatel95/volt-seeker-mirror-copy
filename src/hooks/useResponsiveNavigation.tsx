
import { useState, useEffect, useMemo } from 'react';
import { useIsMobile } from './use-mobile';

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  priority: number; // 1 = highest priority (always visible on mobile)
  path?: string;
  badge?: number;
}

export function useResponsiveNavigation(items: NavigationItem[]) {
  const isMobile = useIsMobile();
  const [visibleItems, setVisibleItems] = useState<NavigationItem[]>([]);
  const [hiddenItems, setHiddenItems] = useState<NavigationItem[]>([]);
  
  // Memoize items to prevent unnecessary re-renders
  const memoizedItems = useMemo(() => items, [JSON.stringify(items)]);

  useEffect(() => {
    if (isMobile) {
      // On mobile, show only top 3 priority items, rest go to dropdown
      const sorted = [...memoizedItems].sort((a, b) => a.priority - b.priority);
      setVisibleItems(sorted.slice(0, 3));
      setHiddenItems(sorted.slice(3));
    } else {
      // On desktop, show all items
      setVisibleItems(memoizedItems);
      setHiddenItems([]);
    }
  }, [isMobile, memoizedItems]);

  return {
    visibleItems,
    hiddenItems,
    isMobile,
    hasHiddenItems: hiddenItems.length > 0
  };
}
