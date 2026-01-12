import { useState } from 'react';
import { Bell, Menu, Info, AlertTriangle, X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TopbarProps {
  onOpenSidebar: () => void;
}

const MOCK_NOTIFICATIONS = [
  { 
    id: 1, 
    type: 'system', 
    title: 'Manutenção Programada', 
    message: 'O sistema passará por atualização dia 15/05 às 22:00h.', 
    time: 'Há 2 horas',
    read: false 
  },
  { 
    id: 2, 
    type: 'alert', 
    title: 'Aviso da Central', 
    message: 'Nível crítico de Sangue O- na região. Priorizar coletas.', 
    time: 'Há 5 horas',
    read: false 
  },
  { 
    id: 3, 
    type: 'system', 
    title: 'Nova Funcionalidade', 
    message: 'O módulo de Logística agora permite rastreio em tempo real.', 
    time: 'Ontem',
    read: true 
  }
];

export function Topbar({ onOpenSidebar }: TopbarProps) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 shrink-0 z-20 shadow-sm relative">
      
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={onOpenSidebar} 
          className="lg:hidden p-2 text-slate-500 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-full transition-colors ${showNotifications ? 'bg-red-50 text-brand-red' : 'text-slate-400 hover:bg-gray-100 hover:text-brand-red'}`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-brand-red rounded-full ring-2 ring-white animate-pulse"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-fade-in-up origin-top-right">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h3 className="font-bold text-slate-700">Notificações</h3>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Check size={12} /> Marcar lidas
                  </button>
                )}
              </div>
              
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    <p className="text-sm">Nenhuma notificação.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        className={`p-4 hover:bg-gray-50 transition-colors flex gap-3 ${notif.read ? 'opacity-60' : 'bg-white'}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${notif.type === 'alert' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                          {notif.type === 'alert' ? <AlertTriangle size={14} /> : <Info size={14} />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <p className={`text-sm font-bold ${notif.read ? 'text-slate-600' : 'text-slate-800'}`}>{notif.title}</p>
                            {!notif.read && (
                              <button onClick={() => markAsRead(notif.id)} className="text-slate-300 hover:text-blue-500" title="Marcar como lida">
                                <span className="w-2 h-2 bg-blue-500 rounded-full block"></span>
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed mb-2">{notif.message}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{notif.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {showNotifications && (
          <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)}></div>
        )}

        <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

        <div 
          onClick={() => navigate('/dashboard/perfil')}
          className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-1.5 rounded-xl transition-colors pr-2"
          title="Ver Meu Perfil"
        >
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-slate-700 leading-tight">Dr. Ricardo O.</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Diretor Técnico</p>
          </div>
          <div className="w-9 h-9 bg-brand-red text-white rounded-lg flex items-center justify-center font-bold shadow-md shadow-brand-red/20">
            RO
          </div>
        </div>
      </div>
    </header>
  );
}