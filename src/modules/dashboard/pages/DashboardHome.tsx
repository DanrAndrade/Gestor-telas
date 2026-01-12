import { useState, useRef, useEffect } from 'react';
import { Filter, Download, Building2, ChevronDown, AlertTriangle, Droplets, Calendar, Check, Users, MapPin } from 'lucide-react';
import { OperationsChart } from '../components/OperationsChart';
import { StockDistributionChart } from '../components/StockDistributionChart';

// Dados simulados de estoque
const STOCK_DATA = [
  { type: 'A+', amount: 124, status: 'stable', prediction: 15, target: 150, averageValidity: 22, entries24h: 12 },
  { type: 'A-', amount: 12, status: 'critical', prediction: 2, target: 100, averageValidity: 8, entries24h: 0 },
  { type: 'B+', amount: 86, status: 'stable', prediction: 20, target: 120, averageValidity: 25, entries24h: 8 },
  { type: 'B-', amount: 34, status: 'warning', prediction: 6, target: 80, averageValidity: 14, entries24h: 2 },
  { type: 'AB+', amount: 45, status: 'stable', prediction: 25, target: 60, averageValidity: 28, entries24h: 5 },
  { type: 'AB-', amount: 8, status: 'critical', prediction: 1, target: 40, averageValidity: 5, entries24h: 1 },
  { type: 'O+', amount: 210, status: 'stable', prediction: 30, target: 250, averageValidity: 20, entries24h: 18 },
  { type: 'O-', amount: 18, status: 'critical', prediction: 3, target: 100, averageValidity: 9, entries24h: 3 },
] as const;

// Dados demográficos simulados por tipo sanguíneo (Correlação)
const DEMOGRAPHICS_BY_TYPE: Record<string, { gender: { m: number, f: number }, age: number[] }> = {
  'A+': { gender: { m: 45, f: 55 }, age: [30, 45, 15, 10] },
  'A-': { gender: { m: 60, f: 40 }, age: [20, 50, 20, 10] },
  'B+': { gender: { m: 50, f: 50 }, age: [40, 30, 20, 10] },
  'B-': { gender: { m: 55, f: 45 }, age: [25, 45, 20, 10] },
  'AB+': { gender: { m: 40, f: 60 }, age: [35, 40, 15, 10] },
  'AB-': { gender: { m: 65, f: 35 }, age: [15, 55, 20, 10] },
  'O+': { gender: { m: 48, f: 52 }, age: [32, 38, 20, 10] },
  'O-': { gender: { m: 70, f: 30 }, age: [20, 40, 30, 10] }, // Ex: O- predominantemente masculino neste mock
};

type BloodType = typeof STOCK_DATA[number]['type'];

