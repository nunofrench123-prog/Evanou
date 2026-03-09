import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format, parseISO, differenceInDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Wallet,
  List,
  Package,
  FileText,
  PiggyBank,
  Plus,
  Trash2,
  CheckSquare,
  Square,
  Edit,
  Save,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  subscribeToTrip,
  subscribeToActivities,
  addActivity,
  deleteActivity,
  subscribeToPackingList,
  addPackingItem,
  togglePackingItem,
  deletePackingItem,
  subscribeToExpenses,
  addExpense,
  deleteExpense,
  subscribeToNotes,
  saveNotes,
} from '../firebase/firestore';
import TripModal from '../components/TripModal';

// ─── Section Accordion ─────────────────────────────────────────────────────

function Section({ title, icon, defaultOpen = false, children, badge }) {
  const SectionIcon = icon;
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card p-0 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors"
      >
        <SectionIcon className="w-5 h-5 text-rose-500 shrink-0" />
        <span className="font-semibold text-gray-800 flex-1 text-left">{title}</span>
        {badge !== undefined && (
          <span className="bg-rose-100 text-rose-600 text-xs font-bold px-2 py-0.5 rounded-full">
            {badge}
          </span>
        )}
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
        )}
      </button>
      {open && <div className="border-t border-gray-100 px-6 py-5">{children}</div>}
    </div>
  );
}

// ─── Activities ─────────────────────────────────────────────────────────────

