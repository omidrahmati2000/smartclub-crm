'use client';

import { useState, useEffect, useTransition } from 'react';
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
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  // Reset pending state when pathname changes
  useEffect(() => {
    if (pathname === pendingHref) {
      setPendingHref(null);
    }
  }, [pathname, pendingHref]);

  const isActive = pathname === href || pathname.startsWith(href + '/');
  // Show as active immediately when clicked, or when actually active
  const showAsActive = isActive || pendingHref === href;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Don't navigate if already on this page
    if (isActive) return;

    // Mark as pending immediately for instant visual feedback
    setPendingHref(href);

    // Use startTransition for non-blocking navigation
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
        'transition-all duration-150',
        showAsActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        // Add subtle loading indicator
        isPending && pendingHref === href && 'opacity-90',
      )}
    >
      <Icon className={cn('h-5 w-5', isPending && pendingHref === href && 'animate-pulse')} />
      <span>{label}</span>

      {/* Show tiny loading indicator when pending */}
      {isPending && pendingHref === href && (
        <div className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary-foreground/50 animate-pulse" />
      )}
    </a>
  );
}
