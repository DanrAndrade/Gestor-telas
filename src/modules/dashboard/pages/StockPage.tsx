import { useState } from 'react';
import { Search, Filter, AlertTriangle, Trash2, Droplets, ArrowUpDown, CheckCircle2, AlertCircle, Edit2, X, MapPin, Save, ChevronDown, PackagePlus, ArrowRight } from 'lucide-react';

type BagStatus = 'disponivel' | 'quarentena' | 'reservada' | 'vencida' | 'descartada' | 'aguardando_armazenamento';
type BloodComponent = 'Concentrado de Hemácias' | 'Plasma Fresco' | 'Plaquetas' | 'Sangue Total';

interface BloodBag {
  id: string;
  code: string; 
  type: string; 
  component: BloodComponent;
  collectionDate: string;
  expirationDate: string;
  status: BagStatus;
  location: string;
}

function getDaysRemaining(expirationDate: string): number {
  const today = new Date();
  const exp = new Date(expirationDate);
  const diffTime = exp.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
}

function getValidityStatus(days: number) {
  if (days < 0) return { color: 'text-red-600 bg-red-50 border-red-100', label: 'Vencida', icon: AlertCircle };
  if (days <= 3) return { color: 'text-amber-600 bg-amber-50 border-amber-100', label: 'Vence em breve', icon: AlertTriangle };
  return { color: 'text-emerald-600 bg-emerald-50 border-emerald-100', label: 'Validade OK', icon: CheckCircle2 };
}

// Bolsas já no estoque (Disponíveis)
const INITIAL_STOCK: BloodBag[] = [
  { id: '1', code: 'W1234 56789', type: 'O+', component: 'Concentrado de Hemácias', collectionDate: '2023-12-01', expirationDate: '2024-01-10', status: 'disponivel', location: 'Geladeira 01 - A' },
  { id: '2', code: 'W1234 56790', type: 'A-', component: 'Concentrado de Hemácias', collectionDate: '2023-12-05', expirationDate: '2026-06-15', status: 'disponivel', location: 'Geladeira 02 - B' },
  { id: '3', code: 'W1234 56791', type: 'B+', component: 'Plaquetas', collectionDate: '2024-02-01', expirationDate: '2024-02-06', status: 'reservada', location: 'Agitador 01' },
];

// Bolsas vindas do Laboratório (Aguardando local)
const INCOMING_BAGS: BloodBag[] = [
  { id: '101', code: 'W1234 56800', type: 'AB+', component: 'Plasma Fresco', collectionDate: '2024-02-14', expirationDate: '2025-02-14', status: 'aguardando_armazenamento', location: '' },
  { id: '102', code: 'W1234 56801', type: 'O-', component: 'Concentrado de Hemácias', collectionDate: '2024-02-14', expirationDate: '2024-03-20', status: 'aguardando_armazenamento', location: '' },
];

