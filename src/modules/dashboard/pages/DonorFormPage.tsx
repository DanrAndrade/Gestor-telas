import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, User, Phone, MapPin, Calendar, FileText, Activity } from 'lucide-react';

export function DonorFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    birthDate: '',
    cpf: '',
    rg: '',
    gender: 'Masculino',
    bloodType: 'Desconhecido', // Novo campo
    weight: '',
    address: '',
    city: '',
    state: ''
  });

  useEffect(() => {
    if (isEditing) {
      // Simulação de busca de dados para edição
      setFormData({
        fullName: 'João Silva',
        email: 'joao@email.com',
        phone: '(11) 99999-9999',
        birthDate: '1990-05-15',
        cpf: '123.456.789-00',
        rg: '12.345.678-9',
        gender: 'Masculino',
        bloodType: 'O+', // Dado vindo do banco
        weight: '75',
        address: 'Rua das Flores, 123',
        city: 'São Paulo',
        state: 'SP'
      });
    }
  }, [isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      navigate('/dashboard/doadores');
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <div className="flex items-center gap-4 mb-6">
        <button 
          onClick={() => navigate('/dashboard/doadores')}
          className="p-2 hover:bg-gray-100 rounded-lg text-slate-500 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            {isEditing ? 'Editar Doador' : 'Novo Doador'}
          </h1>
          <p className="text-slate-500 text-sm">Preencha os dados completos para o prontuário.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
            <User className="text-brand-red" size={20} />
            Dados Pessoais
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Nome Completo</label>
              <input 
                type="text" 
                name="fullName"
                required
                className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/10 transition-all"
                placeholder="Ex: Maria Oliveira"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">CPF</label>
              <input 
                type="text" 
                name="cpf"
                required
                className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/10 transition-all"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">RG</label>
              <input 
                type="text" 
                name="rg"
                className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/10 transition-all"
                placeholder="00.000.000-0"
                value={formData.rg}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Data de Nascimento</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="date" 
                  name="birthDate"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/10 transition-all text-slate-600"
                  value={formData.birthDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Gênero</label>
              <select 
                name="gender"
                className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/10 transition-all"
                value={formData.gender}
                onChange={handleChange}
              >
                <option>Masculino</option>
                <option>Feminino</option>
                <option>Outro</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
            <Activity className="text-brand-red" size={20} />
            Dados Clínicos & Triagem
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Tipo Sanguíneo (Declarado)</label>
              <select 
                name="bloodType"
                className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/10 transition-all font-bold text-slate-700"
                value={formData.bloodType}
                onChange={handleChange}
              >
                <option value="Desconhecido">Não sei / Desconhecido</option>
                <option value="A+">A Positivo (A+)</option>
                <option value="A-">A Negativo (A-)</option>
                <option value="B+">B Positivo (B+)</option>
                <option value="B-">B Negativo (B-)</option>
                <option value="AB+">AB Positivo (AB+)</option>
                <option value="AB-">AB Negativo (AB-)</option>
                <option value="O+">O Positivo (O+)</option>
                <option value="O-">O Negativo (O-)</option>
              </select>
              <p className="text-xs text-slate-500 mt-1">Este dado será confirmado pelo Laboratório após a primeira doação.</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Peso Aproximado (kg)</label>
              <input 
                type="number" 
                name="weight"
                className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/10 transition-all"
                placeholder="Ex: 75"
                value={formData.weight}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
            <Phone className="text-brand-red" size={20} />
            Contato & Endereço
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">E-mail</label>
              <input 
                type="email" 
                name="email"
                className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/10 transition-all"
                placeholder="exemplo@email.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Telefone / WhatsApp</label>
              <input 
                type="tel" 
                name="phone"
                required
                className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/10 transition-all"
                placeholder="(00) 00000-0000"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Endereço Completo</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  name="address"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/10 transition-all"
                  placeholder="Rua, Número, Bairro"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Cidade</label>
              <input 
                type="text" 
                name="city"
                className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/10 transition-all"
                placeholder="Ex: São Paulo"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Estado</label>
              <select 
                name="state"
                className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/10 transition-all"
                value={formData.state}
                onChange={handleChange}
              >
                <option value="">Selecione...</option>
                <option value="SP">São Paulo</option>
                <option value="RJ">Rio de Janeiro</option>
                <option value="MG">Minas Gerais</option>
                <option value="BA">Bahia</option>
                <option value="RS">Rio Grande do Sul</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <button 
            type="button"
            onClick={() => navigate('/dashboard/doadores')}
            className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-brand-red text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-brand-red/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              'Salvando...'
            ) : (
              <>
                <Save size={20} />
                {isEditing ? 'Salvar Alterações' : 'Cadastrar Doador'}
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}