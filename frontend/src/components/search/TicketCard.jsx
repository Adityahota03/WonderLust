import React from 'react';
import { Plane, Train, Bus, Clock, ShieldCheck, ArrowRight } from 'lucide-react';

const TicketCard = ({ ticket, onBookNow }) => {
  const getIcon = () => {
    if (ticket.transport_type === 'flight') return <Plane className="w-5 h-5 text-brand-600" />;
    if (ticket.transport_type === 'train') return <Train className="w-5 h-5 text-emerald-600" />;
    return <Bus className="w-5 h-5 text-amber-600" />;
  };

  const getBadgeColor = () => {
    if (ticket.transport_type === 'flight') return 'bg-brand-50 text-brand-700 border-brand-200';
    if (ticket.transport_type === 'train') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Carrier Info & Route */}
        <div className="flex-1">
          {/* Header row */}
          <div className="flex items-center gap-2.5 mb-3">
            <div className="p-2 rounded-xl bg-slate-100 flex items-center justify-center">
              {getIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{ticket.carrier}</span>
                <span className="text-xs text-slate-400 font-mono">{ticket.carrier_code}</span>
              </div>
              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${getBadgeColor()}`}>
                {ticket.class_type} • {ticket.transport_type}
              </span>
            </div>
          </div>

          {/* Times & Path Graphic */}
          <div className="grid grid-cols-3 items-center gap-2 max-w-md my-2">
            <div>
              <p className="text-xl font-extrabold text-slate-900">{ticket.departure_time}</p>
              <p className="text-xs font-semibold text-slate-600 truncate">{ticket.origin_city}</p>
              <p className="text-[10px] text-slate-400 truncate">{ticket.origin}</p>
            </div>

            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" /> {ticket.duration}
              </span>
              <div className="w-full flex items-center gap-1 my-1">
                <div className="w-2 h-2 rounded-full border-2 border-brand-500 bg-white"></div>
                <div className="flex-1 h-[2px] bg-slate-200 relative">
                  {ticket.stops > 0 && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                  )}
                </div>
                <div className="w-2 h-2 rounded-full bg-brand-500"></div>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">
                {ticket.stops === 0 ? 'Non-stop Direct' : `${ticket.stops} stop`}
              </span>
            </div>

            <div className="text-right">
              <p className="text-xl font-extrabold text-slate-900">{ticket.arrival_time}</p>
              <p className="text-xs font-semibold text-slate-600 truncate">{ticket.destination_city}</p>
              <p className="text-[10px] text-slate-400 truncate">{ticket.destination}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
            <span className="flex items-center gap-1 text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> {ticket.baggage_allowance}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-amber-600 font-medium">
              {ticket.seats_available} seats remaining
            </span>
          </div>
        </div>

        {/* Right: Price & Book button */}
        <div className="flex sm:flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-6 shrink-0 gap-3">
          <div className="text-left md:text-right">
            <span className="text-[11px] text-slate-400 block">Total per passenger</span>
            <div className="flex items-baseline gap-1 md:justify-end">
              <span className="text-2xl font-black text-slate-900 font-display">
                ${ticket.price}
              </span>
            </div>
            <span className="text-[10px] text-emerald-600 font-medium block">All taxes included</span>
          </div>

          <button
            onClick={() => onBookNow && onBookNow(ticket, 'ticket')}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-500/20 transition-all flex items-center gap-1.5"
          >
            Select Ticket <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