export function StockPage() {
  const [activeTab, setActiveTab] = useState<'stock' | 'incoming'>('stock');
  const [bags, setBags] = useState<BloodBag[]>(INITIAL_STOCK);
  const [incomingBags, setIncomingBags] = useState<BloodBag[]>(INCOMING_BAGS);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState('todos');
  const [filterStatus, setFilterStatus] = useState('todos');
  
  const [editingBag, setEditingBag] = useState<BloodBag | null>(null);
  const [newLocation, setNewLocation] = useState('');

  // Estados para armazenamento (Tab Entrada)
  const [storingLocation, setStoringLocation] = useState<{[key: string]: string}>({});

  const filteredBags = bags.filter(bag => {
    const matchesSearch = bag.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          bag.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'todos' || bag.type === filterType;
    const matchesStatus = filterStatus === 'todos' || bag.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredBags.map(b => b.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(itemId => itemId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBatchDiscard = () => {
    if (confirm(`Tem certeza que deseja descartar ${selectedIds.length} bolsas selecionadas?`)) {
      setBags(bags.filter(bag => !selectedIds.includes(bag.id)));
      setSelectedIds([]);
      alert('Bolsas descartadas e registradas no log de auditoria.');
    }
  };

  const openEditModal = (bag: BloodBag) => {
    setEditingBag(bag);
    setNewLocation(bag.location);
  };

  const handleSaveLocation = () => {
    if (editingBag && newLocation.trim()) {
      setBags(bags.map(b => 
        b.id === editingBag.id ? { ...b, location: newLocation } : b
      ));
      setEditingBag(null);
      setNewLocation('');
    }
  };

  const confirmStorage = (bagId: string) => {
    const location = storingLocation[bagId];
    if (!location) {
      alert('Por favor, defina um local de armazenamento.');
      return;
    }

    const bagToStore = incomingBags.find(b => b.id === bagId);
    if (bagToStore) {
      const storedBag: BloodBag = { ...bagToStore, status: 'disponivel', location: location };
      setBags([storedBag, ...bags]);
      setIncomingBags(incomingBags.filter(b => b.id !== bagId));
      
      const newLocations = { ...storingLocation };
      delete newLocations[bagId];
      setStoringLocation(newLocations);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Estoque de Sangue</h1>
          <p className="text-slate-500 text-sm">Gerenciamento físico, validade e armazenamento.</p>
        </div>
      </div>

      <div className="flex border-b border-gray-200">
        <button 
          onClick={() => setActiveTab('stock')}
          className={`px-6 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${activeTab === 'stock' ? 'border-brand-red text-brand-red' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <Droplets size={18} /> Estoque Disponível
        </button>
        <button 
          onClick={() => setActiveTab('incoming')}
          className={`px-6 py-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${activeTab === 'incoming' ? 'border-brand-red text-brand-red' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          <PackagePlus size={18} /> Entrada do Laboratório
          {incomingBags.length > 0 && (
            <span className="bg-red-100 text-brand-red text-[10px] px-2 py-0.5 rounded-full">{incomingBags.length}</span>
          )}
        </button>
      </div>

      {activeTab === 'stock' && (
        <>
          <div className="flex justify-between items-center gap-4">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar código ou tipo..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:border-brand-red focus:ring-2 focus:ring-brand-red/10 outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex gap-2 relative">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2.5 bg-white border rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm transition-colors ${showFilters ? 'border-brand-red text-brand-red' : 'border-gray-200 text-slate-600 hover:bg-gray-50'}`}
              >
                  <Filter size={18} />
                  <span>Filtros</span>
                  <ChevronDown size={14} />
              </button>
              
              {showFilters && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-100 rounded-xl shadow-xl z-20 p-4 animate-fade-in-up">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tipo Sanguíneo</label>
                      <select 
                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-brand-red"
                        value={filterType}
                        onChange={e => setFilterType(e.target.value)}
                      >
                        <option value="todos">Todos</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Status</label>
                      <select 
                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-brand-red"
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                      >
                        <option value="todos">Todos</option>
                        <option value="disponivel">Disponível</option>
                        <option value="quarentena">Quarentena</option>
                        <option value="reservada">Reservada</option>
                        <option value="vencida">Vencida</option>
                      </select>
                    </div>
                    <button 
                      onClick={() => { setFilterType('todos'); setFilterStatus('todos'); }}
                      className="w-full py-2 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-gray-100 rounded-lg"
                    >
                      Limpar Filtros
                    </button>
                  </div>
                </div>
              )}

              {selectedIds.length > 0 && (
                <button 
                    onClick={handleBatchDiscard}
                    className="px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 text-brand-red text-sm font-bold flex items-center gap-2 shadow-sm transition-colors animate-pulse-slow"
                >
                    <Trash2 size={18} />
                    <span>Descartar ({selectedIds.length})</span>
                </button>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="p-4 w-12 text-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-gray-300 text-brand-red focus:ring-brand-red w-4 h-4 cursor-pointer"
                        onChange={handleSelectAll}
                        checked={filteredBags.length > 0 && selectedIds.length === filteredBags.length}
                      />
                    </th>
                    <th className="p-4">Código / Componente</th>
                    <th className="p-4">Tipo</th>
                    <th className="p-4">
                      <div className="flex items-center gap-1 cursor-pointer hover:text-slate-700">
                        Validade
                        <ArrowUpDown size={12} />
                      </div>
                    </th>
                    <th className="p-4">Localização</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredBags.map((bag) => {
                    const daysRemaining = getDaysRemaining(bag.expirationDate);
                    const validityStyle = getValidityStatus(daysRemaining);
                    const ValidityIcon = validityStyle.icon;
                    const isSelected = selectedIds.includes(bag.id);

                    return (
                      <tr 
                        key={bag.id} 
                        className={`group transition-colors hover:bg-slate-50 ${isSelected ? 'bg-red-50/10' : ''}`}
                      >
                        <td className="p-4 text-center">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300 text-brand-red focus:ring-brand-red w-4 h-4 cursor-pointer"
                            checked={isSelected}
                            onChange={() => handleSelectOne(bag.id)}
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-mono font-bold text-slate-700">{bag.code}</span>
                            <span className="text-xs text-slate-500">{bag.component}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                              bag.type.includes('-') ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {bag.type}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-slate-500">Expira: {new Date(bag.expirationDate).toLocaleDateString('pt-BR')}</span>
                            
                            <div className={`flex items-center gap-1.5 w-fit px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase ${validityStyle.color}`}>
                              <ValidityIcon size={12} />
                              <span>{daysRemaining < 0 ? 'Vencida' : `${daysRemaining} dias`}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <Droplets size={14} className="text-slate-400" />
                            {bag.location}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                            ${bag.status === 'disponivel' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : ''}
                            ${bag.status === 'quarentena' ? 'bg-blue-50 text-blue-700 border-blue-100' : ''}
                            ${bag.status === 'reservada' ? 'bg-violet-50 text-violet-700 border-violet-100' : ''}
                            ${bag.status === 'vencida' ? 'bg-gray-100 text-gray-600 border-gray-200' : ''}
                          `}>
                            {bag.status.charAt(0).toUpperCase() + bag.status.slice(1)}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => openEditModal(bag)}
                            className="p-2 text-slate-400 hover:text-brand-red hover:bg-red-50 rounded-lg transition-colors group relative"
                            title="Editar Localização"
                          >
                            <Edit2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {filteredBags.length === 0 && (
                <div className="p-12 text-center text-slate-400">
                  <p>Nenhuma bolsa encontrada com os filtros atuais.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'incoming' && (
        <div className="space-y-4 animate-fade-in">
          {incomingBags.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-slate-400">
              <PackagePlus size={48} className="mx-auto mb-4 opacity-20" />
              <p>Nenhuma bolsa aguardando armazenamento no momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {incomingBags.map(bag => (
                <div key={bag.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
                   <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="font-mono font-bold text-lg text-slate-800">{bag.code}</span>
                        <p className="text-xs text-slate-500">{bag.component}</p>
                      </div>
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        bag.type.includes('-') ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {bag.type}
                      </span>
                   </div>

                   <div className="space-y-3">
                      <div className="text-xs text-slate-500 flex items-center gap-1 bg-gray-50 p-2 rounded-lg">
                        <CheckCircle2 size={12} className="text-emerald-500" />
                        Liberado pelo Lab em {new Date().toLocaleDateString('pt-BR')}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Definir Localização Física</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-brand-red"
                            placeholder="Ex: Geladeira 01 - A"
                            value={storingLocation[bag.id] || ''}
                            onChange={(e) => setStoringLocation({...storingLocation, [bag.id]: e.target.value})}
                          />
                          <button 
                            onClick={() => confirmStorage(bag.id)}
                            disabled={!storingLocation[bag.id]}
                            className="px-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 transition-colors"
                          >
                            <ArrowRight size={18} />
                          </button>
                        </div>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {editingBag && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <MapPin className="text-brand-red" size={20} />
                Movimentação de Estoque
              </h3>
              <button onClick={() => setEditingBag(null)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                 <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-blue-700 border border-blue-100 shadow-sm">
                   {editingBag.type}
                 </div>
                 <div>
                   <p className="text-xs font-bold text-blue-400 uppercase">Bolsa Selecionada</p>
                   <p className="font-mono font-bold text-slate-700">{editingBag.code}</p>
                 </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Nova Localização</label>
                <div className="relative">
                   <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                   <input 
                      type="text" 
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:border-brand-red focus:ring-2 focus:ring-brand-red/10 outline-none transition-all"
                      placeholder="Ex: Geladeira 03 - Prateleira B"
                      autoFocus
                   />
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setEditingBag(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-gray-200 rounded-lg">Cancelar</button>
              <button onClick={handleSaveLocation} className="px-4 py-2 bg-brand-red text-white text-sm font-bold rounded-lg flex items-center gap-2 shadow-lg shadow-brand-red/20">
                <Save size={16} /> Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}