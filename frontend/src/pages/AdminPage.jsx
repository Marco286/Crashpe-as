import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const CATEGORIES = [
  { value: "motores", label: "Motores" },
  { value: "portas", label: "Portas" },
  { value: "volantes", label: "Volantes" },
  { value: "transmissoes", label: "Transmissões" },
  { value: "pecas-eletricas", label: "Peças Elétricas" },
  { value: "suspensao", label: "Suspensão" },
  { value: "outros", label: "Outros" },
];

const CONDITIONS = ["Nova", "Usada", "Recondicionada"];
const FUELS = ["Gasolina", "Diesel", "Híbrido", "Elétrico", "GPL"];
const TRANSMISSIONS = ["Manual", "Automática"];

function useAdmin() {
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");
  if (!token) navigate("/admin/login");
  return {
    headers: { "x-admin-token": token },
    logout: () => { localStorage.removeItem("adminToken"); navigate("/admin/login"); },
  };
}

// ============== Part Form ==============

function PartForm({ part, onSave, onCancel }) {
  const { headers } = useAdmin();
  const [form, setForm] = useState({
    name: part?.name || "",
    description: part?.description || "",
    category: part?.category || "motores",
    price: part?.price || "",
    condition: part?.condition || "Usada",
    compatibility: part?.compatibility || "",
    in_stock: part?.in_stock ?? true,
  });
  const [images, setImages] = useState(part?.images || (part?.image_url ? [part.image_url] : []));
  const [loading, setLoading] = useState(false);

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    const remaining = 5 - images.length;
    if (remaining <= 0) { toast.error("Máximo 5 fotos"); return; }
    const toAdd = files.slice(0, remaining);
    toAdd.forEach(file => {
      if (file.size > 5 * 1024 * 1024) { toast.error(`${file.name} demasiado grande (máx 5MB)`); return; }
      const reader = new FileReader();
      reader.onload = (ev) => setImages(prev => [...prev, ev.target.result]);
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const removeImage = (idx) => setImages(prev => prev.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...form,
        price: form.price === "" ? null : parseFloat(form.price),
        images_base64: images,
      };
      if (part?.id) {
        await axios.put(`${BACKEND_URL}/api/admin/parts/${part.id}`, data, { headers });
        toast.success("Peça atualizada!");
      } else {
        await axios.post(`${BACKEND_URL}/api/admin/parts`, data, { headers });
        toast.success("Peça adicionada!");
      }
      onSave();
    } catch {
      toast.error("Erro ao guardar peça");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-[#A3A3A3] text-sm mb-1">Nome da Peça *</label>
          <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
            className="w-full bg-[#0A0A0A] border border-[#262626] text-white px-3 py-2 focus:outline-none focus:border-[#DC2626]"
            placeholder="Ex: Motor 1.6 TDI VAG" />
        </div>
        <div>
          <label className="block text-[#A3A3A3] text-sm mb-1">Categoria *</label>
          <select required value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}
            className="w-full bg-[#0A0A0A] border border-[#262626] text-white px-3 py-2 focus:outline-none focus:border-[#DC2626]">
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[#A3A3A3] text-sm mb-1">Condição *</label>
          <select required value={form.condition} onChange={e => setForm(f => ({...f, condition: e.target.value}))}
            className="w-full bg-[#0A0A0A] border border-[#262626] text-white px-3 py-2 focus:outline-none focus:border-[#DC2626]">
            {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[#A3A3A3] text-sm mb-1">Preço (€)</label>
          <input type="number" min="0" step="0.01" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))}
            className="w-full bg-[#0A0A0A] border border-[#262626] text-white px-3 py-2 focus:outline-none focus:border-[#DC2626]"
            placeholder="Deixar vazio = Sob consulta" />
        </div>
        <div>
          <label className="block text-[#A3A3A3] text-sm mb-1">Compatibilidade</label>
          <input value={form.compatibility} onChange={e => setForm(f => ({...f, compatibility: e.target.value}))}
            className="w-full bg-[#0A0A0A] border border-[#262626] text-white px-3 py-2 focus:outline-none focus:border-[#DC2626]"
            placeholder="Ex: VW Golf VII, Seat Leon" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-[#A3A3A3] text-sm mb-1">Descrição *</label>
          <textarea required value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))}
            rows={3}
            className="w-full bg-[#0A0A0A] border border-[#262626] text-white px-3 py-2 focus:outline-none focus:border-[#DC2626] resize-none"
            placeholder="Descrição da peça..." />
        </div>
        <div className="md:col-span-2">
          <label className="block text-[#A3A3A3] text-sm mb-1">
            Fotos ({images.length}/5)
          </label>
          {images.length < 5 && (
            <input type="file" accept="image/*" multiple onChange={handleImages}
              className="w-full bg-[#0A0A0A] border border-[#262626] text-white px-3 py-2 mb-3" />
          )}
          {images.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {images.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img src={img} alt={`foto ${idx + 1}`} className="h-24 w-24 object-cover border border-[#262626]" />
                  {idx === 0 && (
                    <span className="absolute bottom-0 left-0 right-0 bg-[#DC2626] text-white text-xs text-center py-0.5">Principal</span>
                  )}
                  <button type="button" onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-black/70 text-white w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="md:col-span-2 flex items-center gap-2">
          <input type="checkbox" id="in_stock" checked={form.in_stock} onChange={e => setForm(f => ({...f, in_stock: e.target.checked}))}
            className="accent-[#DC2626]" />
          <label htmlFor="in_stock" className="text-[#A3A3A3] text-sm">Em stock</label>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading}
          className="bg-[#DC2626] hover:bg-[#b91c1c] text-white font-bold px-6 py-2 transition-colors disabled:opacity-50">
          {loading ? "A guardar..." : "GUARDAR"}
        </button>
        <button type="button" onClick={onCancel}
          className="border border-[#262626] text-[#A3A3A3] hover:text-white px-6 py-2 transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  );
}

// ============== Car Form ==============

function CarForm({ car, onSave, onCancel }) {
  const { headers } = useAdmin();
  const [form, setForm] = useState({
    brand: car?.brand || "",
    model: car?.model || "",
    year: car?.year || new Date().getFullYear(),
    price: car?.price || "",
    mileage: car?.mileage || "",
    fuel: car?.fuel || "Diesel",
    transmission: car?.transmission || "Manual",
    color: car?.color || "",
    doors: car?.doors || 5,
    power: car?.power || "",
    description: car?.description || "",
    image_base64: "",
    images: car?.images || [],
    in_stock: car?.in_stock ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(car?.images?.[0] || "");

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Imagem demasiado grande (máx 5MB)"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm(f => ({ ...f, image_base64: ev.target.result }));
      setPreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        ...form,
        price: form.price === "" ? null : parseFloat(form.price),
        mileage: form.mileage === "" ? null : parseInt(form.mileage),
        doors: parseInt(form.doors),
        year: parseInt(form.year),
      };
      if (car?.id) {
        await axios.put(`${BACKEND_URL}/api/admin/cars/${car.id}`, data, { headers });
        toast.success("Viatura atualizada!");
      } else {
        await axios.post(`${BACKEND_URL}/api/admin/cars`, data, { headers });
        toast.success("Viatura adicionada!");
      }
      onSave();
    } catch {
      toast.error("Erro ao guardar viatura");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[#A3A3A3] text-sm mb-1">Marca *</label>
          <input required value={form.brand} onChange={e => setForm(f => ({...f, brand: e.target.value}))}
            className="w-full bg-[#0A0A0A] border border-[#262626] text-white px-3 py-2 focus:outline-none focus:border-[#DC2626]"
            placeholder="Ex: BMW" />
        </div>
        <div>
          <label className="block text-[#A3A3A3] text-sm mb-1">Modelo *</label>
          <input required value={form.model} onChange={e => setForm(f => ({...f, model: e.target.value}))}
            className="w-full bg-[#0A0A0A] border border-[#262626] text-white px-3 py-2 focus:outline-none focus:border-[#DC2626]"
            placeholder="Ex: Série 3" />
        </div>
        <div>
          <label className="block text-[#A3A3A3] text-sm mb-1">Ano *</label>
          <input required type="number" min="1990" max="2030" value={form.year} onChange={e => setForm(f => ({...f, year: e.target.value}))}
            className="w-full bg-[#0A0A0A] border border-[#262626] text-white px-3 py-2 focus:outline-none focus:border-[#DC2626]" />
        </div>
        <div>
          <label className="block text-[#A3A3A3] text-sm mb-1">Preço (€)</label>
          <input type="number" min="0" value={form.price} onChange={e => setForm(f => ({...f, price: e.target.value}))}
            className="w-full bg-[#0A0A0A] border border-[#262626] text-white px-3 py-2 focus:outline-none focus:border-[#DC2626]"
            placeholder="Deixar vazio = Sob consulta" />
        </div>
        <div>
          <label className="block text-[#A3A3A3] text-sm mb-1">Quilómetros</label>
          <input type="number" min="0" value={form.mileage} onChange={e => setForm(f => ({...f, mileage: e.target.value}))}
            className="w-full bg-[#0A0A0A] border border-[#262626] text-white px-3 py-2 focus:outline-none focus:border-[#DC2626]"
            placeholder="Ex: 120000" />
        </div>
        <div>
          <label className="block text-[#A3A3A3] text-sm mb-1">Combustível *</label>
          <select required value={form.fuel} onChange={e => setForm(f => ({...f, fuel: e.target.value}))}
            className="w-full bg-[#0A0A0A] border border-[#262626] text-white px-3 py-2 focus:outline-none focus:border-[#DC2626]">
            {FUELS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[#A3A3A3] text-sm mb-1">Transmissão *</label>
          <select required value={form.transmission} onChange={e => setForm(f => ({...f, transmission: e.target.value}))}
            className="w-full bg-[#0A0A0A] border border-[#262626] text-white px-3 py-2 focus:outline-none focus:border-[#DC2626]">
            {TRANSMISSIONS.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[#A3A3A3] text-sm mb-1">Cor</label>
          <input value={form.color} onChange={e => setForm(f => ({...f, color: e.target.value}))}
            className="w-full bg-[#0A0A0A] border border-[#262626] text-white px-3 py-2 focus:outline-none focus:border-[#DC2626]"
            placeholder="Ex: Preto" />
        </div>
        <div>
          <label className="block text-[#A3A3A3] text-sm mb-1">Portas</label>
          <input type="number" min="2" max="5" value={form.doors} onChange={e => setForm(f => ({...f, doors: e.target.value}))}
            className="w-full bg-[#0A0A0A] border border-[#262626] text-white px-3 py-2 focus:outline-none focus:border-[#DC2626]" />
        </div>
        <div>
          <label className="block text-[#A3A3A3] text-sm mb-1">Potência</label>
          <input value={form.power} onChange={e => setForm(f => ({...f, power: e.target.value}))}
            className="w-full bg-[#0A0A0A] border border-[#262626] text-white px-3 py-2 focus:outline-none focus:border-[#DC2626]"
            placeholder="Ex: 150cv" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-[#A3A3A3] text-sm mb-1">Descrição *</label>
          <textarea required value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))}
            rows={3}
            className="w-full bg-[#0A0A0A] border border-[#262626] text-white px-3 py-2 focus:outline-none focus:border-[#DC2626] resize-none"
            placeholder="Descrição da viatura..." />
        </div>
        <div className="md:col-span-2">
          <label className="block text-[#A3A3A3] text-sm mb-1">Foto Principal</label>
          <input type="file" accept="image/*" onChange={handleImage}
            className="w-full bg-[#0A0A0A] border border-[#262626] text-white px-3 py-2" />
          {preview && <img src={preview} alt="preview" className="mt-2 h-32 object-cover border border-[#262626]" />}
        </div>
        <div className="md:col-span-2 flex items-center gap-2">
          <input type="checkbox" id="car_in_stock" checked={form.in_stock} onChange={e => setForm(f => ({...f, in_stock: e.target.checked}))}
            className="accent-[#DC2626]" />
          <label htmlFor="car_in_stock" className="text-[#A3A3A3] text-sm">Disponível para venda</label>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading}
          className="bg-[#DC2626] hover:bg-[#b91c1c] text-white font-bold px-6 py-2 transition-colors disabled:opacity-50">
          {loading ? "A guardar..." : "GUARDAR"}
        </button>
        <button type="button" onClick={onCancel}
          className="border border-[#262626] text-[#A3A3A3] hover:text-white px-6 py-2 transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  );
}

// ============== Main Admin Page ==============

export default function AdminPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");
  const headers = { "x-admin-token": token };
  const logout = () => { localStorage.removeItem("adminToken"); navigate("/admin/login"); };

  const [tab, setTab] = useState("pecas");
  const [parts, setParts] = useState([]);
  const [cars, setCars] = useState([]);
  const [requests, setRequests] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState({});
  const [showPartForm, setShowPartForm] = useState(false);
  const [showCarForm, setShowCarForm] = useState(false);
  const [editingPart, setEditingPart] = useState(null);
  const [editingCar, setEditingCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { navigate("/admin/login"); return; }
  }, [token, navigate]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [partsRes, carsRes, statsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/parts`),
        axios.get(`${BACKEND_URL}/api/cars`),
        axios.get(`${BACKEND_URL}/api/admin/stats`, { headers }),
      ]);
      setParts(partsRes.data);
      setCars(carsRes.data);
      setStats(statsRes.data);
    } catch {
      toast.error("Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRequests = useCallback(async () => {
    try {
      const [reqRes, conRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/admin/part-requests`, { headers }),
        axios.get(`${BACKEND_URL}/api/admin/contacts`, { headers }),
      ]);
      setRequests(reqRes.data);
      setContacts(conRes.data);
    } catch {
      toast.error("Erro ao carregar pedidos");
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (tab === "pedidos" || tab === "contactos") loadRequests();
  }, [tab, loadRequests]);

  const deletePart = async (id) => {
    if (!window.confirm("Apagar esta peça?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/admin/parts/${id}`, { headers });
      toast.success("Peça apagada");
      loadData();
    } catch { toast.error("Erro ao apagar"); }
  };

  const deleteCar = async (id) => {
    if (!window.confirm("Apagar esta viatura?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/admin/cars/${id}`, { headers });
      toast.success("Viatura apagada");
      loadData();
    } catch { toast.error("Erro ao apagar"); }
  };

  const deleteRequest = async (id) => {
    if (!window.confirm("Apagar este pedido?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/admin/part-requests/${id}`, { headers });
      toast.success("Pedido apagado");
      loadRequests();
    } catch { toast.error("Erro ao apagar"); }
  };

  const deleteContact = async (id) => {
    if (!window.confirm("Apagar este contacto?")) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/admin/contacts/${id}`, { headers });
      toast.success("Contacto apagado");
      loadRequests();
    } catch { toast.error("Erro ao apagar"); }
  };

  const markRequestReplied = async (id) => {
    try {
      await axios.put(`${BACKEND_URL}/api/admin/part-requests/${id}/reply`, {}, { headers });
      toast.success("Marcado como respondido — cliente pode voltar a enviar");
      loadRequests();
    } catch { toast.error("Erro ao marcar"); }
  };

  const markContactReplied = async (id) => {
    try {
      await axios.put(`${BACKEND_URL}/api/admin/contacts/${id}/reply`, {}, { headers });
      toast.success("Marcado como respondido — cliente pode voltar a enviar");
      loadRequests();
    } catch { toast.error("Erro ao marcar"); }
  };

  const TABS = [
    { key: "pecas", label: "Peças", count: stats.parts },
    { key: "carros", label: "Viaturas", count: stats.cars },
    { key: "pedidos", label: "Pedidos", count: stats.requests },
    { key: "contactos", label: "Contactos", count: stats.contacts },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="bg-[#171717] border-b border-[#262626] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-xl font-black">
            <span className="text-white">CRASH</span>
            <span className="text-[#DC2626]">PEÇAS</span>
          </span>
          <span className="text-[#A3A3A3] text-sm">Painel Admin</span>
        </div>
        <div className="flex gap-3">
          <a href="/" target="_blank" rel="noreferrer"
            className="border border-[#262626] text-[#A3A3A3] hover:text-white px-4 py-1.5 text-sm transition-colors">
            Ver Site
          </a>
          <button onClick={logout}
            className="border border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white px-4 py-1.5 text-sm transition-colors">
            Sair
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-[#262626]">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-6 py-3 font-bold text-sm transition-colors relative ${
                tab === t.key
                  ? "text-white border-b-2 border-[#DC2626] -mb-px"
                  : "text-[#A3A3A3] hover:text-white"
              }`}>
              {t.label}
              {t.count > 0 && (
                <span className="ml-2 bg-[#262626] text-[#A3A3A3] text-xs px-2 py-0.5 rounded-full">
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ===== PEÇAS TAB ===== */}
        {tab === "pecas" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white font-bold text-lg">Peças em Catálogo</h2>
              {!showPartForm && (
                <button onClick={() => { setEditingPart(null); setShowPartForm(true); }}
                  className="bg-[#DC2626] hover:bg-[#b91c1c] text-white font-bold px-4 py-2 text-sm transition-colors">
                  + ADICIONAR PEÇA
                </button>
              )}
            </div>

            {showPartForm && (
              <div className="bg-[#171717] border border-[#262626] p-6 mb-6">
                <h3 className="text-white font-bold mb-4">
                  {editingPart ? "Editar Peça" : "Nova Peça"}
                </h3>
                <PartForm
                  part={editingPart}
                  onSave={() => { setShowPartForm(false); setEditingPart(null); loadData(); }}
                  onCancel={() => { setShowPartForm(false); setEditingPart(null); }}
                />
              </div>
            )}

            {loading ? (
              <p className="text-[#A3A3A3]">A carregar...</p>
            ) : parts.length === 0 ? (
              <div className="bg-[#171717] border border-[#262626] p-12 text-center">
                <p className="text-[#A3A3A3] mb-4">Nenhuma peça adicionada ainda.</p>
                <button onClick={() => setShowPartForm(true)}
                  className="bg-[#DC2626] text-white font-bold px-6 py-2">
                  Adicionar primeira peça
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {parts.map(part => (
                  <div key={part.id} className="bg-[#171717] border border-[#262626] p-4 flex items-center gap-4">
                    {(part.image_base64 || part.image_url) && (
                      <img src={part.image_base64 || part.image_url} alt={part.name}
                        className="w-16 h-16 object-cover flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold truncate">{part.name}</p>
                      <p className="text-[#A3A3A3] text-sm">
                        {CATEGORIES.find(c => c.value === part.category)?.label || part.category} •{" "}
                        <span className={
                          part.condition === "Nova" ? "text-green-400" :
                          part.condition === "Recondicionada" ? "text-yellow-400" : "text-[#A3A3A3]"
                        }>{part.condition}</span>
                        {part.price ? ` • ${part.price}€` : " • Sob consulta"}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => { setEditingPart(part); setShowPartForm(true); window.scrollTo(0,0); }}
                        className="border border-[#262626] text-[#A3A3A3] hover:text-white px-3 py-1.5 text-sm transition-colors">
                        Editar
                      </button>
                      <button onClick={() => deletePart(part.id)}
                        className="border border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white px-3 py-1.5 text-sm transition-colors">
                        Apagar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== CARROS TAB ===== */}
        {tab === "carros" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white font-bold text-lg">Viaturas à Venda</h2>
              {!showCarForm && (
                <button onClick={() => { setEditingCar(null); setShowCarForm(true); }}
                  className="bg-[#DC2626] hover:bg-[#b91c1c] text-white font-bold px-4 py-2 text-sm transition-colors">
                  + ADICIONAR VIATURA
                </button>
              )}
            </div>

            {showCarForm && (
              <div className="bg-[#171717] border border-[#262626] p-6 mb-6">
                <h3 className="text-white font-bold mb-4">
                  {editingCar ? "Editar Viatura" : "Nova Viatura"}
                </h3>
                <CarForm
                  car={editingCar}
                  onSave={() => { setShowCarForm(false); setEditingCar(null); loadData(); }}
                  onCancel={() => { setShowCarForm(false); setEditingCar(null); }}
                />
              </div>
            )}

            {loading ? (
              <p className="text-[#A3A3A3]">A carregar...</p>
            ) : cars.length === 0 ? (
              <div className="bg-[#171717] border border-[#262626] p-12 text-center">
                <p className="text-[#A3A3A3] mb-4">Nenhuma viatura adicionada ainda.</p>
                <button onClick={() => setShowCarForm(true)}
                  className="bg-[#DC2626] text-white font-bold px-6 py-2">
                  Adicionar primeira viatura
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {cars.map(car => (
                  <div key={car.id} className="bg-[#171717] border border-[#262626] p-4 flex items-center gap-4">
                    {(car.image_base64 || car.images?.[0]) && (
                      <img src={car.image_base64 || car.images[0]} alt={`${car.brand} ${car.model}`}
                        className="w-16 h-16 object-cover flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold truncate">{car.brand} {car.model} ({car.year})</p>
                      <p className="text-[#A3A3A3] text-sm">
                        {car.fuel} • {car.transmission}
                        {car.mileage ? ` • ${car.mileage.toLocaleString('pt-PT')} km` : ""}
                        {car.price ? ` • ${car.price.toLocaleString('pt-PT')}€` : " • Sob consulta"}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => { setEditingCar(car); setShowCarForm(true); window.scrollTo(0,0); }}
                        className="border border-[#262626] text-[#A3A3A3] hover:text-white px-3 py-1.5 text-sm transition-colors">
                        Editar
                      </button>
                      <button onClick={() => deleteCar(car.id)}
                        className="border border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white px-3 py-1.5 text-sm transition-colors">
                        Apagar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== PEDIDOS TAB ===== */}
        {tab === "pedidos" && (
          <div>
            <h2 className="text-white font-bold text-lg mb-6">Pedidos de Peças Recebidos</h2>
            {requests.length === 0 ? (
              <div className="bg-[#171717] border border-[#262626] p-12 text-center">
                <p className="text-[#A3A3A3]">Nenhum pedido recebido ainda.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {requests.map(req => (
                  <div key={req.id} className={`bg-[#171717] border p-5 ${req.replied ? "border-green-800/50" : "border-[#262626]"}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-white font-bold">{req.full_name}</p>
                          {req.replied && (
                            <span className="bg-green-900/50 text-green-400 text-xs px-2 py-0.5 font-bold">RESPONDIDO</span>
                          )}
                        </div>
                        <p className="text-[#A3A3A3] text-sm">{req.phone} • {req.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#A3A3A3] text-xs">
                          {new Date(req.created_at).toLocaleDateString('pt-PT')}
                        </span>
                        <button onClick={() => deleteRequest(req.id)}
                          className="border border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white px-2 py-1 text-xs transition-colors">
                          Apagar
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div><span className="text-[#A3A3A3]">Viatura:</span> <span className="text-white">{req.car_brand} {req.car_model} ({req.car_year})</span></div>
                      <div><span className="text-[#A3A3A3]">Motor:</span> <span className="text-white">{req.engine_type}</span></div>
                      <div><span className="text-[#A3A3A3]">Peça:</span> <span className="text-white">{req.part_type}</span></div>
                      <div><span className="text-[#A3A3A3]">Estado:</span> <span className="text-white">{req.part_condition}</span></div>
                    </div>
                    {req.additional_description && (
                      <p className="text-[#A3A3A3] text-sm mt-3 border-t border-[#262626] pt-3">{req.additional_description}</p>
                    )}
                    <div className="mt-3 flex gap-2 flex-wrap">
                      <a href={`https://wa.me/351937257079?text=${encodeURIComponent(`Olá ${req.full_name}, em relação ao seu pedido de ${req.part_type} para ${req.car_brand} ${req.car_model}...`)}`}
                        target="_blank" rel="noreferrer"
                        className="inline-block bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-1.5 transition-colors">
                        Responder via WhatsApp
                      </a>
                      {!req.replied && (
                        <button onClick={() => markRequestReplied(req.id)}
                          className="inline-block border border-green-700 text-green-400 hover:bg-green-900/30 text-xs font-bold px-3 py-1.5 transition-colors">
                          ✓ Marcar como Respondido
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== CONTACTOS TAB ===== */}
        {tab === "contactos" && (
          <div>
            <h2 className="text-white font-bold text-lg mb-6">Mensagens de Contacto</h2>
            {contacts.length === 0 ? (
              <div className="bg-[#171717] border border-[#262626] p-12 text-center">
                <p className="text-[#A3A3A3]">Nenhuma mensagem recebida ainda.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {contacts.map(con => (
                  <div key={con.id} className={`bg-[#171717] border p-5 ${con.replied ? "border-green-800/50" : "border-[#262626]"}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-white font-bold">{con.name}</p>
                          {con.replied && (
                            <span className="bg-green-900/50 text-green-400 text-xs px-2 py-0.5 font-bold">RESPONDIDO</span>
                          )}
                        </div>
                        <p className="text-[#A3A3A3] text-sm">{con.email}{con.phone ? ` • ${con.phone}` : ""}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[#A3A3A3] text-xs">
                          {new Date(con.created_at).toLocaleDateString('pt-PT')}
                        </span>
                        <button onClick={() => deleteContact(con.id)}
                          className="border border-[#DC2626] text-[#DC2626] hover:bg-[#DC2626] hover:text-white px-2 py-1 text-xs transition-colors">
                          Apagar
                        </button>
                      </div>
                    </div>
                    <p className="text-[#DC2626] text-sm font-bold mb-1">{con.subject}</p>
                    <p className="text-[#A3A3A3] text-sm">{con.message}</p>
                    {!con.replied && (
                      <div className="mt-3">
                        <button onClick={() => markContactReplied(con.id)}
                          className="inline-block border border-green-700 text-green-400 hover:bg-green-900/30 text-xs font-bold px-3 py-1.5 transition-colors">
                          ✓ Marcar como Respondido
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
