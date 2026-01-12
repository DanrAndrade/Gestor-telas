import { useState } from 'react';
import { User, MapPin, FileText, Save, ArrowLeft, ChevronRight, UploadCloud, AlertCircle, CheckCircle2, Megaphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Step = 'personal' | 'contact' | 'docs';

interface FormErrors {
  [key: string]: string;
}

export function DonorFormPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [age, setAge] = useState<number>(0);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    socialName: '',
    birthDate: '',
    gender: '',
    docType: 'RG',
    docNumber: '',
    cep: '',
    address: '',
    phone: '',
    email: '',
    marketingConsent: false // Novo campo de consentimento
  });

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const formatCEP = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (field: string, value: string | boolean) => {
    let formattedValue = value;

    if (typeof value === 'string') {
      if (field === 'phone') formattedValue = formatPhone(value);
      if (field === 'cep') formattedValue = formatCEP(value);
    }
    
    setFormData(prev => ({ ...prev, [field]: formattedValue }));
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData({ ...formData, birthDate: val });
    
    if (val) {
      const today = new Date();
      const birthDate = new Date(val);
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      setAge(calculatedAge);
      
      if (errors.birthDate) {
        setErrors(prev => { const n = { ...prev }; delete n.birthDate; return n; });
      }
    }
  };

  const validateStep = (step: Step): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (step === 'personal') {
      if (!formData.name.trim()) newErrors.name = 'Nome completo é obrigatório';
      else if (formData.name.split(' ').length < 2) newErrors.name = 'Digite o sobrenome';
      
      if (!formData.docNumber.trim()) newErrors.docNumber = 'Documento é obrigatório';
      if (!formData.birthDate) newErrors.birthDate = 'Data de nascimento é obrigatória';
      if (!formData.gender) newErrors.gender = 'Gênero é obrigatório';
    }

    if (step === 'contact') {
      if (!formData.address.trim()) newErrors.address = 'Endereço é obrigatório';
      
      if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';
      else if (formData.phone.length < 14) newErrors.phone = 'Telefone inválido';

      if (formData.email && !validateEmail(formData.email)) {
        newErrors.email = 'Formato de e-mail inválido';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      isValid = false;
    }

    return isValid;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 'personal') setCurrentStep('contact');
      else if (currentStep === 'contact') setCurrentStep('docs');
    }
  };

  const handleSave = () => {
    setShowSuccessModal(true);
    setTimeout(() => {
      navigate('/dashboard/doadores');
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in-up pb-10 relative">
      
      <div className="flex items-center gap-4 mb-2">
        <button onClick={() => navigate('/dashboard/doadores')} className="p-2 hover:bg-gray-100 rounded-full text-slate-500 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Cadastro de Doador</h1>
          <p className="text-slate-500 text-sm">Novo registro no sistema.</p>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <div className={`flex-1 h-2 rounded-full transition-all ${['personal', 'contact', 'docs'].includes(currentStep) ? 'bg-brand-red' : 'bg-gray-200'}`} />
        <div className={`flex-1 h-2 rounded-full transition-all ${['contact', 'docs'].includes(currentStep) ? 'bg-brand-red' : 'bg-gray-200'}`} />
        <div className={`flex-1 h-2 rounded-full transition-all ${currentStep === 'docs' ? 'bg-brand-red' : 'bg-gray-200'}`} />
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        
        {currentStep === 'personal' && (
          <div className="space-y-6 max-w-4xl animate-fade-in">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <User size={20} className="text-brand-red" /> Dados Pessoais
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">Nome Civil Completo <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className={`w-full px-4 py-2.5 bg-white border rounded-xl outline-none transition-all ${errors.name ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:border-brand-red focus:ring-2 focus:ring-brand-red/10'}`}
                  value={formData.name}
                  onChange={e => handleChange('name', e.target.value)}
                  autoFocus
                />
                {errors.name && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.name}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-purple-700 mb-1">Nome Social (Opcional)</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-purple-50 border border-purple-100 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-purple-900"
                  value={formData.socialName}
                  onChange={e => handleChange('socialName', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Documento Oficial <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <select 
                    className="w-24 px-3 py-2.5 bg-white border border-gray-200 rounded-xl focus:border-brand-red outline-none"
                    value={formData.docType}
                    onChange={e => handleChange('docType', e.target.value)}
                  >
                    <option>RG</option>
                    <option>CNH</option>
                  </select>
                  <div className="flex-1">
                    <input 
                      type="text" 
                      className={`w-full px-4 py-2.5 bg-white border rounded-xl outline-none transition-all ${errors.docNumber ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:border-brand-red focus:ring-2 focus:ring-brand-red/10'}`}
                      value={formData.docNumber}
                      onChange={e => handleChange('docNumber', e.target.value)}
                    />
                    {errors.docNumber && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.docNumber}</p>}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Data de Nascimento <span className="text-red-500">*</span></label>
                <input 
                  type="date" 
                  className={`w-full px-4 py-2.5 bg-white border rounded-xl outline-none transition-all ${errors.birthDate ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:border-brand-red focus:ring-2 focus:ring-brand-red/10'}`}
                  value={formData.birthDate}
                  onChange={handleDateChange}
                />
                {errors.birthDate && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.birthDate}</p>}
                {age > 0 && !errors.birthDate && (
                  <p className={`text-xs mt-1 font-bold ${age < 18 || age > 69 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    Idade calculada: {age} anos
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Gênero Biológico <span className="text-red-500">*</span></label>
                <select 
                  className={`w-full px-4 py-2.5 bg-white border rounded-xl outline-none transition-all ${errors.gender ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:border-brand-red'}`}
                  value={formData.gender}
                  onChange={e => handleChange('gender', e.target.value)}
                >
                  <option value="">Selecione...</option>
                  <option value="M">Masculino</option>
                  <option value="F">Feminino</option>
                </select>
                {errors.gender && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.gender}</p>}
              </div>
            </div>
          </div>
        )}

        {currentStep === 'contact' && (
          <div className="space-y-6 max-w-4xl animate-fade-in">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <MapPin size={20} className="text-brand-red" /> Contato & Endereço
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">CEP</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/10 transition-all"
                  placeholder="00000-000"
                  value={formData.cep}
                  maxLength={9}
                  onChange={e => handleChange('cep', e.target.value)}
                  autoFocus
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-1">Endereço Completo <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className={`w-full px-4 py-2.5 bg-white border rounded-xl outline-none transition-all ${errors.address ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:border-brand-red focus:ring-2 focus:ring-brand-red/10'}`}
                  value={formData.address}
                  onChange={e => handleChange('address', e.target.value)}
                />
                {errors.address && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.address}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Celular / WhatsApp <span className="text-red-500">*</span></label>
                <input 
                  type="tel" 
                  className={`w-full px-4 py-2.5 bg-white border rounded-xl outline-none transition-all ${errors.phone ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:border-brand-red focus:ring-2 focus:ring-brand-red/10'}`}
                  value={formData.phone}
                  maxLength={15}
                  placeholder="(00) 00000-0000"
                  onChange={e => handleChange('phone', e.target.value)}
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">E-mail</label>
                <input 
                  type="email" 
                  className={`w-full px-4 py-2.5 bg-white border rounded-xl outline-none transition-all ${errors.email ? 'border-red-500 focus:ring-2 focus:ring-red-200' : 'border-gray-200 focus:border-brand-red focus:ring-2 focus:ring-brand-red/10'}`}
                  value={formData.email}
                  onChange={e => handleChange('email', e.target.value)}
                />
                {errors.email && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.email}</p>}
              </div>

              {/* Novo Campo: Consentimento de Contato */}
              <div className="md:col-span-2 mt-2">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3 transition-colors hover:border-blue-200">
                   <div className="pt-0.5">
                     <input 
                       type="checkbox" 
                       id="marketingConsent"
                       className="w-5 h-5 rounded border-gray-300 text-brand-red focus:ring-brand-red cursor-pointer"
                       checked={formData.marketingConsent}
                       onChange={e => handleChange('marketingConsent', e.target.checked)}
                     />
                   </div>
                   <label htmlFor="marketingConsent" className="cursor-pointer select-none">
                     <p className="text-sm font-bold text-blue-900 flex items-center gap-2">
                       <Megaphone size={16} />
                       Autorização de Contato
                     </p>
                     <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                       Autorizo o uso do meu e-mail e telefone para recebimento de avisos sobre estoque crítico, campanhas de doação e chamados de emergência.
                     </p>
                   </label>
                </div>
              </div>

            </div>
          </div>
        )}

        {currentStep === 'docs' && (
          <div className="animate-fade-in">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
              <FileText size={20} className="text-brand-red" /> Documentos
            </h2>

            <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
              <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <UploadCloud size={32} className="text-brand-red" />
              </div>
              <h3 className="font-bold text-slate-700 text-lg">Arraste documentos aqui</h3>
              <p className="text-slate-400 text-sm mt-1">PDFs, Imagens ou Scans (Max 5MB)</p>
              <button className="mt-6 px-6 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-slate-600 hover:text-brand-red transition-colors">
                Selecionar Arquivos
              </button>
            </div>
          </div>
        )}

      </div>

      <div className="flex justify-between pt-4 border-t border-gray-100">
        <button 
          onClick={() => {
            if (currentStep === 'personal') navigate('/dashboard/doadores');
            if (currentStep === 'contact') setCurrentStep('personal');
            if (currentStep === 'docs') setCurrentStep('contact');
          }}
          className="px-6 py-3 text-slate-500 font-bold hover:bg-gray-100 rounded-xl transition-colors"
        >
          {currentStep === 'personal' ? 'Cancelar' : 'Voltar'}
        </button>

        {currentStep !== 'docs' ? (
          <button 
            onClick={nextStep}
            className="px-8 py-3 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-700 flex items-center gap-2 transition-all shadow-lg shadow-slate-200"
          >
            Próximo <ChevronRight size={18} />
          </button>
        ) : (
          <button 
            onClick={handleSave}
            className="px-8 py-3 bg-brand-red hover:bg-red-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-lg shadow-brand-red/20 transition-all"
          >
            <Save size={18} />
            Salvar Cadastro
          </button>
        )}
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center animate-scale-up">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 text-emerald-600">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Doador Cadastrado!</h3>
            <p className="text-slate-500">Redirecionando para a listagem...</p>
          </div>
        </div>
      )}

    </div>
  );
}