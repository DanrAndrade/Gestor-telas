import { 
  LayoutDashboard, 
  Users, 
  FlaskConical, 
  Package, 
  Truck, 
  MessageSquare, 
  Settings,
  Droplets,
  LogOut,
  X,
  Syringe,
  LogOut as LogOutIcon,
  FileText
} from 'lucide-react';
import { SidebarItem } from './SidebarItem';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <aside 
        className={`
          fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:shadow-none shadow-2xl
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        
        <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <Droplets className="w-8 h-8 text-brand-red fill-brand-red/10" />
            <span className="text-2xl font-bold text-slate-800 tracking-tight">Hemogestor</span>
          </div>
          
          <button onClick={onClose} className="lg:hidden p-1 text-gray-500 hover:bg-gray-100 rounded-md">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-4 mt-2">
            Geral
          </div>
          <div onClick={() => window.innerWidth < 1024 && onClose()}>
            <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/dashboard" />
            <SidebarItem icon={Users} label="Doadores" to="/dashboard/doadores" />
          </div>

          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-4 mt-6">
            Técnico
          </div>
          <div onClick={() => window.innerWidth < 1024 && onClose()}>
            <SidebarItem icon={Syringe} label="Sala de Coleta" to="/dashboard/coleta" />
            <SidebarItem icon={FlaskConical} label="Laboratório" to="/dashboard/laboratorio" />
            <SidebarItem icon={Package} label="Estoque de Sangue" to="/dashboard/estoque" />
          </div>

          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-4 mt-6">
            Logística
          </div>
          <div onClick={() => window.innerWidth < 1024 && onClose()}>
             {/* Link Unificado para a nova página LogisticsPage */}
             <SidebarItem icon={Truck} label="Central de Logística" to="/dashboard/logistica" />
             <SidebarItem icon={LogOutIcon} label="Saída Hospitalar" to="/dashboard/saida-hospitalar" />
          </div>
          
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-4 mt-6">
            Gestão
          </div>
          <div onClick={() => window.innerWidth < 1024 && onClose()}>
            <SidebarItem icon={MessageSquare} label="Comunicação" to="/dashboard/comunicacao" />
            <SidebarItem icon={Settings} label="Administrativo" to="/dashboard/admin" />
            <SidebarItem icon={FileText} label="Auditoria & Logs" to="/dashboard/admin/auditoria" />
          </div>
        </div>

        <div className="p-4 border-t border-gray-100">
          <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all text-sm font-medium">
            <LogOut size={20} />
            <span>Sair do Sistema</span>
          </button>
        </div>
      </aside>
    </>
  );
}