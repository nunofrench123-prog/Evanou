import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { subscribeToTrips } from '../firebase/firestore';
import CountdownWidget from '../components/CountdownWidget';
import TripCard from '../components/TripCard';
import TripModal from '../components/TripModal';
import { Plus, MapPin, CheckCircle, Wallet, Plane } from 'lucide-react';
import { isPast, parseISO } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTrip, setEditTrip] = useState(null);

  useEffect(() => {
    const unsub = subscribeToTrips(setTrips);
    return unsub;
  }, []);

  const upcoming = trips.filter((t) => t.startDate && !isPast(parseISO(t.startDate)));
  const past = trips.filter((t) => t.endDate && isPast(parseISO(t.endDate)));
  const totalBudget = trips.reduce((s, t) => s + (Number(t.budget) || 0), 0);

  const handleEdit = (trip) => {
    setEditTrip(trip);
    setModalOpen(true);
  };

  const openNew = () => {
    setEditTrip(null);
    setModalOpen(true);
  };

  const name = user?.displayName?.split(' ')[0] || 'toi';

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Bonjour, {name} 👋
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Vos prochaines aventures vous attendent
            </p>
          </div>
          <button onClick={openNew} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouveau voyage</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total voyages', value: trips.length, icon: Plane, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'À venir', value: upcoming.length, icon: MapPin, color: 'text-rose-500', bg: 'bg-rose-50' },
            { label: 'Effectués', value: past.length, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
            { label: 'Budget total', value: `${totalBudget.toLocaleString('fr-FR')} €`, icon: Wallet, color: 'text-amber-500', bg: 'bg-amber-50' },
          ].map(({ label, value, icon, color, bg }) => {
            const StatIcon = icon;
            return (
              <div key={label} className="card flex items-center gap-3 p-4">
                <div className={`${bg} p-2.5 rounded-xl shrink-0`}>
                  <StatIcon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-800">{value}</p>
                  <p className="text-xs text-gray-400">{label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Countdown */}
        <CountdownWidget trips={trips} />

        {/* Upcoming trips */}
        {upcoming.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-500" />
              Voyages à venir
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {upcoming.slice(0, 4).map((trip) => (
                <TripCard key={trip.id} trip={trip} onEdit={handleEdit} />
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {trips.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-rose-50 mb-4">
              <Plane className="w-10 h-10 text-rose-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Aucun voyage pour l&apos;instant</h3>
            <p className="text-gray-400 mb-6 max-w-sm mx-auto">
              Commencez par créer votre premier voyage pour organiser votre prochaine aventure !
            </p>
            <button onClick={openNew} className="btn-primary inline-flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Créer mon premier voyage
            </button>
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
