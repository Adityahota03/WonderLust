import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  X, CheckCircle, CreditCard, Calendar, Users, ShieldCheck, 
  Sparkles, ArrowRight, ArrowLeft, Download, ExternalLink, Plane, Hotel, MapPin 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { bookingsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { slideHorizontal, DURATION, EASE } from '../../motion/tokens';

const BookingModal = ({ isOpen, onClose, item, bookingType = 'hotel', selectedRoom = null }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [error, setError] = useState(null);

  // Form State
  const [checkIn, setCheckIn] = useState('2026-10-15');
  const [checkOut, setCheckOut] = useState('2026-10-18');
  const [guests, setGuests] = useState(2);
  const [guestName, setGuestName] = useState(user?.name || 'Alex Mercer');
  const [guestEmail, setGuestEmail] = useState(user?.email || 'traveler@traveldemo.com');
  const [guestPhone, setGuestPhone] = useState(user?.phone || '+1 (555) 234-5678');
  const [specialRequests, setSpecialRequests] = useState('');

  // Payment Form State
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  if (!isOpen || !item) return null;

  // Pricing calculations
  const calculatePricing = () => {
    if (bookingType === 'hotel') {
      const roomPrice = selectedRoom ? selectedRoom.price_per_night : item.starting_price;
      const nights = 3;
      const subtotal = roomPrice * nights;
      const taxes = Math.round(subtotal * 0.12);
      const serviceFee = 45;
      const total = subtotal + taxes + serviceFee;
      return { roomPrice, nights, subtotal, taxes, serviceFee, total };
    } else if (bookingType === 'ticket') {
      const perTicket = item.price;
      const passengers = guests;
      const subtotal = perTicket * passengers;
      const taxes = Math.round(subtotal * 0.08);
      const total = subtotal + taxes;
      return { perTicket, passengers, subtotal, taxes, serviceFee: 0, total };
    } else {
      // Guide
      const days = 1;
      const subtotal = item.daily_rate * days;
      const serviceFee = 20;
      const total = subtotal + serviceFee;
      return { dailyRate: item.daily_rate, days, subtotal, taxes: 0, serviceFee, total };
    }
  };

  const pricing = calculatePricing();

  const handleNext = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setDirection(1);
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setDirection(-1);
    setStep((prev) => prev - 1);
  };

  const handleConfirmPayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const bookingPayload = {
        booking_type: bookingType,
        item_id: item.id,
        title: bookingType === 'hotel' 
          ? `${item.name} — ${selectedRoom?.name || 'Standard Luxury Room'}`
          : bookingType === 'ticket' 
          ? `${item.carrier} ${item.carrier_code} (${item.origin_city} -> ${item.destination_city})`
          : `${item.name} — Certified Local Guide Tour`,
        image_url: item.image_url || item.photo_url,
        destination_name: item.destination_name || item.destination_city || item.address,
        details: {
          item_name: item.name || item.carrier,
          booking_type: bookingType,
          guests: guests,
          nights: pricing.nights || 1,
          dates: `${checkIn} to ${checkOut}`,
          room_name: selectedRoom?.name || null,
          pricing_breakdown: pricing
        },
        total_amount: pricing.total,
        start_date: checkIn,
        end_date: checkOut,
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
        special_requests: specialRequests,
        payment_method: 'Mastercard ending in 4242',
        card_last4: '4242'
      };

      const res = await bookingsAPI.create(bookingPayload);
      setConfirmedBooking(res.data.booking);

      // Trigger victory confetti!
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      setDirection(1);
      setStep(4);
    } catch (err) {
      console.error('Booking failed:', err);
      setError(err.response?.data?.error || 'Booking payment could not be processed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="p-5 sm:px-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600">
              {bookingType === 'hotel' ? <Hotel className="w-5 h-5" /> : bookingType === 'ticket' ? <Plane className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg font-display">
                {step === 4 ? 'Booking Confirmed!' : `Reserve ${bookingType === 'hotel' ? 'Hotel Stay' : bookingType === 'ticket' ? 'Transport' : 'Local Guide'}`}
              </h3>
              <p className="text-xs text-slate-500 truncate max-w-sm">
                {item.name || `${item.carrier} ${item.carrier_code}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicator (Steps 1 to 3) */}
        {step < 4 && (
          <div className="px-8 pt-4 pb-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
              <span className={step >= 1 ? 'text-brand-600 font-bold' : ''}>1. Trip Details</span>
              <span className={step >= 2 ? 'text-brand-600 font-bold' : ''}>2. Traveler Info</span>
              <span className={step >= 3 ? 'text-brand-600 font-bold' : ''}>3. Payment</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-600 transition-all duration-300 rounded-full"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Dynamic Multi-Step Body */}
        <div className="p-6 sm:px-8">
          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          <AnimatePresence mode="wait" custom={direction}>
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={slideHorizontal}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-5"
              >
                {/* Item Summary Snapshot */}
                <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <img
                    src={item.image_url || item.photo_url}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-slate-900 truncate">
                      {item.name || `${item.carrier} ${item.carrier_code}`}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">
                      {selectedRoom ? selectedRoom.name : item.tagline || item.origin_city + ' -> ' + item.destination_city}
                    </p>
                    <span className="text-xs font-extrabold text-brand-600 mt-1 block">
                      ${pricing.subtotal} subtotal
                    </span>
                  </div>
                </div>

                {/* Dates & Guests Inputs */}
                {bookingType === 'hotel' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Check-in Date</label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Check-out Date</label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {bookingType === 'ticket' ? 'Number of Passengers' : 'Number of Guests'}
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'Person' : 'People'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Breakdown Snapshot */}
                <div className="p-4 rounded-2xl bg-brand-50/50 border border-brand-100 text-xs space-y-2">
                  <div className="flex justify-between text-slate-600">
                    <span>Base rate</span>
                    <span className="font-semibold">${pricing.subtotal}</span>
                  </div>
                  {pricing.taxes > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>Taxes & Tourism Dues</span>
                      <span className="font-semibold">${pricing.taxes}</span>
                    </div>
                  )}
                  {pricing.serviceFee > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>Booking Service & Concierge</span>
                      <span className="font-semibold">${pricing.serviceFee}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-brand-200">
                    <span>Total Amount</span>
                    <span className="text-brand-600 text-base">${pricing.total}</span>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm flex items-center gap-1.5"
                  >
                    Continue to Traveler Info <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={slideHorizontal}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-4"
              >
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Lead Guest Full Name</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    required
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                    placeholder="e.g. Alex Mercer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Confirmation Email</label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      required
                      className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                      placeholder="alex@example.com"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Contact Phone</label>
                    <input
                      type="tel"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Special Requests or Notes (Optional)</label>
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    rows={2}
                    className="w-full text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 resize-none"
                    placeholder="E.g. Early check-in, dietary restrictions, quiet high floor..."
                  />
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm flex items-center gap-1.5"
                  >
                    Proceed to Payment (${pricing.total}) <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={slideHorizontal}
                initial="enter"
                animate="center"
                exit="exit"
                className="space-y-4"
              >
                {/* Security Trust Callout */}
                <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200/80 rounded-2xl text-emerald-800 text-xs">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>256-bit encrypted checkout. No actual credit card charge will be made (Simulated Sandbox).</span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5 pl-10 text-slate-800"
                    />
                    <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Expires (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      className="w-full text-xs font-mono font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">CVC Code</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full text-xs font-mono font-medium bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800"
                    />
                  </div>
                </div>

                {/* Final Review Row */}
                <div className="p-3.5 bg-slate-100 rounded-2xl flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>Total Due Today:</span>
                  <span className="text-lg font-black text-brand-600 font-display">${pricing.total} USD</span>
                </div>

                <div className="flex justify-between items-center pt-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={loading}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmPayment}
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Authorizing...
                      </>
                    ) : (
                      <>
                        Pay & Confirm Booking (${pricing.total})
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && confirmedBooking && (
              <motion.div
                key="step4"
                variants={slideHorizontal}
                initial="enter"
                animate="center"
                className="text-center py-4 space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle className="w-9 h-9" />
                </div>

                <div>
                  <h4 className="text-xl font-bold text-slate-900 font-display">
                    Pack Your Bags, You're Going!
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Confirmation voucher and receipt have been dispatched to <span className="font-semibold text-slate-700">{confirmedBooking.guest_email}</span>
                  </p>
                </div>

                {/* Voucher Ticket Box */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-md mx-auto space-y-2">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Booking Reference</span>
                    <span className="text-xs font-mono font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                      {confirmedBooking.reference_code}
                    </span>
                  </div>

                  <div className="text-xs">
                    <p className="font-bold text-slate-900">{confirmedBooking.title}</p>
                    <p className="text-slate-500">{confirmedBooking.destination_name}</p>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-xs">
                    <span className="text-slate-500">Status</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 uppercase">
                      {confirmedBooking.status}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
                  <Link
                    to="/bookings"
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm flex items-center justify-center gap-1.5"
                  >
                    View in My Bookings <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors"
                  >
                    Close Window
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
