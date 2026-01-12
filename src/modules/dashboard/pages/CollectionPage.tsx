import { useState, useEffect } from 'react';
import { Search, Syringe, Clock, User, FileText, Printer, CheckCircle2, Info, AlertCircle } from 'lucide-react';

interface Donor {
  id: string;
  name: string;
  triageTime: string;
  status: 'aguardando';
}

const WAITING_LIST: Donor[] = [
  { id: '1', name: 'Carlos Eduardo Silva', triageTime: '08:15', status: 'aguardando' },
  { id: '2', name: 'Ana Beatriz Souza', triageTime: '08:30', status: 'aguardando' },
  { id: '3', name: 'Jorge Amado Filho', triageTime: '08:45', status: 'aguardando' },
  { id: '4', name: 'Mariana Ximenes', triageTime: '09:00', status: 'aguardando' },
];

export function CollectionPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState('');

  const [formData, setFormData] = useState({
    componentType: 'Sangue Total',
    volume: '450',
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentDateTime(now.toLocaleString('pt-BR'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (val > 450) {
      setFormData({ ...formData, volume: '450' });
    } else {
      setFormData({ ...formData, volume: e.target.value });
    }
  };

  const filteredList = WAITING_LIST.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleCollect = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      alert(`Coleta Confirmada!\n\nPaciente: ${selectedDonor?.name}\nVolume: ${formData.volume}ml\nTipo: ${formData.componentType}\n\n>> Enviando comando para impressora de etiqueta...`);
      setIsSubmitting(false);
      setSelectedDonor(null);
      setFormData({ componentType: 'Sangue Total', volume: '450' });
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Sala de Coleta</h1>
          <p className="text-slate-500 text-sm">Registro de bolsas e geração de etiqueta de coleta.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-medium border border-blue-100">
          <Clock size={18} />
          <span>Fila: <strong>{filteredList.length} aguardando</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[600px]">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h2 className="font-bold text-slate-700 flex items-center gap-2">
              <User size={18} className="text-brand-red" />
              Fila de Espera
            </h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar paciente..." 
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-brand-red focus:ring-2 focus:ring-brand-red/10 outline-none"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-1 p-4 space-y-3">
            {filteredList.map(donor => (
              <div 
                key={donor.id}
                onClick={() => setSelectedDonor(donor)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between group ${
                  selectedDonor?.id === donor.id 
                    ? 'border-brand-red bg-red-50 ring-1 ring-brand-red' 
                    : 'border-gray-100 hover:border-gray-300 hover:shadow-md bg-white'
                }`}
              >
                <div>
                  <h3 className="font-bold text-slate-800 group-hover:text-brand-red transition-colors text-base">{donor.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={12} className="text-emerald-500" />
                      Triagem Aprovada: {donor.triageTime}
                    </span>
                  </div>
                </div>
                <button className={`p-2 rounded-lg transition-colors ${
                   selectedDonor?.id === donor.id ? 'text-brand-red bg-white' : 'text-gray-300'
                }`}>
                  <Syringe size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm h-fit">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="font-bold text-slate-700 flex items-center gap-2">
              <FileText size={18} className="text-brand-red" />
              Registro de Coleta
            </h2>
          </div>

          {selectedDonor ? (
            <form onSubmit={handleCollect} className="p-6 space-y-6">
              
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl mb-6">
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Doador em Atendimento</p>
                <p className="font-bold text-slate-800 text-lg">{selectedDonor.name}</p>
                <p className="text-xs text-slate-400 mt-1">ID Sistema: {selectedDonor.id.padStart(6, '0')}</p>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-bold text-slate-700">Tipo de Coleta</label>
                    <div className="group relative">
                      <Info size={14} className="text-slate-400 cursor-help" />
                      <div className="absolute right-0 top-6 w-48 p-2 bg-slate-800 text-white text-xs rounded shadow-xl hidden group-hover:block z-50">
                        "Sangue Total" é a doação padrão. Selecione Plasma/Plaquetas apenas para procedimentos de Aférese.
                      </div>
                    </div>
                  </div>
                  <select 
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:border-brand-red focus:ring-2 focus:ring-brand-red/10 outline-none transition-all"
                    value={formData.componentType}
                    onChange={e => setFormData({...formData, componentType: e.target.value})}
                  >
                    <option value="Sangue Total">Sangue Total (Padrão)</option>
                    <option value="Plasma">Aférese - Plasma</option>
                    <option value="Plaquetas">Aférese - Plaquetas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Volume Coletado</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      max="450"
                      className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:border-brand-red focus:ring-2 focus:ring-brand-red/10 outline-none transition-all font-mono"
                      value={formData.volume}
                      onChange={handleVolumeChange}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">ml</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1.5 text-xs text-amber-600">
                    <AlertCircle size={12} />
                    <span>Máximo permitido: 450ml (+/- 45ml bolsa satélite)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Data/Hora do Registro</label>
                  <div className="px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-600 font-mono flex items-center gap-2 cursor-not-allowed">
                     <Clock size={16} />
                     {currentDateTime || 'Carregando...'}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 ml-1">* Preenchimento automático pelo sistema</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 bg-brand-red hover:bg-red-700 text-white rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-brand-red/20"
                >
                  {isSubmitting ? (
                    'Gerando Registro...'
                  ) : (
                    <>
                      <Printer size={20} />
                      Confirmar Coleta
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-gray-400 mt-3">
                  Ao confirmar, a etiqueta de coleta será impressa automaticamente.
                </p>
              </div>

            </form>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Syringe size={32} className="text-gray-300" />
              </div>
              <h3 className="font-bold text-slate-700 mb-2">Aguardando Seleção</h3>
              <p className="text-sm text-slate-400 max-w-[200px]">Selecione um doador na fila para iniciar o registro da bolsa.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}