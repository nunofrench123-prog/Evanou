import { useState } from 'react';
import { format, parseISO, differenceInDays, isPast } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit, ChevronRight, Calendar, MapPin, Wallet } from 'lucide-react';
import { deleteTrip } from '../firebase/firestore';

const STATUS_COLORS = {
  upcoming: 'bg-blue-100 text-blue-700',
  ongoing: 'bg-green-100 text-green-700',
  past: 'bg-gray-100 text-gray-500',
};

const STATUS_LABELS = {
  upcoming: '📅 À venir',
  ongoing: '🌍 En cours',
  past: '✅ Terminé',
};

function getTripStatus(trip) {
  const start = trip.startDate ? parseISO(trip.startDate) : null;
  const end = trip.endDate ? parseISO(trip.endDate) : null;
  if (!start) return 'upcoming';
  if (isPast(start) && (!end || !isPast(end))) return 'ongoing';
  if (end && isPast(end)) return 'past';
  return 'upcoming';
}

export default function TripCard({ trip, onEdit }) {
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(false);

  const status = getTripStatus(trip);
  const daysLeft = trip.startDate
    ? differenceInDays(parseISO(trip.startDate), new Date())
    : null;

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    await deleteTrip(trip.id);
  };

  return (
    <div
      className="card hover:shadow-md transition-all duration-200 cursor-pointer group relative overflow-hidden"
      onClick={() => navigate(`/trip/${trip.id}`)}
    >
      {/* Color accent bar */}
      <div
        className="absolute top-0 left-0 h-1 w-full rounded-t-2xl"
        style={{ background: trip.color || 'linear-gradient(90deg, #f43f5e, #a855f7)' }}
      />

      <div className="flex items-start justify-between gap-3 mt-1">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-2xl">{trip.emoji || '✈️'}</span>
            <h3 className="text-lg font-bold text-gray-800 truncate">
              {trip.destination}
            </h3>
          </div>

          {trip.description && (
            <p className="text-gray-500 text-sm mb-2 line-clamp-2">{trip.description}</p>
          )}

          <div className="flex flex-wrap gap-2 items-center text-sm text-gray-500">
            {trip.startDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {format(parseISO(trip.startDate), 'd MMM yyyy', { locale: fr })}
                {trip.endDate &&
                  ` → ${format(parseISO(trip.endDate), 'd MMM yyyy', { locale: fr })}`}
              </span>
            )}
            {trip.country && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {trip.country}
              </span>
            )}
            {trip.budget && (
              <span className="flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5" />
                {Number(trip.budget).toLocaleString('fr-FR')} €
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className={`badge ${STATUS_COLORS[status]}`}>
            {STATUS_LABELS[status]}
          </span>
          {status === 'upcoming' && daysLeft !== null && daysLeft >= 0 && (
            <span className="text-xs text-gray-400 font-medium">
              dans {daysLeft} j.
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(trip); }}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <Edit className="w-4 h-4" />
          Modifier
        </button>
        <button
          onClick={handleDelete}
          className={`flex items-center gap-1.5 text-sm transition-colors ml-auto ${
            confirmDelete
              ? 'text-red-600 font-semibold'
              : 'text-gray-400 hover:text-red-500'
          }`}
        >
          <Trash2 className="w-4 h-4" />
          {confirmDelete ? 'Confirmer ?' : 'Supprimer'}
        </button>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
      </div>
    </div>
  );
}
