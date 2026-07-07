import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';

export function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-ui-bg overflow-hidden relative">
      <div className="absolute inset-0 z-0 bg-gradient-to-tr from-brand-primary/5 via-white to-brand-primary/5 opacity-70 pointer-events-none" />
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[5%] w-[65%] h-[65%] rounded-full bg-brand-primary/10 opacity-40 blur-[130px] animate-pulse-custom" style={{ animationDuration: '9s' }} />
        <div className="absolute -bottom-[15%] -right-[5%] w-[75%] h-[75%] rounded-full bg-blue-400 opacity-20 blur-[160px] animate-pulse-custom" style={{ animationDuration: '14s' }} />
        <div className="absolute top-[25%] left-[35%] w-[45%] h-[45%] rounded-full bg-white opacity-60 blur-[110px]" />
        <div className="absolute top-[10%] right-[15%] w-40 h-40 bg-emerald-200 rounded-full opacity-20 blur-[80px] animate-bounce-custom" style={{ animationDuration: '12s' }} />
        <div className="absolute bottom-[20%] left-[10%] w-56 h-56 bg-brand-light rounded-full opacity-25 blur-[90px]" />
      </div>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <Topbar onOpenSidebar={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar relative z-10">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}