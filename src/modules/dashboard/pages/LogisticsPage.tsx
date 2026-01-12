import { useState, useRef } from 'react';
import { 
  Search, MapPin, ArrowRightLeft, CheckCircle2, X, 
  PackageCheck, Truck, Barcode, ArrowUpRight, ArrowDownLeft,
  AlertTriangle, FileText, Activity, Check, Ban, AlertCircle
} from 'lucide-react';

interface NetworkUnit {
  id: string;
  name: string;
  distance: string;
  stock: { [key: string]: number };
}

const MOCK_NETWORK: NetworkUnit[] = [
  { id: '1', name: 'Hemonúcleo Eunápolis', distance: '12 km', stock: { 'A+': 45, 'O+': 30, 'O-': 5, 'AB-': 2 } },
  { id: '2', name: 'Agência Porto Seguro', distance: '64 km', stock: { 'A+': 12, 'O+': 8, 'O-': 1, 'AB-': 0 } },
  { id: '3', name: 'Hospital Regional Itamaraju', distance: '98 km', stock: { 'A+': 25, 'O+': 20, 'O-': 8, 'AB-': 4 } },
];

interface TransferOrder {
  id: string;
  type: 'incoming' | 'outgoing';
  status: 'pending' | 'approved' | 'rejected' | 'in_transit' | 'completed';
  unitName: string;
  items: string;
  date: string;
  reason: string;
  priority: 'normal' | 'high' | 'critical';
}

const INITIAL_ORDERS: TransferOrder[] = [
  { id: 'REQ-001', type: 'outgoing', status: 'pending', unitName: 'Agência Porto Seguro', items: '3x A+', date: 'Hoje, 10:30', reason: 'Estoque Baixo', priority: 'normal' },
  { id: 'REQ-002', type: 'incoming', status: 'in_transit', unitName: 'Hospital Regional', items: '5x O-', date: 'Ontem, 16:00', reason: 'Transfusão Urgente', priority: 'critical' },
  { id: 'REQ-003', type: 'outgoing', status: 'approved', unitName: 'Hemonúcleo Eunápolis', items: '2x AB-', date: 'Hoje, 08:15', reason: 'Cirurgia Eletiva', priority: 'high' },
];

