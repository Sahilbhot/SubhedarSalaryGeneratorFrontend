import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  Users as UsersIcon,
  Calculator,
  ShieldCheck,
  Building2,
  UtensilsCrossed,
  LogOut,
  ArrowLeft,
  Sun,
  Moon,
  ChevronsUpDown,
} from 'lucide-react';
import EmployeesPage from './pages/EmployeesPage.jsx';
import CalculateSalaryPage from './pages/CalculateSalaryPage.jsx';
import UsersPage from '@/features/users/UsersPage.jsx';
import BranchesPage from '@/features/branches/BranchesPage.jsx';
import MenuPage from '@/features/menu/MenuPage.jsx';
import { useAuth } from '@/features/auth/AuthContext.jsx';
import { ROLES, ROLE_LABELS } from '@/shared/constants/roles.js';
import logoUrl from '@/assets/logo.jpg';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';

// Each nav item lists the roles allowed to see it.
const NAV = [
  { id: 'employees', label: 'Employees', icon: UsersIcon, roles: [ROLES.ADMIN, ROLES.MANAGER] },
  {
    id: 'calculate',
    label: 'Calculate Salary',
    icon: Calculator,
    roles: [ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF],
  },
  { id: 'menu', label: 'Menu', icon: UtensilsCrossed, roles: [ROLES.ADMIN, ROLES.MANAGER] },
  { id: 'users', label: 'Users', icon: ShieldCheck, roles: [ROLES.ADMIN] },
  { id: 'branches', label: 'Branches', icon: Building2, roles: [ROLES.ADMIN] },
];

const PAGES = {
  employees: EmployeesPage,
  calculate: CalculateSalaryPage,
  menu: MenuPage,
  users: UsersPage,
  branches: BranchesPage,
};

const THEME_KEY = 'subhedar-admin-theme';

function initials(name = '') {
  return (
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase() || 'U'
  );
}

export default function AdminApp({ onExit }) {
  const { user, logout } = useAuth();
  const nav = useMemo(() => NAV.filter((item) => item.roles.includes(user?.role)), [user?.role]);

  const [active, setActive] = useState(() => nav[0]?.id ?? 'calculate');
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'light');

  // Toggle `.dark` on <html> so portaled UI (dialogs, selects, dropdowns,
  // tooltips, the mobile sidebar sheet) inherits the theme too. Cleaned up on
  // unmount so the public site / login stay in light mode.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(THEME_KEY, theme);
    return () => root.classList.remove('dark');
  }, [theme]);

  const navigate = useCallback((id) => setActive(id), []);
  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);

  function handleLogout() {
    logout();
    onExit?.();
  }

  const currentNav = nav.find((n) => n.id === active) ?? nav[0];
  const ActivePage = PAGES[currentNav?.id];
  const CurrentIcon = currentNav?.icon;
  const roleLabel = ROLE_LABELS[user?.role] || user?.role;

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-sidebar-border">
        <SidebarHeader>
          <div className="flex items-center gap-2.5 px-1 py-1.5">
            <img
              src={logoUrl}
              alt="Hotel Subhedar"
              className="size-9 shrink-0 rounded-md bg-sidebar-primary object-contain p-0.5"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
              <span className="font-display text-[15px] font-semibold text-sidebar-foreground">
                Hotel Subhedar
              </span>
              <span className="text-[11px] tracking-wide text-sidebar-foreground/60 uppercase">
                Admin Panel
              </span>
            </div>
          </div>
        </SidebarHeader>

        <SidebarSeparator />

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {nav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={active === item.id}
                        onClick={() => navigate(item.id)}
                        tooltip={item.label}
                      >
                        <Icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
                      {initials(user?.name)}
                    </span>
                    <div className="grid flex-1 text-left leading-tight">
                      <span className="truncate font-medium">{user?.name}</span>
                      <span className="truncate text-xs text-sidebar-foreground/60">
                        {roleLabel}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  align="start"
                  sideOffset={8}
                  className="w-(--radix-popper-anchor-width) min-w-56"
                >
                  <DropdownMenuLabel className="flex flex-col">
                    <span className="font-medium">{user?.name}</span>
                    <span className="text-xs font-normal text-muted-foreground">{user?.email}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={toggleTheme}>
                    {theme === 'dark' ? <Sun /> : <Moon />}
                    {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onExit}>
                    <ArrowLeft />
                    Back to Site
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                    <LogOut />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-[60px] shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-1 h-5" />
          <div className="flex items-center gap-2 text-base font-semibold text-foreground">
            {CurrentIcon && <CurrentIcon size={18} aria-hidden="true" />}
            {currentNav?.label}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden text-xs text-muted-foreground lg:block">
              Sheetal Baug Rd, Bhosari, Pimpri-Chinchwad, MH 411039
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <Sun /> : <Moon />}
            </Button>
          </div>
        </header>

        <div className="w-full max-w-[1100px] flex-1 p-4 sm:p-6">
          {ActivePage && <ActivePage />}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