function CustomSelect({ 
  options, 
  value, 
  onChange, 
  icon: Icon,
  align = 'left'
}: { 
  options: { label: string, value: string }[], 
  value: string, 
  onChange: (val: string) => void,
  icon?: any,
  align?: 'left' | 'right'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = options.find(opt => opt.value === value)?.label;

  return (
    <div className="relative min-w-[140px]" ref={containerRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between pl-3 pr-2 py-2 bg-white border rounded-lg text-xs font-medium transition-all ${isOpen ? 'border-brand-red ring-2 ring-brand-red/10' : 'border-gray-200 hover:border-gray-300'}`}
      >
        <div className="flex items-center gap-2 text-slate-700 truncate">
          {Icon && <Icon size={16} className="text-gray-400" />}
          <span>{selectedLabel}</span>
        </div>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className={`absolute top-full mt-2 w-max min-w-full bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in-up ${align === 'right' ? 'right-0' : 'left-0'}`}
        >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 flex items-center justify-between ${value === option.value ? 'text-brand-red font-semibold bg-red-50' : 'text-slate-600'}`}
            >
              {option.label}
              {value === option.value && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function DashboardHome() {
  const [activeTab, setActiveTab] = useState<BloodType>(STOCK_DATA[0].type);
  const [selectedUnit, setSelectedUnit] = useState('consolidado');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const activeData = STOCK_DATA.find(d => d.type === activeTab)!;
  const percentage = Math.min((activeData.amount / activeData.target) * 100, 100);
  
  // Dados demográficos baseados no tipo selecionado (Correlação)
  const demographics = DEMOGRAPHICS_BY_TYPE[activeTab];
  const genderData = [
    { label: 'Masculino', value: demographics.gender.m, color: '#3b82f6' },
    { label: 'Feminino', value: demographics.gender.f, color: '#ec4899' },
  ];
  const ageData = [
    { label: '18-29', value: demographics.age[0], height: 'h-24' },
    { label: '30-45', value: demographics.age[1], height: 'h-32' },
    { label: '46-60', value: demographics.age[2], height: 'h-12' },
    { label: '60+', value: demographics.age[3], height: 'h-8' },
  ];

  const statusStyles = {
    critical: { color: 'text-red-700', bg: 'bg-red-50', bar: 'bg-red-500', border: 'border-red-100' },
    warning: { color: 'text-amber-700', bg: 'bg-amber-50', bar: 'bg-amber-500', border: 'border-amber-100' },
    stable: { color: 'text-emerald-700', bg: 'bg-emerald-50', bar: 'bg-emerald-500', border: 'border-emerald-100' }
  };

  const currentStyle = statusStyles[activeData.status];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-6 pb-8 animate-fade-in-up">
      
      {/* Header e Filtros */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Painel de Controle</h1>
          <p className="text-slate-500 text-sm">Visão geral da operação e níveis técnicos.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 relative">
          <div className="min-w-[240px]">
             <CustomSelect 
                icon={Building2}
                value={selectedUnit}
                onChange={setSelectedUnit}
                options={[
                  { label: 'Visão Consolidada (Rede)', value: 'consolidado' },
                  { label: 'Hemocentro Regional (Sede)', value: 'unidade-1' },
                  { label: 'Unidade Móvel 01', value: 'unidade-2' }
                ]}
              />
          </div>

          <div className="flex gap-2" ref={filterRef}>
            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`px-4 py-2 bg-white border rounded-lg shadow-sm transition-colors text-xs font-medium flex items-center gap-2 h-full ${isFilterOpen ? 'border-brand-red text-brand-red bg-red-50' : 'border-gray-200 text-slate-600 hover:bg-gray-50'}`}
              >
                 <Filter size={16} />
                 <span>Filtros</span>
              </button>
              
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-xl z-50 p-4 animate-fade-in-up">
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Período</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                          <input type="radio" name="period" className="text-brand-red focus:ring-brand-red" defaultChecked /> 
                          Hoje
                        </label>
                        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                          <input type="radio" name="period" className="text-brand-red focus:ring-brand-red" /> 
                          Esta Semana
                        </label>
                        <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                          <input type="radio" name="period" className="text-brand-red focus:ring-brand-red" /> 
                          Este Mês
                        </label>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-gray-100">
                      <button className="w-full py-2 bg-brand-red text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
                        Aplicar Filtros
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button className="px-4 py-2 text-brand-red bg-red-50 border border-red-100 rounded-lg hover:bg-red-100 shadow-sm transition-colors text-xs font-medium flex items-center gap-2 h-full">
               <Download size={16} />
               <span>Exportar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cartão Principal: Status do Estoque */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 overflow-x-auto">
          <div className="flex p-2 min-w-max gap-1">
            {STOCK_DATA.map((item) => (
              <button
                key={item.type}
                onClick={() => setActiveTab(item.type)}
                className={`flex-1 min-w-[70px] py-3 px-2 rounded-lg text-sm font-bold transition-all flex flex-col items-center gap-1 border ${
                  activeTab === item.type 
                    ? 'bg-slate-100 border-slate-200 text-slate-800 shadow-sm' 
                    : 'bg-transparent border-transparent text-slate-400 hover:bg-gray-50 hover:text-slate-600'
                }`}
              >
                <span className="text-lg">{item.type}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === item.type ? 'bg-white border border-slate-200 shadow-sm' : ''}`}>
                  {item.amount} un
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            
            <div className="flex-1 w-full space-y-6">
              <div className="flex items-start justify-between">
                <div>
                   <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Status do Estoque</h2>
                   <div className="flex items-center gap-3">
                     <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-extrabold text-slate-800 tracking-tight">{activeTab}</span>
                        <div className="h-8 w-px bg-slate-200 mx-2"></div>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-2xl font-bold text-slate-700">{activeData.amount} <span className="text-sm text-slate-400 font-normal">bolsas</span></span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full w-fit ${currentStyle.bg} ${currentStyle.color}`}>
                          {activeData.status === 'critical' ? 'NÍVEL CRÍTICO' : activeData.status === 'warning' ? 'ATENÇÃO' : 'ESTÁVEL'}
                        </span>
                     </div>
                   </div>
                </div>

                {activeData.prediction < 7 && (
                  <div className="flex items-center gap-3 px-4 py-3 bg-orange-50 border border-orange-100 rounded-xl text-orange-700 animate-pulse-slow">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase opacity-80">Risco de Esgotamento</p>
                      <p className="text-sm font-bold">Previsão: {activeData.prediction} dias</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-slate-400">
                  <span>0</span>
                  <span>Meta: {activeData.target} bolsas</span>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${currentStyle.bar}`} 
                    style={{ width: `${percentage}%` }} 
                  />
                </div>
                <p className="text-xs text-slate-400 text-right pt-1">
                  Capacidade atual: <strong>{Math.round(percentage)}%</strong> da meta operacional.
                </p>
              </div>
            </div>

            <div className="w-full lg:w-px h-px lg:h-32 bg-gray-100"></div>

            <div className="w-full lg:w-1/3 grid grid-cols-2 gap-4">
               <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-sm transition-all">
                  <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <Droplets size={16} className="text-emerald-500" />
                    <span className="text-xs font-bold uppercase">Entradas (24h)</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-700">+{activeData.entries24h}</p>
               </div>

               <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-sm transition-all">
                  <div className="flex items-center gap-2 text-slate-500 mb-2">
                    <Calendar size={16} className="text-blue-500" />
                    <span className="text-xs font-bold uppercase">Validade Média</span>
                  </div>
                  <p className="text-2xl font-bold text-slate-700">{activeData.averageValidity} dias</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gráficos de Operação e Distribuição */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative z-0">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800">Movimentação Operacional</h3>
              <p className="text-xs text-slate-400">Entradas vs Saídas de bolsas</p>
            </div>
            <div className="w-40 relative z-20">
              <CustomSelect 
                value="7d"
                onChange={() => {}}
                align="right"
                options={[
                  { label: 'Últimos 7 dias', value: '7d' },
                  { label: 'Últimos 30 dias', value: '30d' }
                ]}
              />
            </div>
          </div>
          <div className="relative z-0">
             <OperationsChart />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
             <div>
               <h3 className="text-base font-bold text-slate-800">Distribuição</h3>
               <p className="text-xs text-slate-400">Por hemocomponente</p>
             </div>
          </div>
           <StockDistributionChart />
        </div>
      </section>

      {/* Analytics do Doador (Novos Gráficos de Correlação) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <h3 className="font-bold text-slate-800">Perfil: Gênero</h3>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">Tipo {activeTab}</span>
          </div>
          
          <div className="flex items-center justify-center py-4">
            <div className="relative w-40 h-40 rounded-full transition-all duration-500" style={{ background: `conic-gradient(${genderData[0].color} 0% ${genderData[0].value}%, ${genderData[1].color} ${genderData[0].value}% 100%)` }}>
              <div className="absolute inset-0 m-8 bg-white rounded-full flex items-center justify-center flex-col">
                <span className="text-xs text-slate-400 font-bold uppercase">Total</span>
                <span className="text-xl font-bold text-slate-800">100%</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-6 mt-4">
            {genderData.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                <div>
                  <p className="text-sm font-bold text-slate-700">{item.value}%</p>
                  <p className="text-xs text-slate-400">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
             <h3 className="font-bold text-slate-800">Perfil: Faixa Etária</h3>
             <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold">Tipo {activeTab}</span>
          </div>
          
          <div className="flex items-end justify-around h-48 pt-4 pb-2 border-b border-gray-100">
            {ageData.map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-2 w-full group relative">
                <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs py-1 px-2 rounded mb-1 z-10">
                  {item.value}%
                </div>
                <div 
                  className={`w-12 md:w-16 bg-brand-red/90 rounded-t-lg transition-all duration-500 hover:bg-brand-red ${item.height}`}
                  style={{ height: `${item.value * 2.5}px` }} // Altura dinâmica baseada no valor
                ></div>
              </div>
            ))}
          </div>
          <div className="flex justify-around mt-4">
            {ageData.map((item) => (
              <div key={item.label} className="text-center w-full">
                <p className="text-sm font-bold text-slate-700">{item.label}</p>
                <p className="text-xs text-slate-400">anos</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}