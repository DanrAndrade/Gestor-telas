import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, AlertTriangle, Thermometer, Activity, Scale, Heart, Save, ArrowRight, AlertOctagon, FileText } from 'lucide-react';

interface TriageQuestion {
  id: string;
  text: string;
  type: 'boolean';
  expectedAnswer: boolean;
  failureMessage: string;
}

const TRIAGE_QUESTIONS: TriageQuestion[] = [
  { id: '1', text: 'Teve febre ou gripe nos últimos 15 dias?', type: 'boolean', expectedAnswer: false, failureMessage: 'Sintomas gripais recentes (Inapto por 15 dias).' },
  { id: '2', text: 'Fez tatuagem ou maquiagem definitiva nos últimos 12 meses?', type: 'boolean', expectedAnswer: false, failureMessage: 'Tatuagem recente (Inapto por 12 meses).' },
  { id: '3', text: 'Teve relação sexual de risco ou com parceiros desconhecidos recentemente?', type: 'boolean', expectedAnswer: false, failureMessage: 'Comportamento de risco (Janela imunológica).' },
  { id: '4', text: 'Ingeriu bebida alcoólica nas últimas 12 horas?', type: 'boolean', expectedAnswer: false, failureMessage: 'Ingestão de álcool recente.' },
  { id: '5', text: 'Está grávida ou amamentando?', type: 'boolean', expectedAnswer: false, failureMessage: 'Gravidez ou amamentação em curso.' },
  { id: '6', text: 'Realizou endoscopia ou colonoscopia nos últimos 6 meses?', type: 'boolean', expectedAnswer: false, failureMessage: 'Procedimento invasivo recente (Inapto por 6 meses).' },
  { id: '7', text: 'Teve hepatite após os 11 anos de idade?', type: 'boolean', expectedAnswer: false, failureMessage: 'Histórico de Hepatite (Inapto definitivo).' },
  { id: '8', text: 'Uso de drogas ilícitas injetáveis?', type: 'boolean', expectedAnswer: false, failureMessage: 'Uso de drogas injetáveis (Inapto definitivo).' },
];

