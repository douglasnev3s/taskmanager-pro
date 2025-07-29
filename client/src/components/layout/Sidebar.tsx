"use client"

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  CheckSquare, 
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'All Tasks',
    href: '/tasks',
    icon: CheckSquare,
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const renderNavigationItem = (item: any, isMobile = false) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.name);
    const isActive = pathname === item.href || (hasChildren && item.children.some((child: any) => pathname === child.href));
    const isChildActive = hasChildren && item.children.some((child: any) => pathname === child.href);

    return (
      <li key={item.name}>
        {hasChildren ? (
          <>
            <button
              onClick={() => toggleExpanded(item.name)}
              className={cn(
                'group flex w-full gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 transition-colors text-left',
                isChildActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <item.icon
                className={cn(
                  'h-6 w-6 shrink-0',
                  isChildActive 
                    ? 'text-primary' 
                    : 'text-muted-foreground group-hover:text-foreground'
                )}
                aria-hidden="true"
              />
              <span className="flex-1">{item.name}</span>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            {isExpanded && (
              <ul className="mt-1 ml-8 space-y-1">
                {item.children.map((child: any) => {
                  const isChildActiveNow = pathname === child.href;
                  return (
                    <li key={child.name}>
                      <Link
                        href={child.href}
                        onClick={isMobile ? onClose : undefined}
                        className={cn(
                          'group flex gap-x-3 rounded-md p-2 text-sm font-medium leading-6 transition-colors',
                          isChildActiveNow
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                      >
                        <child.icon
                          className={cn(
                            'h-5 w-5 shrink-0',
                            isChildActiveNow 
                              ? 'text-primary-foreground' 
                              : 'text-muted-foreground group-hover:text-foreground'
                          )}
                          aria-hidden="true"
                        />
                        {child.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        ) : (
          <Link
            href={item.href}
            onClick={isMobile ? onClose : undefined}
            className={cn(
              'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <item.icon
              className={cn(
                'h-6 w-6 shrink-0',
                isActive 
                  ? 'text-primary-foreground' 
                  : 'text-muted-foreground group-hover:text-foreground'
              )}
              aria-hidden="true"
            />
            {item.name}
          </Link>
        )}
      </li>
    );
  };

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-card px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <h1 className="text-xl font-bold text-foreground">
              TaskManager Pro
            </h1>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => renderNavigationItem(item))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 z-50 flex w-64 flex-col transition-transform duration-300 lg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-card px-6 pb-4 border-r border-border">
          <div className="flex h-16 shrink-0 items-center justify-between">
            <h1 className="text-xl font-bold text-foreground">
              TaskManager Pro
            </h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close sidebar</span>
            </Button>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => renderNavigationItem(item, true))}
                </ul>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}