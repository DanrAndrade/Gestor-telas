import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Activity, Thermometer, Weight, Heart, CheckCircle2, AlertOctagon, Calendar, ChevronRight, AlertTriangle, ArrowLeft, Save, X } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  isImpeditivo: boolean;
  blockDays?: number; 
}

const QUESTIONS: Question[] = [
  { id: 'q1', text: 'Dormiu pelo menos 6h na última noite?', isImpeditivo: true, blockDays: 1 },
  { id: 'q2', text: 'Está alimentado e evitou alimentos gordurosos nas últimas 4h?', isImpeditivo: true, blockDays: 1 },
  { id: 'q3', text: 'Fez tatuagem ou piercing nos últimos 12 meses?', isImpeditivo: true, blockDays: 365 },
  { id: 'q4', text: 'Passou por cirurgia ou procedimento médico recente?', isImpeditivo: true, blockDays: 180 },
  { id: 'q5', text: 'Teve diagnóstico de Hepatite, Chagas ou HIV?', isImpeditivo: true, blockDays: 0 }, 
];

type Step = 'vitals' | 'questions' | 'result';

export function TriagePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState<Step>('vitals');
  
  const [selectedDonor, setSelectedDonor] = useState<{name: string, id: string} | null>(null);

  const [answers, setAnswers] = useState<Record<string, { value: string; date?: string }>>({});
  const [vitals, setVitals] = useState({ weight: '', pressure: '', temp: '' });
  const [result, setResult] = useState<{ status: 'apto' | 'inapto'; reason?: string; returnDate?: string } | null>(null);

  const [potentialBlock, setPotentialBlock] = useState<{ reason: string; date: string } | null>(null);

  useEffect(() => {
    if (location.state?.donor) {
      setSelectedDonor(location.state.donor);
    } else {
      navigate('/dashboard/doadores');
    }
  }, [location, navigate]);

  const handleVitalChange = (field: string, value: string) => {
    setVitals(prev => ({ ...prev, [field]: value }));
  };

  const handleAnswerChange = (qId: string, value: string) => {
    setAnswers(prev => ({ 
      ...prev, 
      [qId]: { ...prev[qId], value } 
    }));
  };

  const handleDateChange = (qId: string, date: string) => {
    setAnswers(prev => ({ 
      ...prev, 
      [qId]: { ...prev[qId], date } 
    }));
  };

  const validateAnswers = () => {
    let detectedBlock = null;

    if (Number(vitals.weight) < 50) {
      setPotentialBlock({ reason: 'Peso inferior a 50kg', date: 'Hoje' });
      return;
    }

    for (const q of QUESTIONS) {
      const ans = answers[q.id];
      
      if ((q.id === 'q1' || q.id === 'q2') && ans?.value === 'nao') {
         setPotentialBlock({ reason: q.id === 'q1' ? 'Sono Insuficiente' : 'Jejum/Alimentação', date: 'Hoje' });
         return;
      }

      if (ans?.value === 'sim') {
        let blockDate = new Date();
        if (ans.date && q.blockDays) {
          const occurrence = new Date(ans.date);
          const release = new Date(occurrence);
          release.setDate(release.getDate() + q.blockDays);
          blockDate = release;
        } else if (q.blockDays === 0) {
          blockDate = new Date(2099, 11, 31);
        }

        if (blockDate > new Date()) {
           setPotentialBlock({ 
             reason: q.text, 
             date: blockDate.getFullYear() === 2099 ? 'Definitivo' : blockDate.toLocaleDateString('pt-BR') 
           });
           return;
        }
      }
    }

    finishTriage('apto');
  };

  const confirmBlock = () => {
    if (potentialBlock) {
      finishTriage('inapto', potentialBlock.reason, potentialBlock.date);
      setPotentialBlock(null);
    }
  };

  const cancelBlock = () => {
    setPotentialBlock(null);
  };

  const finishTriage = (status: 'apto' | 'inapto', reason?: string, returnDate?: string) => {
    setResult({ status, reason, returnDate });
    setCurrentStep('result');
  };

  if (!selectedDonor) return null;

  return (
    <div className="space-y-6 animate-fade-in-up pb-20">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard/doadores')} className="p-2 hover:bg-gray-100 rounded-full text-slate-500 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Triagem Clínica</h1>
            <p className="text-slate-500 text-sm">Avaliação de aptidão do doador.</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-blue-50 text-blue-800 rounded-xl border border-blue-100 animate-fade-in">
          <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center font-bold text-blue-700 text-xs">
            {selectedDonor.name.charAt(0)}
          </div>
          <div className="text-sm">
            <p className="font-bold">{selectedDonor.name}</p>
            <p className="text-xs opacity-70">Em atendimento</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <div className={`flex-1 h-2 rounded-full transition-all ${['vitals', 'questions', 'result'].includes(currentStep) ? 'bg-brand-red' : 'bg-gray-200'}`} />
        <div className={`flex-1 h-2 rounded-full transition-all ${['questions', 'result'].includes(currentStep) ? 'bg-brand-red' : 'bg-gray-200'}`} />
        <div className={`flex-1 h-2 rounded-full transition-all ${currentStep === 'result' ? 'bg-brand-red' : 'bg-gray-200'}`} />
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 max-w-4xl mx-auto">
        
        {currentStep === 'vitals' && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Activity className="text-brand-red" />
              Sinais Vitais
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-2">
                <label className="font-bold text-slate-700 flex items-center gap-2">
                  <Weight size={18} /> Peso (kg) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  className="w-full text-3xl font-bold p-4 border border-gray-200 rounded-xl focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 outline-none transition-all"
                  placeholder="00.0"
                  value={vitals.weight}
                  onChange={e => handleVitalChange('weight', e.target.value)}
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-700 flex items-center gap-2">
                  <Heart size={18} /> Pressão Arterial <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  className="w-full text-3xl font-bold p-4 border border-gray-200 rounded-xl focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 outline-none transition-all"
                  placeholder="12/8"
                  value={vitals.pressure}
                  onChange={e => handleVitalChange('pressure', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-700 flex items-center gap-2">
                  <Thermometer size={18} /> Temperatura (°C) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  className="w-full text-3xl font-bold p-4 border border-gray-200 rounded-xl focus:border-brand-red focus:ring-4 focus:ring-brand-red/10 outline-none transition-all"
                  placeholder="36.5"
                  value={vitals.temp}
                  onChange={e => handleVitalChange('temp', e.target.value)}
                />
              </div>
            </div>

            <div className="mt-10 flex justify-end">
              <button 
                onClick={() => setCurrentStep('questions')}
                disabled={!vitals.weight || !vitals.pressure || !vitals.temp}
                className="px-8 py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
              >
                Próxima Etapa <ChevronRight />
              </button>
            </div>
          </div>
        )}

        {currentStep === 'questions' && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <CheckCircle2 className="text-brand-red" />
              Questionário Obrigatório
            </h2>

            <div className="space-y-6">
              {QUESTIONS.map((q) => (
                <div key={q.id} className="p-4 bg-gray-50 border border-gray-100 rounded-xl transition-all hover:border-gray-300">
                  <p className="font-bold text-slate-800 mb-3 text-lg">{q.text}</p>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => handleAnswerChange(q.id, 'sim')}
                      className={`flex-1 py-3 rounded-lg font-bold border transition-all ${answers[q.id]?.value === 'sim' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-gray-200 text-slate-500 hover:bg-gray-100'}`}
                    >
                      Sim
                    </button>
                    <button 
                      onClick={() => handleAnswerChange(q.id, 'nao')}
                      className={`flex-1 py-3 rounded-lg font-bold border transition-all ${answers[q.id]?.value === 'nao' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white border-gray-200 text-slate-500 hover:bg-gray-100'}`}
                    >
                      Não
                    </button>
                  </div>

                  {answers[q.id]?.value === 'sim' && (q.id === 'q3' || q.id === 'q4') && (
                    <div className="mt-4 animate-fade-in-up">
                      <label className="block text-sm font-bold text-slate-700 mb-1">Quando ocorreu?</label>
                      <input 
                        type="date" 
                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-brand-red"
                        onChange={e => handleDateChange(q.id, e.target.value)}
                      />
                      <p className="text-xs text-amber-600 mt-1 font-bold flex items-center gap-1">
                        <AlertTriangle size={12} /> Cuidado: Verifique a data corretamente.
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-10 flex justify-between">
              <button 
                onClick={() => setCurrentStep('vitals')}
                className="px-6 py-3 text-slate-500 font-bold hover:bg-gray-100 rounded-xl transition-all"
              >
                Voltar
              </button>
              <button 
                onClick={validateAnswers}
                disabled={Object.keys(answers).length < QUESTIONS.length}
                className="px-8 py-4 bg-brand-red text-white font-bold rounded-xl hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 transition-all shadow-lg shadow-brand-red/20"
              >
                <Save size={18} /> Finalizar Triagem
              </button>
            </div>
          </div>
        )}

        {currentStep === 'result' && result && (
          <div className="animate-fade-in text-center py-8">
            {result.status === 'apto' ? (
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 animate-scale-up">
                  <CheckCircle2 size={64} />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Doador Apto!</h2>
                <p className="text-slate-500 max-w-md mx-auto mb-8">
                  A triagem foi concluída com sucesso. O doador pode ser encaminhado para a Sala de Coleta.
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => navigate('/dashboard/coleta')}
                    className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all"
                  >
                    Ir para Sala de Coleta
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6 animate-scale-up">
                  <AlertOctagon size={64} />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-2">Doador Inapto</h2>
                <div className="w-full max-w-md bg-red-50 border border-red-100 rounded-xl p-6 mb-8 text-left">
                  <div className="mb-4">
                    <p className="text-xs font-bold text-red-400 uppercase">Motivo</p>
                    <p className="font-bold text-red-800 text-lg">{result.reason}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-red-400 uppercase">Retorno</p>
                    <p className="font-bold text-red-800 text-lg flex items-center gap-2">
                      <Calendar size={18} />
                      {result.returnDate}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/dashboard/doadores')}
                  className="px-8 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 transition-all"
                >
                  Concluir
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {potentialBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-scale-up border-2 border-red-100">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertOctagon size={32} />
              <h3 className="text-xl font-bold">Confirmação de Bloqueio</h3>
            </div>
            
            <p className="text-slate-600 mb-4">
              O sistema detectou um impedimento com base nas respostas:
            </p>
            
            <div className="bg-red-50 p-4 rounded-xl border border-red-100 mb-6">
              <p className="font-bold text-red-800">{potentialBlock.reason}</p>
              <p className="text-sm text-red-600 mt-1">
                Data de liberação calculada: <strong>{potentialBlock.date}</strong>
              </p>
            </div>

            <p className="text-sm text-slate-500 mb-6">
              Verifique se a data ou a resposta foi digitada corretamente. Deseja confirmar o bloqueio deste doador?
            </p>

            <div className="flex gap-3">
              <button 
                onClick={cancelBlock}
                className="flex-1 py-3 bg-white border border-gray-300 text-slate-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Revisar Resposta
              </button>
              <button 
                onClick={confirmBlock}
                className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-200 transition-colors"
              >
                Confirmar Bloqueio
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}