export function LogisticsPage() {
  const [activeTab, setActiveTab] = useState<'network' | 'outgoing' | 'incoming'>('network');
  const [orders, setOrders] = useState<TransferOrder[]>(INITIAL_ORDERS);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<NetworkUnit | null>(null);
  const [requestData, setRequestData] = useState({ type: '', quantity: 1, reason: 'estoque_baixo', message: '' });

  const [scanCode, setScanCode] = useState('');
  const [scannedItems, setScannedItems] = useState<string[]>([]);
  const [processingOrder, setProcessingOrder] = useState<TransferOrder | null>(null);
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [orderToReject, setOrderToReject] = useState<TransferOrder | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  
  const scanInputRef = useRef<HTMLInputElement>(null);

  const handleOpenRequestModal = (unit: NetworkUnit) => {
    setSelectedUnit(unit);
    const firstType = Object.keys(unit.stock)[0];
    setRequestData({ type: firstType, quantity: 1, reason: 'estoque_baixo', message: '' });
  };

  const handleSendRequest = () => {
    setSuccessMessage('Solicitação enviada! Aguarde a aprovação da unidade de origem.');
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedUnit(null);
    }, 2500);
  };

  const handleApproveOrder = (orderId: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'approved' } : o));
    setSuccessMessage('Pedido Aprovado! Disponível para expedição.');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const openRejectModal = (order: TransferOrder) => {
    setOrderToReject(order);
    setRejectionReason('');
    setRejectModalOpen(true);
  };

  const confirmRejection = () => {
    if (!orderToReject) return;
    setOrders(orders.map(o => o.id === orderToReject.id ? { ...o, status: 'rejected' } : o));
    setRejectModalOpen(false);
    setOrderToReject(null);
    setSuccessMessage('Pedido Recusado e removido da fila.');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanCode) return;
    if (scannedItems.includes(scanCode.toUpperCase())) {
      alert('Esta bolsa já foi bipada.');
      setScanCode('');
      return;
    }
    setScannedItems([...scannedItems, scanCode.toUpperCase()]);
    setScanCode('');
    scanInputRef.current?.focus();
  };

  const finishOperation = () => {
    setSuccessMessage(activeTab === 'outgoing' ? 'Expedição concluída! Itens em trânsito.' : 'Recebimento confirmado! Estoque atualizado.');
    setShowSuccess(true);
    
    if (processingOrder) {
      const newStatus = activeTab === 'outgoing' ? 'in_transit' : 'completed';
      setOrders(orders.map(o => o.id === processingOrder.id ? { ...o, status: newStatus } : o));
    }

    setTimeout(() => {
      setShowSuccess(false);
      setScannedItems([]);
      setProcessingOrder(null);
    }, 2000);
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getMaxQuantity = () => {
    if (!selectedUnit || !requestData.type) return 1;
    return selectedUnit.stock[requestData.type] || 0;
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Central de Logística Integrada</h1>
          <p className="text-slate-500 text-sm">Gerencie solicitações, expedição e recebimento de bolsas.</p>
        </div>
      </div>

      <div className="flex border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('network')}
          className={`px-6 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${activeTab === 'network' ? 'border-brand-red text-brand-red' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <MapPin size={18} /> Rede & Solicitações
        </button>
        <button 
          onClick={() => { setActiveTab('outgoing'); setProcessingOrder(null); }}
          className={`px-6 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${activeTab === 'outgoing' ? 'border-brand-red text-brand-red' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <ArrowUpRight size={18} /> Expedição (Enviar)
        </button>
        <button 
          onClick={() => { setActiveTab('incoming'); setProcessingOrder(null); }}
          className={`px-6 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${activeTab === 'incoming' ? 'border-brand-red text-brand-red' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <ArrowDownLeft size={18} /> Recebimento (Entrada)
        </button>
      </div>

      {activeTab === 'network' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4">
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                 <input 
                   type="text" 
                   placeholder="Buscar unidade vizinha..." 
                   className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-brand-red outline-none transition-all"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MOCK_NETWORK.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase())).map((unit) => (
                <div key={unit.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all group flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-slate-800 group-hover:text-brand-red transition-colors">{unit.name}</h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin size={12} /> {unit.distance}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {Object.entries(unit.stock).map(([type, qtd]) => (
                        <div key={type} className={`text-center p-1.5 rounded-lg border ${qtd < 5 ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
                          <p className={`text-[10px] font-bold ${qtd < 5 ? 'text-red-700' : 'text-slate-500'}`}>{type}</p>
                          <p className={`font-bold text-sm ${qtd < 5 ? 'text-red-800' : 'text-slate-800'}`}>{qtd}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleOpenRequestModal(unit)}
                    className="w-full py-2 bg-slate-800 text-white rounded-lg text-sm font-bold hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowRightLeft size={16} /> Solicitar Transferência
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 h-fit">
            <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Activity size={20} className="text-brand-red" />
              Minhas Solicitações
            </h2>
            <div className="space-y-4">
              {orders.filter(o => o.type === 'incoming' && o.status !== 'completed').map(order => (
                <div key={order.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1 h-full ${order.priority === 'critical' ? 'bg-red-500' : order.priority === 'high' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                  <div className="pl-3">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-bold text-slate-500">{order.id}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        order.status === 'in_transit' ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {order.status === 'in_transit' ? 'EM TRÂNSITO' : 'AGUARDANDO'}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">{order.items}</p>
                    <p className="text-xs text-slate-500 mb-2">De: {order.unitName}</p>
                    <div className="flex items-center gap-1 text-[10px] font-bold bg-white w-fit px-2 py-1 rounded border border-gray-200 text-slate-600">
                      <FileText size={10} />
                      Motivo: {order.reason}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {(activeTab === 'outgoing' || activeTab === 'incoming') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 h-fit">
            <h2 className="font-bold text-slate-800 mb-4">
              {activeTab === 'outgoing' ? 'Solicitações Recebidas' : 'Cargas para Receber'}
            </h2>
            <div className="space-y-3">
              {orders.filter(o => o.type === activeTab && o.status !== 'rejected' && o.status !== 'completed').map(order => (
                <div 
                  key={order.id}
                  className={`w-full text-left p-4 rounded-xl border transition-all relative overflow-hidden ${
                    processingOrder?.id === order.id 
                      ? 'bg-slate-800 text-white border-slate-800 shadow-md' 
                      : 'bg-white border-gray-200 hover:shadow-sm'
                  }`}
                >
                  <div className={`absolute top-0 right-0 px-2 py-1 text-[10px] font-bold rounded-bl-lg ${
                     processingOrder?.id === order.id ? 'bg-slate-700 text-slate-200' : getPriorityColor(order.priority)
                  }`}>
                    {order.priority === 'critical' ? 'URGENTE' : order.priority === 'high' ? 'PRIORITÁRIO' : 'NORMAL'}
                  </div>

                  <div className="flex justify-between items-center mb-1 mt-2">
                    <span className={`text-xs font-bold ${processingOrder?.id === order.id ? 'text-slate-300' : 'text-slate-500'}`}>{order.id}</span>
                    {order.status === 'approved' && <span className="text-[10px] bg-emerald-500 text-white px-2 rounded-full">APROVADO</span>}
                  </div>
                  
                  <p className={`font-bold text-lg ${processingOrder?.id === order.id ? 'text-white' : 'text-slate-800'}`}>{order.items}</p>
                  <p className={`text-xs mt-1 ${processingOrder?.id === order.id ? 'text-slate-300' : 'text-slate-500'}`}>
                    {activeTab === 'outgoing' ? `Destino: ${order.unitName}` : `Origem: ${order.unitName}`}
                  </p>
                  
                  <div className={`mt-3 pt-2 border-t flex items-center gap-1.5 ${processingOrder?.id === order.id ? 'border-slate-600' : 'border-gray-100'}`}>
                    <FileText size={12} className={processingOrder?.id === order.id ? 'text-slate-400' : 'text-slate-400'} />
                    <span className={`text-xs font-medium ${processingOrder?.id === order.id ? 'text-slate-200' : 'text-slate-600'}`}>
                      {order.reason}
                    </span>
                  </div>

                  {activeTab === 'outgoing' && order.status === 'pending' && (
                    <div className="flex gap-2 mt-4">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleApproveOrder(order.id); }}
                        className="flex-1 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-100 flex items-center justify-center gap-1"
                      >
                        <Check size={14} /> Aprovar
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); openRejectModal(order); }}
                        className="flex-1 py-2 bg-red-50 text-red-700 rounded-lg text-xs font-bold hover:bg-red-100 flex items-center justify-center gap-1"
                      >
                        <Ban size={14} /> Recusar
                      </button>
                    </div>
                  )}

                  {((activeTab === 'outgoing' && order.status === 'approved') || (activeTab === 'incoming' && order.status === 'in_transit')) && (
                    <button 
                      onClick={() => { setProcessingOrder(order); setScannedItems([]); }}
                      className={`w-full mt-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 ${
                        processingOrder?.id === order.id 
                          ? 'bg-slate-700 text-white cursor-default'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {activeTab === 'outgoing' ? 'Iniciar Expedição' : 'Conferir Recebimento'} <ArrowUpRight size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {!processingOrder ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-slate-400">
                <Truck size={48} className="mb-4 opacity-20" />
                <p>Selecione um pedido aprovado ao lado para iniciar a {activeTab === 'outgoing' ? 'expedição' : 'conferência'}.</p>
              </div>
            ) : (
              <>
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Barcode /> Bipagem de Itens
                      </h3>
                      <p className="text-sm text-slate-500 mt-1">
                        Motivo da Solicitação: <strong className="text-slate-800">{processingOrder.reason}</strong>
                      </p>
                    </div>
                    <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                      Pedido: {processingOrder.id}
                    </span>
                  </div>
                  
                  <form onSubmit={handleScan} className="relative">
                    <input 
                      ref={scanInputRef}
                      type="text" 
                      className="w-full pl-4 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-xl text-lg font-mono focus:bg-white focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 outline-none transition-all uppercase placeholder:text-slate-400"
                      placeholder="BIPE O CÓDIGO DA BOLSA"
                      value={scanCode}
                      onChange={e => setScanCode(e.target.value)}
                      autoFocus
                    />
                    <button 
                      type="submit"
                      disabled={!scanCode}
                      className="absolute right-2 top-2 bottom-2 px-4 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-700 disabled:opacity-0 transition-all"
                    >
                      OK
                    </button>
                  </form>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col min-h-[300px]">
                  <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <span className="font-bold text-slate-700">Itens Conferidos ({scannedItems.length})</span>
                    <button onClick={() => setScannedItems([])} className="text-xs text-red-500 hover:underline">Limpar lista</button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {scannedItems.map((code, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                        <span className="font-mono font-bold text-slate-700">{code}</span>
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      </div>
                    ))}
                    {scannedItems.length === 0 && (
                      <p className="text-center text-slate-400 text-sm py-10">Nenhuma bolsa bipada ainda.</p>
                    )}
                  </div>

                  <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <button 
                      onClick={finishOperation}
                      disabled={scannedItems.length === 0}
                      className={`w-full py-4 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                        activeTab === 'outgoing' 
                          ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' 
                          : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                      }`}
                    >
                      {activeTab === 'outgoing' 
                        ? <><PackageCheck /> Confirmar Envio e Baixar Estoque</> 
                        : <><PackageCheck /> Confirmar Entrada no Estoque</>
                      }
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}


      {selectedUnit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-scale-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">Nova Solicitação</h3>
              <button onClick={() => setSelectedUnit(null)}><X size={20} className="text-slate-400" /></button>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs text-blue-600 uppercase font-bold">Unidade Cedente</p>
                <p className="font-bold text-slate-800">{selectedUnit.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Tipo Sanguíneo</label>
                  <select 
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-brand-red"
                    value={requestData.type}
                    onChange={e => setRequestData({...requestData, type: e.target.value})}
                  >
                    {Object.keys(selectedUnit.stock).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Qtd. (Max: {getMaxQuantity()})</label>
                  <input 
                    type="number" 
                    min="1" 
                    max={getMaxQuantity()}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-brand-red"
                    value={requestData.quantity}
                    onChange={e => setRequestData({...requestData, quantity: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Motivo da Solicitação <span className="text-red-500">*</span></label>
                <select 
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-brand-red"
                  value={requestData.reason}
                  onChange={e => setRequestData({...requestData, reason: e.target.value})}
                >
                  <option value="estoque_baixo">Reposição de Estoque Baixo</option>
                  <option value="cirurgia">Cirurgia Eletiva / Programada</option>
                  <option value="urgencia">Transfusão de Urgência / Emergência</option>
                  <option value="calamidade">Calamidade / Acidente com Múltiplas Vítimas</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Mensagem ao Cedente (Opcional)</label>
                <textarea 
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-brand-red resize-none h-24"
                  placeholder="Descreva detalhes adicionais sobre a necessidade..."
                  value={requestData.message}
                  onChange={e => setRequestData({...requestData, message: e.target.value})}
                />
              </div>

              {requestData.reason === 'urgencia' || requestData.reason === 'calamidade' ? (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex gap-2 text-red-700 text-xs font-bold items-center">
                   <AlertTriangle size={16} />
                   <span>Solicitação marcada como PRIORIDADE CRÍTICA.</span>
                </div>
              ) : null}

              <div className="pt-2">
                <button 
                  onClick={handleSendRequest}
                  className="w-full py-3 bg-brand-red text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-brand-red/20 transition-all flex items-center justify-center gap-2"
                >
                  <Truck size={18} /> Confirmar Solicitação
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {rejectModalOpen && orderToReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-scale-up border-2 border-red-100">
            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <AlertCircle className="text-red-600" /> Recusar Solicitação
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Informe o motivo da recusa para a unidade solicitante ({orderToReject.unitName}).
            </p>
            
            <textarea 
              className="w-full p-3 bg-red-50 border border-red-200 rounded-xl outline-none focus:border-red-500 resize-none h-32 mb-4 text-red-900 placeholder:text-red-300"
              placeholder="Ex: Estoque indisponível no momento..."
              value={rejectionReason}
              onChange={e => setRejectionReason(e.target.value)}
              autoFocus
            />

            <div className="flex gap-2">
              <button 
                onClick={() => setRejectModalOpen(false)}
                className="flex-1 py-2 bg-gray-100 text-slate-600 rounded-lg font-bold hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmRejection}
                disabled={!rejectionReason}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 disabled:opacity-50"
              >
                Confirmar Recusa
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center animate-scale-up text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-emerald-600">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Sucesso!</h3>
            <p className="text-slate-500">{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}