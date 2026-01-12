import { useState, useRef, useEffect } from 'react';
import { Scan, TestTube, CheckCircle2, XCircle, Printer, AlertTriangle, Search, Ban, User, FileWarning, Eye, EyeOff, ShieldCheck, ChevronRight, X, Save } from 'lucide-react';

interface BagInAnalysis {
  id: string;
  code: string;
  collectedAt: string;
  volume: number;
  component: string;
  donorId: string;
  donorName: string;
}

const QUARANTINE_BAGS: BagInAnalysis[] = [
  { id: '1', code: 'W1234 56799', collectedAt: '10:30', volume: 450, component: 'Sangue Total', donorId: 'D-9988', donorName: 'Carlos Eduardo Silva' },
  { id: '2', code: 'W1234 56800', collectedAt: '11:15', volume: 470, component: 'Sangue Total', donorId: 'D-7766', donorName: 'Ana Beatriz Souza' },
];

export function LabPage() {
  const [scanCode, setScanCode] = useState('');
  const [currentBag, setCurrentBag] = useState<BagInAnalysis | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTraceability, setShowTraceability] = useState(false);
  
  // Estado para Modal de Descarte
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [discardReason, setDiscardReason] = useState('');
  const [blockType, setBlockType] = useState('temporario');
  const [blockDuration, setBlockDuration] = useState('');

  const [results, setResults] = useState({
    bloodType: '',
    rhFactor: '',
    serology: '' as 'approved' | 'rejected' | ''
  });

  const scanInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scanInputRef.current?.focus();
  }, [currentBag]);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanCode) return;
    
    const found = QUARANTINE_BAGS.find(b => b.code.endsWith(scanCode) || b.code === scanCode);
    
    if (found) {
      setCurrentBag(found);
      setScanCode('');
      setShowTraceability(false);
      setResults({ bloodType: '', rhFactor: '', serology: '' });
    } else {
      alert('Bolsa não encontrada na lista de quarentena!');
      setScanCode('');
    }
  };

  const openDiscardModal = () => {
    setShowDiscardModal(true);
  };

  const finalizeDiscard = () => {
    setIsProcessing(true);
    setShowDiscardModal(false);
    
    setTimeout(() => {
      alert(`Bolsa DESCARTADA com sucesso.\n\nDoador marcado como INAPTO (${blockType}).\nMotivo: ${discardReason}`);
      setIsProcessing(false);
      resetScreen();
    }, 1500);
  };

  const handleRelease = () => {
    setIsProcessing(true);
    setTimeout(() => {
      alert(`Bolsa LIBERADA!\nEtiqueta ISBT 128 enviada para impressão.`);
      setIsProcessing(false);
      resetScreen();
    }, 1500);
  };

  const resetScreen = () => {
    setCurrentBag(null);
    setResults({ bloodType: '', rhFactor: '', serology: '' });
    setShowTraceability(false);
    setDiscardReason('');
    setBlockType('temporario');
    setBlockDuration('');
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Laboratório e Liberação</h1>
          <p className="text-slate-500 text-sm">Processamento técnico, tipagem e controle de qualidade.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm border border-amber-100 font-medium">
          <AlertTriangle size={16} />
          <span>Fila de Análise: <strong>{QUARANTINE_BAGS.length} bolsas</strong> aguardando</span>
        </div>
      </div>

      {!currentBag && (
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-12 flex flex-col items-center justify-center text-center hover:border-brand-red transition-colors group h-[500px]">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-red-50 transition-colors">
            <Scan size={40} className="text-gray-400 group-hover:text-brand-red" />
          </div>
          <h2 className="text-xl font-bold text-slate-700 mb-2">Aguardando Leitura de Etiqueta</h2>
          <p className="text-slate-400 mb-8 max-w-md">Utilize o leitor de código de barras ou digite o código manualmente.</p>
          
          <form onSubmit={handleScan} className="w-full max-w-md relative flex gap-2">
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  ref={scanInputRef}
                  type="text" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-lg font-mono focus:bg-white focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 outline-none transition-all shadow-sm text-center uppercase"
                  placeholder="BIPAR CÓDIGO"
                  value={scanCode}
                  onChange={e => setScanCode(e.target.value)}
                  autoFocus
                />
            </div>
            <button 
                type="submit"
                className="px-6 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors"
            >
                Entrar
            </button>
          </form>
          <p className="mt-4 text-xs text-gray-400">Dica: Digite "W1234 56799" para testar.</p>
        </div>
      )}

      {currentBag && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="bg-white border border-gray-200 rounded-2xl p-6 h-fit shadow-sm">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                <TestTube size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase">Bolsa em Análise</p>
                <p className="font-mono font-bold text-xl text-slate-800 tracking-tight">{currentBag.code}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm">Hemocomponente</span>
                <span className="font-medium text-slate-700 bg-gray-100 px-2 py-1 rounded text-xs">{currentBag.component}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm">Volume Coletado</span>
                <span className="font-medium text-slate-700">{currentBag.volume} ml</span>
              </div>
              
              <div className={`mt-6 pt-6 border-t border-gray-100 transition-all ${showTraceability ? 'bg-slate-50 p-4 rounded-xl border border-slate-200' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                     <ShieldCheck size={14} className="text-slate-400" />
                     <span className="text-xs font-bold text-slate-500 uppercase">Rastreabilidade</span>
                  </div>
                  
                  <button 
                    onClick={() => setShowTraceability(!showTraceability)}
                    className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 font-bold transition-colors"
                  >
                    {showTraceability ? <><EyeOff size={12} /> Ocultar</> : <><Eye size={12} /> Revelar Doador</>}
                  </button>
                </div>

                {showTraceability ? (
                  <div className="animate-fade-in-up">
                    <div className="flex items-start gap-3 mt-3">
                      <div className="bg-white p-2 rounded-full shadow-sm border border-gray-100">
                        <User size={20} className="text-slate-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{currentBag.donorName}</p>
                        <p className="text-xs text-slate-500 font-mono">ID: {currentBag.donorId}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                   <div className="flex items-center gap-2 text-slate-400 text-sm italic mt-1 bg-gray-50 p-2 rounded-lg">
                     <User size={14} />
                     <span>Vínculo anonimizado</span>
                   </div>
                )}
              </div>
              
              <button 
                onClick={resetScreen}
                className="w-full mt-4 py-2.5 text-sm text-slate-500 hover:text-slate-700 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200"
              >
                Cancelar / Ler Outra
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
              <TestTube size={20} className="text-brand-red" />
              Resultados Laboratoriais
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">Tipagem ABO</label>
                <div className="grid grid-cols-4 gap-2">
                  {['A', 'B', 'AB', 'O'].map(type => (
                    <button
                      key={type}
                      onClick={() => setResults({...results, bloodType: type})}
                      className={`h-12 rounded-xl font-bold border transition-all text-sm ${
                        results.bloodType === type 
                          ? 'bg-slate-800 text-white border-slate-800 ring-2 ring-slate-800 ring-offset-2' 
                          : 'bg-white border-gray-200 text-slate-600 hover:border-brand-red hover:text-brand-red'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-3">Fator Rh</label>
                <div className="grid grid-cols-2 gap-2">
                  {['+', '-'].map(rh => (
                    <button
                      key={rh}
                      onClick={() => setResults({...results, rhFactor: rh})}
                      className={`h-12 rounded-xl font-bold border transition-all text-sm ${
                        results.rhFactor === rh 
                          ? 'bg-slate-800 text-white border-slate-800 ring-2 ring-slate-800 ring-offset-2' 
                          : 'bg-white border-gray-200 text-slate-600 hover:border-brand-red hover:text-brand-red'
                      }`}
                    >
                      {rh}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-bold text-slate-700 mb-3">Sorologia e Testes NAT</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setResults({...results, serology: 'approved'})}
                  className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                    results.serology === 'approved'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-1 ring-emerald-500'
                      : 'bg-white border-gray-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${results.serology === 'approved' ? 'bg-emerald-200 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                    <CheckCircle2 size={16} />
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-sm block">Aprovado (Negativo)</span>
                    <span className="text-xs text-slate-500">Apto para transfusão</span>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    setResults({...results, serology: 'rejected'});
                    setShowTraceability(true); // Revela quem é o doador pois haverá bloqueio
                  }}
                  className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${
                    results.serology === 'rejected'
                      ? 'bg-red-50 border-red-500 text-red-800 ring-1 ring-red-500'
                      : 'bg-white border-gray-200 text-slate-600 hover:border-red-300 hover:bg-red-50/50'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${results.serology === 'rejected' ? 'bg-red-200 text-red-700' : 'bg-gray-100 text-gray-400'}`}>
                    <Ban size={16} />
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-sm block">Reagente (Inapto)</span>
                    <span className="text-xs text-slate-500">Risco Biológico</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex gap-4">
              <button 
                onClick={openDiscardModal}
                disabled={isProcessing}
                className={`flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                  results.serology === 'rejected' 
                    ? 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-200' 
                    : 'bg-gray-100 text-slate-600 hover:bg-gray-200'
                }`}
              >
                <XCircle size={20} />
                {results.serology === 'rejected' ? 'Processar Descarte e Bloqueio' : 'Descartar'}
              </button>
              
              <button 
                onClick={handleRelease}
                disabled={isProcessing || results.serology === 'rejected' || !results.bloodType || !results.rhFactor || !results.serology}
                className="flex-[2] py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:bg-slate-300"
              >
                {isProcessing ? 'Processando...' : (
                  <>
                    <Printer size={20} />
                    Liberar para Estoque
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal de Descarte e Bloqueio de Doador */}
      {showDiscardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up border-2 border-red-100">
             <div className="px-6 py-4 border-b border-gray-100 bg-red-50 flex items-center justify-between">
                <h3 className="font-bold text-red-800 flex items-center gap-2">
                   <FileWarning size={20} />
                   Descarte de Bolsa e Bloqueio
                </h3>
                <button onClick={() => setShowDiscardModal(false)} className="text-red-400 hover:text-red-700">
                   <X size={20} />
                </button>
             </div>
             
             <div className="p-6 space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-4">
                  <p className="text-xs font-bold text-slate-500 uppercase">Doador Afetado</p>
                  <p className="font-bold text-slate-800">{currentBag?.donorName}</p>
                </div>

                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Motivo do Descarte / Inaptidão</label>
                   <select 
                      className="w-full p-3 bg-white border border-gray-300 rounded-xl outline-none focus:border-red-500"
                      value={discardReason}
                      onChange={e => setDiscardReason(e.target.value)}
                   >
                      <option value="">Selecione...</option>
                      <option value="Sorologia Positiva (HIV/Hepatite/Chagas)">Sorologia Positiva (HIV/Hepatite/Chagas)</option>
                      <option value="Volume Insuficiente">Volume Insuficiente (Falha na Coleta)</option>
                      <option value="Hemólise / Coágulos">Aspecto Visual (Hemólise/Coágulos)</option>
                      <option value="Validade Expirada">Validade Expirada</option>
                      <option value="Controle de Qualidade">Reprovado no Controle de Qualidade</option>
                   </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de Bloqueio</label>
                    <select 
                        className="w-full p-3 bg-white border border-gray-300 rounded-xl outline-none focus:border-red-500"
                        value={blockType}
                        onChange={e => setBlockType(e.target.value)}
                    >
                        <option value="temporario">Temporário</option>
                        <option value="definitivo">Definitivo</option>
                    </select>
                  </div>
                  
                  {blockType === 'temporario' && (
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Dias de Inaptidão</label>
                        <input 
                           type="number"
                           className="w-full p-3 bg-white border border-gray-300 rounded-xl outline-none focus:border-red-500"
                           placeholder="Ex: 30"
                           value={blockDuration}
                           onChange={e => setBlockDuration(e.target.value)}
                        />
                     </div>
                  )}
                </div>

                <div className="flex items-start gap-2 p-3 bg-amber-50 text-amber-800 rounded-xl text-xs mt-2">
                   <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                   <p>Atenção: Ao confirmar, a bolsa será destruída (incineração) e o registro do doador será atualizado automaticamente com a inaptidão.</p>
                </div>
             </div>

             <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                <button onClick={() => setShowDiscardModal(false)} className="px-4 py-2 text-slate-500 font-bold hover:bg-gray-200 rounded-lg">Cancelar</button>
                <button 
                  onClick={finalizeDiscard}
                  disabled={!discardReason || (blockType === 'temporario' && !blockDuration)}
                  className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 shadow-lg shadow-red-200 disabled:opacity-50"
                >
                   Confirmar Descarte
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}