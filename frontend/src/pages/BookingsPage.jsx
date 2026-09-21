import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, CheckCircle, Clock, AlertCircle, 
  XCircle, Receipt, ExternalLink, Hotel, Plane, MapPin, Compass 
} from 'lucide-react';
import { bookingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const BookingsPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('all'); // 'all', 'confirmed', 'cancelled'
  const [cancellingId, setCancellingId] = useState(null);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await bookingsAPI.getAll();
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error('Error fetching user bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? A refund will be credited.')) {
      return;
    }

    setCancellingId(bookingId);
    try {
      await bookingsAPI.cancel(bookingId);
      await fetchBookings();
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert('Failed to cancel booking. Please contact concierge support.');
    } finally {
      setCancellingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (filterTab === 'all') return true;
    return b.status === filterTab;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 font-display">My Trips & Bookings</h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your confirmed hotel reservations, travel tickets, and private guide tours.
            </p>
          </div>

          <Link
            to="/search"
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors w-fit flex items-center gap-1.5"
          >
            <Compass className="w-4 h-4" /> Book a New Trip
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-4 mb-6 text-xs font-semibold">
          {[
            { id: 'all', label: `All Bookings (${bookings.length})` },
            { id: 'confirmed', label: `Active & Confirmed (${bookings.filter(b => b.status === 'confirmed').length})` },
            { id: 'cancelled', label: `Cancelled (${bookings.filter(b => b.status === 'cancelled').length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-full transition-all ${
                filterTab === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-40 bg-white rounded-3xl p-6 border border-slate-200 animate-pulse"></div>
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
              <Calendar className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">No Bookings in This Section</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                You do not have any trips matching this filter. Explore our curated destinations to plan your next journey!
              </p>
            </div>
            <Link
              to="/search"
              className="inline-block px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold"
            >
              Explore Stays & Flights
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 justify-between items-start md:items-center"
              >
                <div className="flex items-start gap-4 flex-1">
                  {/* Thumbnail / Type Badge */}
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 relative overflow-hidden shrink-0 border border-slate-200">
                    {b.image_url ? (
                      <img src={b.image_url} alt={b.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        {b.booking_type === 'hotel' ? <Hotel className="w-6 h-6" /> : <Plane className="w-6 h-6" />}
                      </div>
                    )}
                  </div>

                  {/* Information */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                        {b.reference_code}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          b.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 font-display">{b.title}</h3>
                    <p className="text-xs text-slate-500">
                      Destination: <span className="font-semibold text-slate-700">{b.destination_name || 'Global'}</span>
                      {b.start_date && (
                        <span> • Travel Dates: {b.start_date} {b.end_date ? `to ${b.end_date}` : ''}</span>
                      )}
                    </p>
                    <p className="text-xs text-slate-400">
                      Guest: {b.guest_name} ({b.guest_email})
                    </p>
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="flex sm:flex-row md:flex-col items-end justify-between w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100 gap-3">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-slate-400 block uppercase">Total Paid</span>
                    <span className="text-xl font-black text-slate-900 font-display">${b.total_amount} {b.currency}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedReceipt(b)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1"
                    >
                      <Receipt className="w-3.5 h-3.5" /> Voucher
                    </button>

                    {b.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancelBooking(b.id)}
                        disabled={cancellingId === b.id}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors border border-rose-200"
                      >
                        {cancellingId === b.id ? 'Processing...' : 'Cancel'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Voucher Receipt Modal */}
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-100 shadow-2xl space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase text-slate-400">Travel Confirmation Voucher</span>
                <button onClick={() => setSelectedReceipt(null)} className="text-slate-400 hover:text-slate-700">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center py-2 space-y-1">
                <p className="text-xs text-slate-400">Booking Reference Code</p>
                <p className="text-2xl font-black text-brand-600 font-mono tracking-wider">
                  {selectedReceipt.reference_code}
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Itinerary</span>
                  <span className="font-bold text-slate-900">{selectedReceipt.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Lead Passenger</span>
                  <span className="font-semibold text-slate-800">{selectedReceipt.guest_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status</span>
                  <span className="font-bold text-emerald-600 uppercase">{selectedReceipt.status}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-slate-900">
                  <span>Amount Paid</span>
                  <span>${selectedReceipt.total_amount} {selectedReceipt.currency}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  window.print();
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
              >
                Print / Save PDF Voucher
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
