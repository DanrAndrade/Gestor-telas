import { useState, useRef } from 'react';
import { Truck, ArrowRightLeft, PackageCheck, PackageX, Barcode, CheckCircle2, MapPin, X, ArrowRight } from 'lucide-react';

interface ScannedItem {
  code: string;
  type: string;
}

const UNITS = [
  { id: '1', name: 'Hemocentro Regional (Sede)' },
  { id: '2', name: 'Unidade de Coleta - Shopping' },
  { id: '3', name: 'Hospital Municipal (Agência Transfusional)' },
  { id: '4', name: 'Unidade Móvel 01' }
];

export function DistributionPage() {
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [scanCode, setScanCode] = useState('');
  const [items, setItems] = useState<ScannedItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const scanInputRef = useRef<HTMLInputElement>(null);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanCode) return;

    if (items.some(i => i.code === scanCode)) {
      setScanCode(''); 
      return; 
    }

    setItems([...items, { code: scanCode.toUpperCase(), type: 'Sangue Total' }]);
    setScanCode('');
    scanInputRef.current?.focus();
  };

  const handleRemoveItem = (code: string) => {
    setItems(items.filter(i => i.code !== code));
  };

  const handleSubmit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
      setItems([]);
      setScanCode('');
      setSelectedUnit('');
      
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Rede de Distribuição</h1>
          <p className="text-slate-500 text-sm">Gestão logística entre unidades da hemorrede.</p>
        </div>
      </div>

      <div className="flex border-b border-gray-200">
        <button 
          onClick={() => { setActiveTab('incoming'); setItems([]); setShowSuccess(false); }}
          className={`px-6 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${activeTab === 'incoming' ? 'border-brand-red text-brand-red' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <PackageCheck size={18} /> Recebimento
        </button>
        <button 
          onClick={() => { setActiveTab('outgoing'); setItems([]); setShowSuccess(false); }}
          className={`px-6 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${activeTab === 'outgoing' ? 'border-brand-red text-brand-red' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <Truck size={18} /> Nova Transferência
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 h-fit">
          <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <MapPin className="text-brand-red" size={20} />
            {activeTab === 'incoming' ? 'Origem da Carga' : 'Destino da Carga'}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Unidade</label>
              <select 
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:border-brand-red outline-none transition-all"
                value={selectedUnit}
                onChange={e => setSelectedUnit(e.target.value)}
              >
                <option value="">Selecione...</option>
                {UNITS.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
              <p className="text-xs font-bold text-blue-800 uppercase mb-1">Resumo da Operação</p>
              <p className="text-sm text-blue-600">
                {activeTab === 'incoming' 
                  ? 'Entrada de bolsas no estoque local. Requer conferência física.' 
                  : 'Saída de bolsas para outra unidade. Gera guia de transporte.'}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              {activeTab === 'incoming' ? 'Conferência de Entrada' : 'Registro de Saída'}
            </label>
            <form onSubmit={handleScan} className="relative flex gap-2">
              <div className="relative flex-1">
                <Barcode className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  ref={scanInputRef}
                  type="text" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-lg font-mono focus:bg-white focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 outline-none transition-all uppercase placeholder:text-slate-400"
                  placeholder={selectedUnit ? "BIPAR CÓDIGO DA BOLSA" : "Selecione a unidade..."}
                  value={scanCode}
                  onChange={e => setScanCode(e.target.value)}
                  disabled={!selectedUnit}
                />
              </div>
              <button 
                type="submit"
                disabled={!scanCode}
                className="px-6 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 disabled:opacity-50 transition-colors"
              >
                Adicionar
              </button>
            </form>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden min-h-[300px] flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-700">Itens Listados ({items.length})</h3>
              {activeTab === 'outgoing' && items.length > 0 && (
                <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                  Em Trânsito
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto max-h-[400px]">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 p-8">
                  <ArrowRightLeft size={48} className="mb-2 opacity-20" />
                  <p>Nenhum item adicionado.</p>
                </div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 font-medium">
                    <tr>
                      <th className="p-3 pl-6">Código</th>
                      <th className="p-3">Descrição</th>
                      <th className="p-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map((item) => (
                      <tr key={item.code} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3 pl-6 font-mono font-bold text-slate-700">{item.code}</td>
                        <td className="p-3 text-slate-600">{item.type}</td>
                        <td className="p-3 text-right">
                          <button 
                            onClick={() => handleRemoveItem(item.code)}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <button 
                onClick={handleSubmit}
                disabled={items.length === 0 || isProcessing}
                className={`w-full py-4 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${activeTab === 'incoming' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}
              >
                {isProcessing ? 'Processando...' : (
                  <>
                    {activeTab === 'incoming' ? <PackageCheck size={20} /> : <Truck size={20} />}
                    {activeTab === 'incoming' ? 'Confirmar Recebimento' : 'Registrar Transferência'}
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center animate-scale-up">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-emerald-600">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Operação Concluída!</h3>
            <p className="text-slate-500 text-center">
              {activeTab === 'incoming' 
                ? 'Os itens foram adicionados ao estoque local com sucesso.' 
                : 'A guia de transferência foi gerada e o estoque baixado.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}