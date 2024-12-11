'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconType } from 'react-icons';
import { 
  MdDashboard, 
  MdDirectionsBoat,
  MdPeople,
  MdEventNote,
  MdInsights,
  MdSettings,
  MdCategory
} from 'react-icons/md';

interface NavItem {
  label: string;
  href: string;
  icon: IconType;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: MdDashboard },
  { label: 'Boats', href: '/admin/boats', icon: MdDirectionsBoat },
  { label: 'Bookings', href: '/admin/bookings', icon: MdEventNote },
  { label: 'Users', href: '/admin/users', icon: MdPeople },
  { label: 'Features', href: '/admin/features', icon: MdCategory },
  { label: 'Analytics', href: '/admin/analytics', icon: MdInsights },
  { label: 'Settings', href: '/admin/settings', icon: MdSettings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#1a2435] min-h-screen">
      <div className="px-6 py-4">
        <h1 className="text-white text-xl font-bold">Admin Portal</h1>
      </div>
      <nav className="mt-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-6 py-3
                transition-colors duration-200
                ${isActive 
                  ? 'bg-white/10 text-white border-r-4 border-white' 
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'}
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
} 