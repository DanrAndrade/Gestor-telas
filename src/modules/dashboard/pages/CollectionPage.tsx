import { useState } from 'react';
import { User, Clock, CheckCircle2, AlertTriangle, Syringe, Printer, X, FileWarning } from 'lucide-react';

interface DonorInQueue {
  id: string;
  name: string;
  bloodType: string;
  triageTime: string;
  weight: number;
}

const MOCK_QUEUE: DonorInQueue[] = [
  { id: '1', name: 'João Silva', bloodType: 'O+', triageTime: '10:15', weight: 75 },
  { id: '2', name: 'Maria Oliveira', bloodType: 'A-', triageTime: '10:30', weight: 62 },
  { id: '3', name: 'Pedro Santos', bloodType: 'Unknown', triageTime: '10:45', weight: 80 },
];

export function CollectionPage() {
  const [queue, setQueue] = useState<DonorInQueue[]>(MOCK_QUEUE);
  const [selectedDonor, setSelectedDonor] = useState<DonorInQueue | null>(null);
  
  const [collectionData, setCollectionData] = useState({
    bagType: 'Sangue Total',
    volume: 450, 
    lotNumber: ''
  });

  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueData, setIssueData] = useState({ type: '', observation: '' });

  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSelectDonor = (donor: DonorInQueue) => {
    setSelectedDonor(donor);
    setCollectionData({ bagType: 'Sangue Total', volume: 450, lotNumber: `L-${Math.floor(Math.random() * 10000)}` });
  };

  const handleSuccess = () => {
    if (collectionData.volume <= 0) {
      alert('Informe um volume válido.');
      return;
    }

    if (collectionData.volume > 450) {
      alert('O volume máximo permitido por bolsa é 450ml. Verifique o valor digitado.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setSuccessMessage(`Coleta realizada com sucesso!\nVolume: ${collectionData.volume}ml\nEtiqueta gerada para ${selectedDonor?.name}.`);
      setQueue(queue.filter(d => d.id !== selectedDonor?.id));
      setSelectedDonor(null);
      setIsProcessing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1500);
  };

  const handleIssue = () => {
    if (!issueData.type) return;
    setIsProcessing(true);
    setShowIssueModal(false);
    
    setTimeout(() => {
      setSuccessMessage(`Intercorrência registrada: ${issueData.type}.\nDoador marcado para acompanhamento médico.`);
      setQueue(queue.filter(d => d.id !== selectedDonor?.id));
      setSelectedDonor(null);
      setIssueData({ type: '', observation: '' });
      setIsProcessing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Sala de Coleta</h1>
          <p className="text-slate-500 text-sm">Registro de bolsas coletadas e intercorrências.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100 font-medium">
          <Clock size={16} />
          <span>Fila de Espera: <strong>{queue.length} doadores</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden h-fit">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="font-bold text-slate-700 flex items-center gap-2">
              <User size={18} /> Aguardando Coleta
            </h2>
          </div>
          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {queue.length === 0 ? (
               <div className="p-8 text-center text-slate-400 text-sm">Ninguém na fila.</div>
            ) : (
              queue.map(donor => (
                <button 
                  key={donor.id}
                  onClick={() => handleSelectDonor(donor)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors flex justify-between items-center ${selectedDonor?.id === donor.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                >
                  <div>
                    <p className="font-bold text-slate-800">{donor.name}</p>
                    <p className="text-xs text-slate-500">Triagem: {donor.triageTime} • {donor.weight}kg</p>
                  </div>
                  {donor.bloodType !== 'Unknown' && (
                    <span className="bg-slate-100 text-slate-600 font-bold px-2 py-1 rounded text-xs">{donor.bloodType}</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          {!selectedDonor ? (
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-2xl h-[400px] flex flex-col items-center justify-center text-slate-400">
              <Syringe size={48} className="mb-4 opacity-20" />
              <p>Selecione um doador na fila para iniciar a punção.</p>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 animate-fade-in">
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-100">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 mb-1">Registro de Coleta</h2>
                  <p className="text-slate-500">Doador: <strong className="text-slate-800">{selectedDonor.name}</strong></p>
                </div>
                <div className="text-right">
                   <p className="text-xs text-slate-400 uppercase font-bold">Lote Gerado</p>
                   <p className="font-mono text-lg font-bold text-slate-700">{collectionData.lotNumber}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de Bolsa</label>
                  <select 
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-brand-red"
                    value={collectionData.bagType}
                    onChange={e => setCollectionData({...collectionData, bagType: e.target.value})}
                  >
                    <option>Sangue Total</option>
                    <option>Aférese (Plaquetas)</option>
                    <option>Aférese (Plasma)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Volume Coletado</label>
                  <div className="relative">
                     <input 
                        type="number" 
                        min="300" 
                        max="450" 
                        className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-brand-red font-mono font-bold text-slate-700 pr-10"
                        placeholder="Máx: 450"
                        value={collectionData.volume}
                        onChange={e => {
                          const val = Number(e.target.value);
                          setCollectionData({...collectionData, volume: val});
                        }}
                     />
                     <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">ml</span>
                  </div>
                  {collectionData.volume > 450 && (
                    <p className="text-xs text-red-500 mt-1 font-bold">Volume excede o limite de 450ml.</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => setShowIssueModal(true)}
                  className="px-4 py-3 bg-red-50 text-red-700 font-bold rounded-xl hover:bg-red-100 border border-red-100 flex items-center gap-2 transition-colors"
                >
                  <AlertTriangle size={18} />
                  Registrar Intercorrência
                </button>
                
                <div className="flex-1 flex gap-2 justify-end">
                   <button 
                      className="px-4 py-3 bg-white text-slate-600 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                      title="Reimprimir Etiqueta em caso de falha"
                      onClick={() => alert('Comando de reimpressão enviado para a impressora térmica.')}
                   >
                      <Printer size={18} />
                   </button>

                   <button 
                      onClick={handleSuccess}
                      disabled={isProcessing || collectionData.volume <= 0 || collectionData.volume > 450}
                      className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 flex items-center gap-2 transition-all disabled:opacity-50"
                   >
                      {isProcessing ? 'Processando...' : (
                        <>
                          <CheckCircle2 size={18} /> Confirmar Coleta
                        </>
                      )}
                   </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showIssueModal && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-up border-2 border-red-100">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-red-800 flex items-center gap-2">
                   <FileWarning /> Intercorrência / Reação Adversa
                </h3>
                <button onClick={() => setShowIssueModal(false)}><X size={20} className="text-slate-400" /></button>
             </div>

             <div className="space-y-4">
                <p className="text-sm text-slate-500">
                  O processo de coleta foi interrompido? Registre o motivo abaixo para o histórico clínico do doador.
                </p>

                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de Ocorrência</label>
                   <select 
                      className="w-full p-3 bg-white border border-red-200 rounded-xl outline-none focus:border-red-500"
                      value={issueData.type}
                      onChange={e => setIssueData({...issueData, type: e.target.value})}
                   >
                      <option value="">Selecione...</option>
                      <option value="Hematoma / Infiltração">Hematoma / Infiltração</option>
                      <option value="Reação Vagal (Tontura/Desmaio)">Reação Vagal (Tontura/Desmaio)</option>
                      <option value="Fluxo Lento / Interrompido">Fluxo Lento / Interrompido</option>
                      <option value="Volume Insuficiente (<300ml)">Volume Insuficiente (&lt;300ml)</option>
                      <option value="Desistência do Doador">Desistência do Doador</option>
                   </select>
                </div>

                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2">Observações / Conduta</label>
                   <textarea 
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-red-500 resize-none h-24"
                      placeholder="Ex: Realizado repouso e hidratação. Doador liberado após 20min."
                      value={issueData.observation}
                      onChange={e => setIssueData({...issueData, observation: e.target.value})}
                   />
                </div>

                <button 
                  onClick={handleIssue}
                  disabled={!issueData.type}
                  className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 disabled:opacity-50 mt-2"
                >
                   Registrar e Encerrar Atendimento
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Toast de Sucesso */}
      {successMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center animate-scale-up text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${successMessage.includes('Intercorrência') ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
              {successMessage.includes('Intercorrência') ? <AlertTriangle size={32} /> : <CheckCircle2 size={32} />}
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              {successMessage.includes('Intercorrência') ? 'Registrado' : 'Coleta Finalizada!'}
            </h3>
            <p className="text-slate-500 whitespace-pre-line">{successMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}