function ActivitiesSection({ tripId }) {
  const [activities, setActivities] = useState([]);
  const [form, setForm] = useState({ title: '', date: '', time: '', location: '', notes: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const unsub = subscribeToActivities(tripId, setActivities);
    return unsub;
  }, [tripId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    await addActivity(tripId, form);
    setForm({ title: '', date: '', time: '', location: '', notes: '' });
    setShowForm(false);
  };

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <Section title="Programme & Activités" icon={List} defaultOpen badge={activities.length}>
      <div className="space-y-3">
        {activities.map((act) => (
          <div
            key={act.id}
            className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">{act.title}</p>
              <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-500">
                {act.date && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {format(parseISO(act.date), 'd MMM', { locale: fr })}
                    {act.time && ` à ${act.time}`}
                  </span>
                )}
                {act.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {act.location}
                  </span>
                )}
              </div>
              {act.notes && <p className="text-xs text-gray-400 mt-1 italic">{act.notes}</p>}
            </div>
            <button
              onClick={() => deleteActivity(tripId, act.id)}
              className="text-gray-300 hover:text-red-400 transition-colors shrink-0"
              aria-label="Supprimer l'activité"
              title="Supprimer l'activité"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {showForm ? (
          <form onSubmit={handleAdd} className="space-y-3 pt-2">
            <input
              className="input-field"
              placeholder="Nom de l'activité *"
              value={form.title}
              onChange={set('title')}
              required
              autoFocus
            />
            <div className="grid grid-cols-2 gap-2">
              <input className="input-field" type="date" value={form.date} onChange={set('date')} />
              <input className="input-field" type="time" value={form.time} onChange={set('time')} />
            </div>
            <input
              className="input-field"
              placeholder="Lieu"
              value={form.location}
              onChange={set('location')}
            />
            <input
              className="input-field"
              placeholder="Notes"
              value={form.notes}
              onChange={set('notes')}
            />
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">
                <X className="w-4 h-4 inline mr-1" />
                Annuler
              </button>
              <button type="submit" className="btn-primary flex-1">
                <Plus className="w-4 h-4 inline mr-1" />
                Ajouter
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 text-sm text-rose-500 hover:text-rose-600 font-medium pt-1"
          >
            <Plus className="w-4 h-4" />
            Ajouter une activité
          </button>
        )}
      </div>
    </Section>
  );
}

// ─── Packing List ────────────────────────────────────────────────────────────

const PACKING_CATEGORIES = ['Vêtements', 'Hygiène', 'Documents', 'Électronique', 'Médicaments', 'Autre'];

function PackingSection({ tripId }) {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [category, setCategory] = useState('Autre');

  useEffect(() => {
    const unsub = subscribeToPackingList(tripId, setItems);
    return unsub;
  }, [tripId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    await addPackingItem(tripId, { name: newItem.trim(), category });
    setNewItem('');
  };

  const checkedCount = items.filter((i) => i.checked).length;

  return (
    <Section
      title="Liste de valises"
      icon={Package}
      badge={`${checkedCount}/${items.length}`}
    >
      {/* Progress bar */}
      {items.length > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progression</span>
            <span>{Math.round((checkedCount / items.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-2 bg-gradient-to-r from-rose-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${(checkedCount / items.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Items grouped by category */}
      {PACKING_CATEGORIES.map((cat) => {
        const catItems = items.filter((i) => i.category === cat);
        if (catItems.length === 0) return null;
        return (
          <div key={cat} className="mb-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{cat}</p>
            <div className="space-y-2">
              {catItems.map((item) => (
                <div key={item.id} className="flex items-center gap-2 group">
                  <button
                    onClick={() => togglePackingItem(tripId, item.id, !item.checked)}
                    className="shrink-0"
                  >
                    {item.checked ? (
                      <CheckSquare className="w-5 h-5 text-rose-500" />
                    ) : (
                      <Square className="w-5 h-5 text-gray-300 hover:text-gray-400" />
                    )}
                  </button>
                  <span
                    className={`flex-1 text-sm ${
                      item.checked ? 'line-through text-gray-400' : 'text-gray-700'
                    }`}
                  >
                    {item.name}
                  </span>
                  <button
                    onClick={() => deletePackingItem(tripId, item.id)}
                    className="text-gray-200 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Supprimer cet élément"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Add form */}
      <form onSubmit={handleAdd} className="flex gap-2 mt-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-field w-auto"
        >
          {PACKING_CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <input
          className="input-field flex-1"
          placeholder="Ajouter un article…"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button type="submit" className="btn-primary px-3">
          <Plus className="w-4 h-4" />
        </button>
      </form>
    </Section>
  );
}

// ─── Budget & Expenses ───────────────────────────────────────────────────────

const EXPENSE_CATEGORIES = ['Transport', 'Hébergement', 'Restauration', 'Activités', 'Shopping', 'Autre'];

function BudgetSection({ tripId, totalBudget }) {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ title: '', amount: '', category: 'Autre' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const unsub = subscribeToExpenses(tripId, setExpenses);
    return unsub;
  }, [tripId]);

  const total = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0);
  const hasBudget = typeof totalBudget === 'number' && Number.isFinite(totalBudget);
  const remaining = hasBudget ? totalBudget - total : null;
  const pct = hasBudget && totalBudget !== 0 ? Math.min((total / totalBudget) * 100, 100) : 0;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.amount) return;
    await addExpense(tripId, { ...form, amount: Number(form.amount) });
    setForm({ title: '', amount: '', category: 'Autre' });
    setShowForm(false);
  };

  return (
    <Section title="Budget & Dépenses" icon={PiggyBank} badge={`${total.toLocaleString('fr-FR')} €`}>
      {/* Budget overview */}
      {hasBudget ? (
        <div className="mb-5">
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="text-2xl font-bold text-gray-800">{total.toLocaleString('fr-FR')} €</p>
              <p className="text-xs text-gray-400">dépensés sur {Number(totalBudget).toLocaleString('fr-FR')} €</p>
            </div>
            <div className="text-right">
              <p className={`text-lg font-bold ${remaining < 0 ? 'text-red-500' : 'text-green-600'}`}>
                {remaining < 0 ? '-' : ''}{Math.abs(remaining).toLocaleString('fr-FR')} €
              </p>
              <p className="text-xs text-gray-400">{remaining < 0 ? 'dépassement' : 'restant'}</p>
            </div>
          </div>
          <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                pct > 90 ? 'bg-red-500' : pct > 70 ? 'bg-amber-500' : 'bg-green-500'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-400 mb-4 italic">Aucun budget défini pour ce voyage.</p>
      )}

      {/* Expenses list */}
      <div className="space-y-2 mb-4">
        {expenses.map((exp) => (
          <div key={exp.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 group">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{exp.title}</p>
              <p className="text-xs text-gray-400">{exp.category}</p>
            </div>
            <p className="font-bold text-gray-800 shrink-0">{Number(exp.amount).toLocaleString('fr-FR')} €</p>
            <button
              onClick={() => deleteExpense(tripId, exp.id)}
              className="text-gray-200 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
              aria-label="Supprimer la dépense"
              title="Supprimer la dépense"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {showForm ? (
        <form onSubmit={handleAdd} className="space-y-3">
          <input
            className="input-field"
            placeholder="Description *"
            value={form.title}
            onChange={set('title')}
            required
            autoFocus
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              className="input-field"
              type="number"
              placeholder="Montant (€) *"
              value={form.amount}
              onChange={set('amount')}
              min="0"
              step="0.01"
              required
            />
            <select className="input-field" value={form.category} onChange={set('category')}>
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">
              Annuler
            </button>
            <button type="submit" className="btn-primary flex-1">
              Ajouter
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 text-sm text-rose-500 hover:text-rose-600 font-medium"
        >
          <Plus className="w-4 h-4" />
          Ajouter une dépense
        </button>
      )}
    </Section>
  );
}

// ─── Notes ────────────────────────────────────────────────────────────────────

function NotesSection({ tripId }) {
  const [notes, setNotes] = useState('');
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = subscribeToNotes(tripId, (content) => {
      setNotes(content);
    });
    return unsub;
  }, [tripId]);

  const handleEdit = () => {
    setDraft(notes);
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    await saveNotes(tripId, draft);
    setSaving(false);
    setEditing(false);
  };

  return (
    <Section title="Notes & Idées" icon={FileText}>
      {editing ? (
        <div className="space-y-3">
          <textarea
            className="input-field resize-none"
            rows={6}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Écrivez vos notes, idées, adresses…"
            autoFocus
          />
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} className="btn-secondary flex-1">
              <X className="w-4 h-4 inline mr-1" />
              Annuler
            </button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
              <Save className="w-4 h-4 inline mr-1" />
              {saving ? 'Sauvegarde…' : 'Sauvegarder'}
            </button>
          </div>
        </div>
      ) : (
        <div>
          {notes ? (
            <div className="bg-amber-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap mb-3 border border-amber-100">
              {notes}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic mb-3">Aucune note pour l&apos;instant…</p>
          )}
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 text-sm text-rose-500 hover:text-rose-600 font-medium"
          >
            <Edit className="w-4 h-4" />
            {notes ? 'Modifier les notes' : 'Ajouter une note'}
          </button>
        </div>
      )}
    </Section>
  );
}

// ─── Main TripDetail Page ─────────────────────────────────────────────────────

export default function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    const unsub = subscribeToTrip(id, (t) => {
      setTrip(t);
      setLoading(false);
    });
    return unsub;
  }, [id]);

  const handleEditClose = () => {
    setEditOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 mb-4">Voyage introuvable.</p>
        <button onClick={() => navigate('/trips')} className="btn-primary">
          Retour aux voyages
        </button>
      </div>
    );
  }

  const duration =
    trip.startDate && trip.endDate
      ? differenceInDays(parseISO(trip.endDate), parseISO(trip.startDate)) + 1
      : null;

  return (
    <>
      <div className="space-y-5">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>

        {/* Hero */}
        <div
          className="rounded-3xl p-6 text-white relative overflow-hidden shadow-xl"
          style={{ background: trip.color || 'linear-gradient(135deg, #f43f5e, #a855f7)' }}
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-5xl mb-2">{trip.emoji || '✈️'}</p>
                <h1 className="text-3xl font-bold">{trip.destination}</h1>
                {trip.country && (
                  <p className="text-white/80 flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" />
                    {trip.country}
                  </p>
                )}
              </div>
              <button
                onClick={() => setEditOpen(true)}
                className="bg-white/20 hover:bg-white/30 text-white p-2.5 rounded-xl transition-colors"
              >
                <Edit className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-4 mt-5">
              {trip.startDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-white/70" />
                  <span className="text-sm">
                    {format(parseISO(trip.startDate), 'd MMM yyyy', { locale: fr })}
                    {trip.endDate &&
                      ` → ${format(parseISO(trip.endDate), 'd MMM yyyy', { locale: fr })}`}
                  </span>
                </div>
              )}
              {duration && (
                <div className="text-sm bg-white/20 rounded-xl px-3 py-1">
                  {duration} jour{duration > 1 ? 's' : ''}
                </div>
              )}
              {trip.budget != null && (
                <div className="flex items-center gap-1 text-sm">
                  <Wallet className="w-4 h-4 text-white/70" />
                  Budget : {Number(trip.budget).toLocaleString('fr-FR')} €
                </div>
              )}
            </div>

            {trip.description && (
              <p className="text-white/80 text-sm mt-3 italic">{trip.description}</p>
            )}
          </div>
        </div>

        {/* Sections */}
        <ActivitiesSection tripId={id} />
        <PackingSection tripId={id} />
        <BudgetSection tripId={id} totalBudget={trip.budget} />
        <NotesSection tripId={id} />
      </div>

      <TripModal isOpen={editOpen} onClose={handleEditClose} editTrip={trip} />
    </>
  );
}
