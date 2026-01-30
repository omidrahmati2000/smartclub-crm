'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { ComponentProps } from 'react';

/**
 * A Link component that uses View Transitions API for smooth page transitions
 * Falls back to standard navigation if View Transitions API is not supported
 */
export function ViewTransitionLink({
  href,
  children,
  replace,
  ...props
}: ComponentProps<typeof Link>) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Check if View Transitions API is supported
    if (!document.startViewTransition) {
      // Not supported, let Next.js handle it normally
      return;
    }

    e.preventDefault();

    // Use View Transitions API for smooth transition
    document.startViewTransition(() => {
      if (replace) {
        router.replace(href.toString());
      } else {
        router.push(href.toString());
      }
    });
  };

  return (
    <Link href={href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
