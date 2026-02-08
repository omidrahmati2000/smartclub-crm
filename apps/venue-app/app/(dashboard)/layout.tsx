'use client'

import { useState } from 'react'
import { Sidebar } from './_components/sidebar'
import { Header } from './_components/header'
import { MobileSidebar } from './_components/mobile-sidebar'
import { CommandPalette } from './_components/command-palette'
import { useCommandPalette } from './_hooks/use-command-palette'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { open: commandPaletteOpen, setOpen: setCommandPaletteOpen } =
    useCommandPalette()

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar - hidden on mobile */}
      <Sidebar />

      {/* Mobile Sidebar */}
      <MobileSidebar
        open={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header
          onMenuClick={() => setMobileMenuOpen(true)}
          onSearchClick={() => setCommandPaletteOpen(true)}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-muted/10">
          <div className="container mx-auto p-4 sm:p-6 md:p-8">{children}</div>
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />
    </div>
  )
}
