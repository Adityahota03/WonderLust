import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Star, Sparkles, Wifi, ShieldCheck, Check, 
  ArrowLeft, Calendar, Users, MessageSquare, Send, Heart 
} from 'lucide-react';
import RatingStars from '../components/common/RatingStars';
import MapView from '../components/map/MapView';
import BookingModal from '../components/booking/BookingModal';
import { hotelsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const HotelDetailsPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);

  // Booking Modal
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Review Form
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await hotelsAPI.getById(id);
        setHotel(res.data.hotel);
      } catch (err) {
        console.error('Error fetching hotel details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id]);

  const handleBookRoom = (room) => {
    setSelectedRoom(room);
    setBookingModalOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setReviewSubmitting(true);
    try {
      const res = await hotelsAPI.addReview(id, {
        rating: reviewRating,
        comment: reviewComment,
      });

      // Update reviews locally
      setHotel((prev) => ({
        ...prev,
        rating: ((prev.rating * prev.review_count + reviewRating) / (prev.review_count + 1)).toFixed(1),
        review_count: prev.review_count + 1,
        reviews: [res.data.review, ...(prev.reviews || [])],
      }));

      setReviewComment('');
      setReviewSuccess(true);
      setTimeout(() => setReviewSuccess(false), 4000);
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-slate-800">Hotel Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The accommodation you requested could not be located.</p>
        <Link to="/search" className="mt-4 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold">
          Back to Stays
        </Link>
      </div>
    );
  }

  const gallery = hotel.gallery || [hotel.image_url];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/search?type=hotel"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Search Results
        </Link>

        {/* Hotel Title & Address */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-200">
                {hotel.stars} Star Luxury
              </span>
              <span className="text-xs text-slate-400">•</span>
              <RatingStars rating={hotel.rating} count={hotel.review_count} />
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display tracking-tight">
              {hotel.name}
            </h1>

            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 mt-1.5">
              <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
              <span>{hotel.address}</span>
            </div>
          </div>

          <div className="flex items-baseline gap-2 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm shrink-0">
            <div>
              <span className="text-xs text-slate-400 block">From</span>
              <span className="text-3xl font-black text-slate-900 font-display">${hotel.starting_price}</span>
              <span className="text-xs text-slate-500"> / night</span>
            </div>
          </div>
        </div>

        {/* Photo Gallery Mosaic */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
          {/* Main Showcase Photo */}
          <div className="lg:col-span-2 h-[380px] sm:h-[450px] rounded-3xl overflow-hidden bg-slate-200 relative">
            <img
              src={gallery[activePhoto] || hotel.image_url}
              alt={hotel.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
          </div>

          {/* Thumbnail Stack */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 h-full">
            {gallery.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActivePhoto(idx)}
                className={`h-40 sm:h-52 rounded-2xl overflow-hidden relative border-2 transition-all ${
                  activePhoto === idx ? 'border-brand-600 ring-2 ring-brand-500/20' : 'border-transparent opacity-80 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`${hotel.name} ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Content Tabs / Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols: Description, Amenities, Rooms, Reviews */}
          <div className="lg:col-span-2 space-y-10">
            {/* Description */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 font-display mb-3">About This Stay</h3>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {hotel.description}
              </p>

              <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-2 text-xs text-emerald-700 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{hotel.cancellation_policy}</span>
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 font-display mb-4">Property Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {hotel.amenities?.map((amenity, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="truncate">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Room Types */}
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-slate-900 font-display">Available Rooms & Suites</h3>
              <div className="space-y-4">
                {hotel.rooms?.map((room) => (
                  <div
                    key={room.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-6"
                  >
                    <img
                      src={room.image_url || hotel.image_url}
                      alt={room.name}
                      className="sm:w-48 h-40 rounded-2xl object-cover shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-lg font-bold text-slate-900 font-display">{room.name}</h4>
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700">
                            {room.room_type}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-slate-500 my-2">
                          <span>{room.bed_type}</span>
                          <span>•</span>
                          <span>{room.size_sqm} m²</span>
                          <span>•</span>
                          <span>Up to {room.capacity} guests</span>
                        </div>

                        <p className="text-xs text-slate-600 mb-3">{room.description}</p>

                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {room.perks?.map((perk, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-medium">
                              {perk}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-black text-slate-900 font-display">${room.price_per_night}</span>
                          <span className="text-xs text-slate-500"> / night</span>
                        </div>
                        <button
                          onClick={() => handleBookRoom(room)}
                          className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-sm"
                        >
                          Reserve Room
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Guest Reviews & Submission */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-display">Guest Reviews</h3>
                  <p className="text-xs text-slate-500">Authentic reviews from verified travelers</p>
                </div>
                <RatingStars rating={hotel.rating} count={hotel.review_count} size={20} />
              </div>

              {/* Add a Review Form */}
              {isAuthenticated ? (
                <form onSubmit={handleReviewSubmit} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Write a Review</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600">Your Rating:</span>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="text-xs font-bold p-1 rounded-lg border border-slate-300"
                    >
                      <option value="5">5 Stars - Exceptional</option>
                      <option value="4">4 Stars - Very Good</option>
                      <option value="3">3 Stars - Average</option>
                    </select>
                  </div>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                    rows={3}
                    placeholder="Share your experience staying here..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 resize-none bg-white"
                  />
                  <div className="flex justify-between items-center">
                    {reviewSuccess && <span className="text-xs text-emerald-600 font-medium">Review submitted successfully!</span>}
                    <button
                      type="submit"
                      disabled={reviewSubmitting}
                      className="ml-auto px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
                    >
                      <Send className="w-3 h-3" /> Submit Review
                    </button>
                  </div>
                </form>
              ) : (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 text-center">
                  <Link to="/login" className="font-bold text-brand-600 hover:underline">Sign in</Link> to leave a verified review.
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {hotel.reviews?.length > 0 ? (
                  hotel.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-slate-50/60 border border-slate-100 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={rev.user_avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${rev.user_name}`}
                            alt={rev.user_name}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200"
                          />
                          <span className="text-xs font-bold text-slate-800">{rev.user_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <RatingStars rating={rev.rating} showScore={false} size={14} />
                          <span className="text-[11px] text-slate-400">{rev.created_at}</span>
                        </div>
                      </div>
                      {rev.title && <p className="text-xs font-bold text-slate-800">{rev.title}</p>}
                      <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Map Pin & Quick Reserve */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm sticky top-24 space-y-4">
              <h4 className="font-bold text-slate-900 text-base font-display">Location on Map</h4>
              <div className="h-64 rounded-2xl overflow-hidden border border-slate-200">
                <MapView items={[hotel]} defaultCenter={[hotel.lat, hotel.lng]} defaultZoom={14} />
              </div>
              <p className="text-xs text-slate-500">
                {hotel.address}. Central to popular landmarks, transit stations, and fine dining.
              </p>

              <button
                onClick={() => handleBookRoom(hotel.rooms?.[0] || null)}
                className="w-full py-3 rounded-2xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white shadow-md shadow-brand-500/25 transition-all"
              >
                Instant Reserve (${hotel.starting_price}/night)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        item={hotel}
        bookingType="hotel"
        selectedRoom={selectedRoom}
      />
    </div>
  );
};

export default HotelDetailsPage;