export function TriagePage() {
  const navigate = useNavigate();
  
  const [vitals, setVitals] = useState({
    weight: '',
    temperature: '',
    systolic: '',
    diastolic: '',
    pulse: ''
  });

  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  
  const [showResultModal, setShowResultModal] = useState(false);
  const [rejectionReasons, setRejectionReasons] = useState<string[]>([]);

  const handleAnswer = (questionId: string, value: boolean) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleFinishTriage = () => {
    const reasons: string[] = [];

    const weight = Number(vitals.weight);
    const temp = Number(vitals.temperature);
    const sys = Number(vitals.systolic);
    const dia = Number(vitals.diastolic);
    const pulse = Number(vitals.pulse);

    if (weight < 50) reasons.push('Peso inferior a 50kg (Mínimo exigido).');
    if (temp > 37.8) reasons.push(`Estado febril detectado (${temp}°C).`);
    if (sys > 180 || sys < 90) reasons.push(`Pressão sistólica fora dos limites (${sys}).`);
    if (dia > 100 || dia < 60) reasons.push(`Pressão diastólica fora dos limites (${dia}).`);
    if (pulse < 50 || pulse > 100) reasons.push(`Batimentos cardíacos irregulares (${pulse} bpm).`);

    TRIAGE_QUESTIONS.forEach(q => {
      const userAnswer = answers[q.id];
      if (userAnswer !== undefined && userAnswer !== q.expectedAnswer) {
        reasons.push(q.failureMessage);
      }
    });

    setRejectionReasons(reasons);
    setShowResultModal(true);
  };

  const handleConfirmResult = () => {
    setShowResultModal(false);
    navigate('/dashboard/doadores'); 
  };

  const isApproved = rejectionReasons.length === 0;

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Triagem Clínica</h1>
          <p className="text-slate-500 text-sm">Avaliação de sinais vitais e entrevista confidencial.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
             <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
               <Activity className="text-brand-red" size={20} /> Sinais Vitais
             </h2>
             
             <div className="space-y-4">
               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Peso (kg)</label>
                 <div className="relative">
                   <Scale className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input 
                      type="number" 
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-red font-bold text-slate-700"
                      placeholder="Ex: 75.5"
                      value={vitals.weight}
                      onChange={e => setVitals({...vitals, weight: e.target.value})}
                   />
                 </div>
               </div>

               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Temperatura (°C)</label>
                 <div className="relative">
                   <Thermometer className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input 
                      type="number" 
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-red font-bold text-slate-700"
                      placeholder="Ex: 36.5"
                      value={vitals.temperature}
                      onChange={e => setVitals({...vitals, temperature: e.target.value})}
                   />
                 </div>
               </div>

               <div className="grid grid-cols-2 gap-3">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pressão (Sys)</label>
                    <input 
                        type="number" 
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-red font-bold text-slate-700"
                        placeholder="120"
                        value={vitals.systolic}
                        onChange={e => setVitals({...vitals, systolic: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pressão (Dia)</label>
                    <input 
                        type="number" 
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-red font-bold text-slate-700"
                        placeholder="80"
                        value={vitals.diastolic}
                        onChange={e => setVitals({...vitals, diastolic: e.target.value})}
                    />
                 </div>
               </div>

               <div>
                 <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pulso (bpm)</label>
                 <div className="relative">
                   <Heart className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input 
                      type="number" 
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-brand-red font-bold text-slate-700"
                      placeholder="Ex: 72"
                      value={vitals.pulse}
                      onChange={e => setVitals({...vitals, pulse: e.target.value})}
                   />
                 </div>
               </div>
             </div>
           </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-full flex flex-col">
             <h2 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
               <FileText className="text-brand-red" size={20} /> Questionário de Elegibilidade
             </h2>

             <div className="flex-1 space-y-4">
               {TRIAGE_QUESTIONS.map((question) => {
                 const currentAnswer = answers[question.id];
                 const isRisk = currentAnswer !== undefined && currentAnswer !== question.expectedAnswer;

                 return (
                   <div key={question.id} className={`p-4 rounded-xl border transition-all ${isRisk ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-100'}`}>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <p className={`text-sm font-medium flex-1 ${isRisk ? 'text-red-800' : 'text-slate-700'}`}>
                          {question.text}
                        </p>
                        
                        <div className="flex gap-2 min-w-[140px]">
                           <button 
                             onClick={() => handleAnswer(question.id, true)}
                             className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                               currentAnswer === true 
                                 ? 'bg-slate-800 text-white border-slate-800' 
                                 : 'bg-white text-slate-500 border-gray-200 hover:bg-gray-100'
                             }`}
                           >
                             SIM
                           </button>
                           <button 
                             onClick={() => handleAnswer(question.id, false)}
                             className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                               currentAnswer === false 
                                 ? 'bg-slate-800 text-white border-slate-800' 
                                 : 'bg-white text-slate-500 border-gray-200 hover:bg-gray-100'
                             }`}
                           >
                             NÃO
                           </button>
                        </div>
                      </div>
                      {isRisk && (
                         <div className="mt-2 text-xs text-red-600 font-bold flex items-center gap-1 animate-pulse-slow">
                            <AlertOctagon size={12} />
                            {question.failureMessage}
                         </div>
                      )}
                   </div>
                 );
               })}
             </div>

             <div className="pt-6 mt-6 border-t border-gray-100 flex justify-end">
                <button 
                  onClick={handleFinishTriage}
                  className="px-8 py-3 bg-brand-red text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-brand-red/20 flex items-center gap-2 transition-all"
                >
                  <Save size={18} /> Finalizar Triagem
                </button>
             </div>
          </div>
        </div>
      </div>

      {showResultModal && (
        <div className="fixed inset-0 z-50  flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up">
             <div className={`p-6 text-center ${isApproved ? 'bg-emerald-50' : 'bg-red-50'}`}>
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${isApproved ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                   {isApproved ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
                </div>
                <h2 className={`text-2xl font-bold ${isApproved ? 'text-emerald-800' : 'text-red-800'}`}>
                  {isApproved ? 'Doador Apto!' : 'Doador Inapto'}
                </h2>
                <p className={`text-sm mt-1 ${isApproved ? 'text-emerald-600' : 'text-red-600'}`}>
                  {isApproved ? 'Encaminhar para a Sala de Coleta.' : 'Bloqueio temporário ou definitivo.'}
                </p>
             </div>

             <div className="p-6">
                {!isApproved && (
                  <div className="mb-6">
                    <p className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                      <AlertTriangle size={16} className="text-amber-500" /> Motivos da Inaptidão:
                    </p>
                    <ul className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                       {rejectionReasons.map((reason, index) => (
                         <li key={index} className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-100 flex items-start gap-2">
                            <span className="mt-1.5 w-1.5 h-1.5 bg-red-500 rounded-full shrink-0" />
                            {reason}
                         </li>
                       ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-3">
                   <button 
                     onClick={() => setShowResultModal(false)}
                     className="flex-1 py-3 text-slate-500 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                   >
                     Voltar / Corrigir
                   </button>
                   <button 
                     onClick={handleConfirmResult}
                     className={`flex-1 py-3 font-bold text-white rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${isApproved ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-800 hover:bg-slate-700'}`}
                   >
                     {isApproved ? <>Iniciar Coleta <ArrowRight size={18} /></> : 'Registrar Inaptidão'}
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}