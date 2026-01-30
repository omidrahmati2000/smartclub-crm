'use client';

import { useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@smartclub/utils';

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function NavItem({ href, label, icon: Icon }: NavItemProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isActive = pathname === href || pathname.startsWith(href + '/');

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Don't navigate if already on this page
    if (isActive) return;

    // Use startTransition for non-blocking, instant visual feedback
    startTransition(() => {
      // Use View Transitions API for smooth transition if supported
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          router.push(href);
        });
      } else {
        router.push(href);
      }
    });
  };

  // Prefetch on hover for faster navigation
  const handleMouseEnter = () => {
    if (!isActive) {
      router.prefetch(href);
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium cursor-pointer relative',
        'transition-colors duration-150',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </a>
  );
}
