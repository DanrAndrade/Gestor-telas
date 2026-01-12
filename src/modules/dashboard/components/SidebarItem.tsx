import { Link, useLocation } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  to: string;
}

export function SidebarItem({ icon: Icon, label, to }: SidebarItemProps) {
  const location = useLocation();
  
  const isActive = to === '/dashboard' 
    ? location.pathname === '/dashboard'
    : location.pathname.startsWith(to);

  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium mb-1 ${
        isActive 
          ? 'bg-red-50 text-brand-red font-bold shadow-sm' 
          : 'text-slate-500 hover:bg-gray-50 hover:text-slate-700'
      }`}
    >
      <Icon size={20} className={isActive ? 'text-brand-red' : 'text-slate-400'} />
      <span>{label}</span>
      {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-red"></div>}
    </Link>
  );
}