import { useState, useRef } from 'react';
import { Truck, User, Barcode, CheckCircle2, X, AlertCircle, Building2 } from 'lucide-react';

interface ScannedBag {
  code: string;
  type: string;
  component: string;
}

const HOSPITALS = [
  { id: '1', name: 'Hospital Regional de Eunápolis' },
  { id: '2', name: 'Santa Casa de Misericórdia' },
  { id: '3', name: 'Hospital Unimed' },
];

export function HospitalExitPage() {
  const [hospitalId, setHospitalId] = useState('');
  const [responsibleName, setResponsibleName] = useState('');
  const [scanCode, setScanCode] = useState('');
  const [scannedBags, setScannedBags] = useState<ScannedBag[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const scanInputRef = useRef<HTMLInputElement>(null);

  // REMOVIDO: O useEffect que causava o pulo de foco indesejado foi deletado.

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanCode) return;

    const newBag: ScannedBag = {
      code: scanCode.toUpperCase(),
      type: 'O+', 
      component: 'Concentrado de Hemácias' 
    };

    if (scannedBags.find(b => b.code === newBag.code)) {
      alert('Esta bolsa já foi bipada!');
    } else {
      setScannedBags([...scannedBags, newBag]);
    }
    setScanCode('');
    // Mantém o foco no input de bipagem para leitura contínua
    scanInputRef.current?.focus();
  };

  const handleRemoveBag = (code: string) => {
    setScannedBags(scannedBags.filter(b => b.code !== code));
  };

  const handleFinalizeExit = () => {
    if (!hospitalId || !responsibleName || scannedBags.length === 0) {
      alert('Preencha todos os campos obrigatórios e bipe ao menos uma bolsa.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      alert(`SAÍDA REGISTRADA COM SUCESSO!\n\nDestino: ${HOSPITALS.find(h => h.id === hospitalId)?.name}\nResponsável: ${responsibleName}\nVolume: ${scannedBags.length} bolsas baixadas do estoque.`);
      setIsSubmitting(false);
      setScannedBags([]);
      setScanCode('');
      setResponsibleName('');
      setHospitalId('');
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Saída Hospitalar</h1>
          <p className="text-slate-500 text-sm">Registro de transfusões e baixa definitiva de estoque.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 h-fit">
          <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Building2 className="text-brand-red" size={20} />
            Dados da Solicitação
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Hospital de Destino</label>
              <select 
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:border-brand-red focus:ring-2 focus:ring-brand-red/10 outline-none transition-all"
                value={hospitalId}
                onChange={e => setHospitalId(e.target.value)}
              >
                <option value="">Selecione o Hospital...</option>
                {HOSPITALS.map(h => (
                  <option key={h.id} value={h.id}>{h.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Responsável Técnico</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Nome do Médico/Enfermeiro"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:border-brand-red focus:ring-2 focus:ring-brand-red/10 outline-none transition-all"
                  value={responsibleName}
                  onChange={e => setResponsibleName(e.target.value)}
                  // Ao dar Enter, passa o foco para a bipagem
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') scanInputRef.current?.focus();
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">Bipagem de Bolsas (Saída)</label>
            <form onSubmit={handleScan} className="relative">
              <Barcode className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                ref={scanInputRef}
                type="text" 
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-lg font-mono focus:bg-white focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 outline-none transition-all uppercase placeholder:text-slate-400"
                placeholder={hospitalId ? "BIPE O CÓDIGO DA BOLSA AQUI" : "Selecione o hospital primeiro..."}
                value={scanCode}
                onChange={e => setScanCode(e.target.value)}
                disabled={!hospitalId || !responsibleName}
              />
              <button 
                type="submit"
                disabled={!scanCode}
                className="absolute right-2 top-2 bottom-2 px-6 bg-slate-800 text-white rounded-lg font-bold text-sm hover:bg-slate-700 disabled:opacity-0 transition-all"
              >
                Adicionar
              </button>
            </form>
            {!hospitalId && (
              <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                <AlertCircle size={12} /> Preencha os dados do hospital para liberar a leitura.
              </p>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden min-h-[300px] flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
              <h3 className="font-bold text-slate-700">Itens na Caixa Térmica ({scannedBags.length})</h3>
              {scannedBags.length > 0 && (
                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  Pronto para envio
                </span>
              )}
            </div>

            <div className="flex-1 overflow-y-auto max-h-[400px]">
              {scannedBags.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 p-8">
                  <Truck size={48} className="mb-2 opacity-20" />
                  <p>Nenhuma bolsa bipada ainda.</p>
                </div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-500 font-medium">
                    <tr>
                      <th className="p-3 pl-6">Código</th>
                      <th className="p-3">Tipo</th>
                      <th className="p-3">Componente</th>
                      <th className="p-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {scannedBags.map((bag) => (
                      <tr key={bag.code} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3 pl-6 font-mono font-bold text-slate-700">{bag.code}</td>
                        <td className="p-3">
                          <span className="bg-slate-100 text-slate-600 font-bold px-2 py-1 rounded text-xs">{bag.type}</span>
                        </td>
                        <td className="p-3 text-slate-600">{bag.component}</td>
                        <td className="p-3 text-right">
                          <button 
                            onClick={() => handleRemoveBag(bag.code)}
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
                onClick={handleFinalizeExit}
                disabled={scannedBags.length === 0 || isSubmitting}
                className="w-full py-4 bg-brand-red hover:bg-red-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-red/20"
              >
                {isSubmitting ? 'Processando Saída...' : (
                  <>
                    <CheckCircle2 size={20} />
                    Confirmar Saída e Baixar Estoque
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}