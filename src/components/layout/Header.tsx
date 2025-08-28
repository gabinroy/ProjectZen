"use client";

import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { UserNav } from './UserNav';
import { usePathname } from 'next/navigation';
import { useData } from '@/contexts/DataContext';
import { SidebarTrigger } from '../ui/sidebar';

function getTitle(pathname: string, projects: any[]) {
    if (pathname === '/') return 'Dashboard';
    if (pathname === '/projects') return 'Projects';
    if (pathname === '/settings') return 'Settings';
    if (pathname.startsWith('/projects/')) {
        const projectId = pathname.split('/')[2];
        const project = projects.find(p => p.id === projectId);
        return project ? `Project: ${project.name}`: 'Project';
    }
    return 'ProjectZen';
}

export function Header() {
  const pathname = usePathname();
  const { projects } = useData();
  const title = getTitle(pathname, projects);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
       <SidebarTrigger className="md:hidden"/>
      <h1 className="text-xl font-semibold">{title}</h1>
      <div className="ml-auto flex items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80">
            <div className="p-4">
              <h4 className="font-medium">Notifications</h4>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                <p>No new notifications</p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <UserNav />
      </div>
    </header>
  );
}
