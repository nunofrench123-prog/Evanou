import { useEffect, useState } from 'react';
import { differenceInSeconds, differenceInDays, format, isPast, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plane, Heart } from 'lucide-react';

export default function CountdownWidget({ trips }) {
  const now = new Date();

  // Find upcoming trips (start date in the future)
  const upcoming = trips
    .filter((t) => {
      if (!t.startDate) return false;
      return !isPast(parseISO(t.startDate));
    })
    .sort((a, b) => parseISO(a.startDate) - parseISO(b.startDate));

  const next = upcoming[0] || null;

  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!next) return;
    const target = parseISO(next.startDate);
    const update = () => setSeconds(Math.max(0, differenceInSeconds(target, new Date())));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [next]);

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const pad = (n) => String(n).padStart(2, '0');

  if (!next) {
    return (
      <div className="card bg-gradient-to-br from-rose-50 to-purple-50 border-none text-center py-10">
        <Plane className="w-12 h-12 text-rose-300 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">Aucun voyage à venir 🌴</p>
        <p className="text-gray-400 text-sm mt-1">Planifiez votre prochaine aventure !</p>
      </div>
    );
  }

  const daysLeft = differenceInDays(parseISO(next.startDate), now);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 p-6 text-white shadow-xl">
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
      <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-white/10" />

      <div className="relative">
        <div className="flex items-center gap-2 mb-1">
          <Plane className="w-5 h-5" />
          <span className="text-white/80 text-sm font-medium">Prochain voyage</span>
        </div>

        <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
          {next.emoji || '✈️'} {next.destination}
        </h2>

        <p className="text-white/70 text-sm mb-6">
          {format(parseISO(next.startDate), "d MMMM yyyy", { locale: fr })}
          {next.endDate && ` → ${format(parseISO(next.endDate), "d MMMM yyyy", { locale: fr })}`}
        </p>

        {/* Countdown numbers */}
        <div className="flex items-center gap-3 justify-center">
          {[
            { value: pad(days), label: 'Jours' },
            { value: pad(hours), label: 'Heures' },
            { value: pad(minutes), label: 'Min' },
            { value: pad(secs), label: 'Sec' },
          ].map(({ value, label }, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl w-16 h-16 flex items-center justify-center text-3xl font-bold tabular-nums shadow-inner">
                {value}
              </div>
              <span className="text-white/60 text-xs mt-1 font-medium">{label}</span>
            </div>
          ))}
        </div>

        <p className="text-center text-white/80 text-sm mt-4 flex items-center justify-center gap-1">
          Plus que <strong className="text-white">{daysLeft} jour{daysLeft !== 1 ? 's' : ''}</strong> !
          <Heart className="w-4 h-4 fill-white" />
        </p>
      </div>
    </div>
  );
}
