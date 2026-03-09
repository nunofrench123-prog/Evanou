import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { subscribeToTrips } from '../firebase/firestore';
import TripCard from '../components/TripCard';
import TripModal from '../components/TripModal';
import { Plus, Search, SlidersHorizontal, Plane } from 'lucide-react';
import { isPast, parseISO } from 'date-fns';

const FILTERS = [
  { id: 'all', label: 'Tous' },
  { id: 'upcoming', label: '📅 À venir' },
  { id: 'ongoing', label: '🌍 En cours' },
  { id: 'past', label: '✅ Terminés' },
];

function getTripStatus(trip) {
  const start = trip.startDate ? parseISO(trip.startDate) : null;
  const end = trip.endDate ? parseISO(trip.endDate) : null;
  if (!start) return 'upcoming';
  if (isPast(start) && (!end || !isPast(end))) return 'ongoing';
  if (end && isPast(end)) return 'past';
  return 'upcoming';
}

export default function TripsPage() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTrip, setEditTrip] = useState(null);

  useEffect(() => {
    if (!user?.uid) return;
    const unsub = subscribeToTrips(user.uid, setTrips);
    return unsub;
  }, [user?.uid]);

  const filtered = trips.filter((t) => {
    const matchFilter = filter === 'all' || getTripStatus(t) === filter;
    const matchSearch =
      !search ||
      t.destination?.toLowerCase().includes(search.toLowerCase()) ||
      t.country?.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleEdit = (trip) => {
    setEditTrip(trip);
    setModalOpen(true);
  };

  const openNew = () => {
    setEditTrip(null);
    setModalOpen(true);
  };

  return (
    <>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Plane className="w-6 h-6 text-rose-500" />
            Nos voyages
          </h1>
          <button onClick={openNew} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouveau voyage</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            className="input-field pl-10"
            placeholder="Rechercher un voyage…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === id
                  ? 'bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Trip list */}
        {filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((trip) => (
              <TripCard key={trip.id} trip={trip} onEdit={handleEdit} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <SlidersHorizontal className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium">Aucun voyage trouvé</p>
            {trips.length === 0 && (
              <button onClick={openNew} className="btn-primary mt-4 inline-flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Créer un voyage
              </button>
            )}
          </div>
        )}
      </div>

      <TripModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editTrip={editTrip}
      />
    </>
  );
}
