import { useState, useEffect } from 'react';
import { X, Plane } from 'lucide-react';
import { createTrip, updateTrip } from '../firebase/firestore';

const EMOJIS = ['✈️','🏖️','🏔️','🗺️','🌴','🏕️','🌍','🗼','🗽','🏰','🌋','🏄','🎭','🍜','🎪','⛷️'];
const COLORS = [
  'linear-gradient(90deg, #f43f5e, #a855f7)',
  'linear-gradient(90deg, #3b82f6, #06b6d4)',
  'linear-gradient(90deg, #f59e0b, #ef4444)',
  'linear-gradient(90deg, #10b981, #3b82f6)',
  'linear-gradient(90deg, #8b5cf6, #ec4899)',
  'linear-gradient(90deg, #f97316, #facc15)',
];

const SOLID_COLORS = ['#f43f5e','#3b82f6','#f59e0b','#10b981','#8b5cf6','#f97316'];

export default function TripModal({ isOpen, onClose, editTrip }) {
  const isEdit = !!editTrip;
  const [form, setForm] = useState({
    destination: '',
    country: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    emoji: '✈️',
    color: COLORS[0],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editTrip) {
      setForm({
        destination: editTrip.destination || '',
        country: editTrip.country || '',
        description: editTrip.description || '',
        startDate: editTrip.startDate || '',
        endDate: editTrip.endDate || '',
        budget: editTrip.budget || '',
        emoji: editTrip.emoji || '✈️',
        color: editTrip.color || COLORS[0],
      });
    } else {
      setForm({
        destination: '',
        country: '',
        description: '',
        startDate: '',
        endDate: '',
        budget: '',
        emoji: '✈️',
        color: COLORS[0],
      });
    }
  }, [editTrip, isOpen]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { ...form, budget: form.budget ? Number(form.budget) : null };
      if (isEdit) {
        await updateTrip(editTrip.id, data);
      } else {
        await createTrip(data);
      }
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white rounded-t-3xl border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Plane className="w-5 h-5 text-rose-500" />
            {isEdit ? 'Modifier le voyage' : 'Nouveau voyage'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Emoji picker */}
          <div>
            <label className="label">Emoji</label>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, emoji: em }))}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center border-2 transition-all ${
                    form.emoji === em
                      ? 'border-rose-400 bg-rose-50 scale-110'
                      : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="label">Couleur</label>
            <div className="flex gap-2">
              {COLORS.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, color: c }))}
                  className={`w-8 h-8 rounded-full border-4 transition-all ${
                    form.color === c ? 'border-gray-400 scale-110' : 'border-transparent'
                  }`}
                  style={{ background: c }}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Destination *</label>
              <input
                className="input-field"
                placeholder="Paris, Tokyo, New York…"
                value={form.destination}
                onChange={set('destination')}
                required
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="label">Pays</label>
              <input
                className="input-field"
                placeholder="France"
                value={form.country}
                onChange={set('country')}
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="label">Budget (€)</label>
              <input
                className="input-field"
                type="number"
                placeholder="1500"
                value={form.budget}
                onChange={set('budget')}
                min="0"
              />
            </div>

            <div>
              <label className="label">Date de départ</label>
              <input
                className="input-field"
                type="date"
                value={form.startDate}
                onChange={set('startDate')}
              />
            </div>

            <div>
              <label className="label">Date de retour</label>
              <input
                className="input-field"
                type="date"
                value={form.endDate}
                onChange={set('endDate')}
                min={form.startDate}
              />
            </div>

            <div className="col-span-2">
              <label className="label">Description</label>
              <textarea
                className="input-field resize-none"
                rows={3}
                placeholder="Notes sur ce voyage…"
                value={form.description}
                onChange={set('description')}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Annuler
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 disabled:opacity-60">
              {loading ? 'Sauvegarde…' : isEdit ? 'Mettre à jour' : 'Créer le voyage'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
