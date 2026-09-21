import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Map, List, Hotel, Plane, MapPin, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchFilters from '../components/search/SearchFilters';
import HotelCard from '../components/search/HotelCard';
import TicketCard from '../components/search/TicketCard';
import GuideCard from '../components/search/GuideCard';
import MapView from '../components/map/MapView';
import BookingModal from '../components/booking/BookingModal';
import { searchAPI } from '../services/api';
import { staggerContainer, fadeUp } from '../motion/tokens';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialType = searchParams.get('type') || 'all';
  const initialQuery = searchParams.get('query') || searchParams.get('destination') || '';

  const [activeType, setActiveType] = useState(initialType);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [priceRange, setPriceRange] = useState(1500);
  const [minRating, setMinRating] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [sortBy, setSortBy] = useState('featured');
  const [showMobileMap, setShowMobileMap] = useState(false);

  // Results & Loading
  const [results, setResults] = useState({ hotels: [], tickets: [], guides: [] });
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState(null);

  // Booking Modal
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingItem, setBookingItem] = useState(null);
  const [bookingType, setBookingType] = useState('hotel');

  // Sync state with URL params
  useEffect(() => {
    const urlType = searchParams.get('type');
    const urlQuery = searchParams.get('query') || searchParams.get('destination');
    if (urlType) setActiveType(urlType);
    if (urlQuery !== null && urlQuery !== undefined) setSearchQuery(urlQuery);
  }, [searchParams]);

  // Fetch search results
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const params = {
          type: activeType,
          query: searchQuery,
          max_price: priceRange,
        };
        if (minRating > 0) params.min_rating = minRating;

        const res = await searchAPI.search(params);
        setResults(res.data.results || { hotels: [], tickets: [], guides: [] });
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchResults();
    }, 200);

    return () => clearTimeout(timer);
  }, [activeType, searchQuery, priceRange, minRating]);

  const handleTypeChange = (newType) => {
    setActiveType(newType);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('type', newType);
    setSearchParams(newParams);
  };

  const handleAmenityToggle = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handleResetFilters = () => {
    setPriceRange(1500);
    setMinRating(0);
    setSelectedAmenities([]);
    setSortBy('featured');
    setSearchQuery('');
  };

  const handleBookNow = (item, type) => {
    setBookingItem(item);
    setBookingType(type);
    setBookingModalOpen(true);
  };

  // Filter & sort results in memory
  let displayHotels = results.hotels || [];
  let displayTickets = results.tickets || [];
  let displayGuides = results.guides || [];

  if (selectedAmenities.length > 0) {
    displayHotels = displayHotels.filter((hotel) =>
      selectedAmenities.every((a) => hotel.amenities?.includes(a))
    );
  }

  // Sort
  const sortItems = (items, priceField = 'starting_price') => {
    if (sortBy === 'price_asc') {
      return [...items].sort((a, b) => (a[priceField] || a.price || a.daily_rate) - (b[priceField] || b.price || b.daily_rate));
    }
    if (sortBy === 'price_desc') {
      return [...items].sort((a, b) => (b[priceField] || b.price || b.daily_rate) - (a[priceField] || a.price || a.daily_rate));
    }
    if (sortBy === 'rating_desc') {
      return [...items].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return items;
  };

  displayHotels = sortItems(displayHotels, 'starting_price');
  displayTickets = sortItems(displayTickets, 'price');
  displayGuides = sortItems(displayGuides, 'daily_rate');

  const totalResultsCount =
    (activeType === 'all' || activeType === 'hotel' ? displayHotels.length : 0) +
    (activeType === 'all' || activeType === 'ticket' ? displayTickets.length : 0) +
    (activeType === 'all' || activeType === 'guide' ? displayGuides.length : 0);

  // Combine items for map
  const mapItems = [
    ...(activeType === 'all' || activeType === 'hotel' ? displayHotels : []),
    ...(activeType === 'all' || activeType === 'ticket' ? displayTickets : []),
    ...(activeType === 'all' || activeType === 'guide' ? displayGuides : []),
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header Bar */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hotels, flights, trains, cities, or tour guides..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 transition-colors"
              />
            </div>

            {/* View Mobile Toggle (List / Map) */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button
                type="button"
                onClick={() => setShowMobileMap(!showMobileMap)}
                className="lg:hidden flex items-center gap-1.5 px-4 py-3 rounded-2xl text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200"
              >
                {showMobileMap ? <List className="w-4 h-4" /> : <Map className="w-4 h-4" />}
                <span>{showMobileMap ? 'Show List' : 'Show Map'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar: Filters */}
          <div className="lg:col-span-3">
            <div className="sticky top-24">
              <SearchFilters
                activeType={activeType}
                onTypeChange={handleTypeChange}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                minRating={minRating}
                onRatingChange={setMinRating}
                selectedAmenities={selectedAmenities}
                onAmenityToggle={handleAmenityToggle}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onReset={handleResetFilters}
              />
            </div>
          </div>

          {/* Middle: Results List */}
          <div className={`lg:col-span-5 space-y-6 ${showMobileMap ? 'hidden lg:block' : 'block'}`}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-slate-900">
                Found {totalResultsCount} results {searchQuery && <span>for "{searchQuery}"</span>}
              </p>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-44 bg-white rounded-2xl p-4 border border-slate-200 animate-pulse flex gap-4">
                    <div className="w-1/3 bg-slate-200 rounded-xl"></div>
                    <div className="flex-1 space-y-3 py-2">
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                      <div className="h-8 bg-slate-100 rounded mt-4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : totalResultsCount === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg">No Results Matching Your Search</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your filters, expanding your price range, or clearing destination queries.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-4"
              >
                {/* Hotels Section */}
                {(activeType === 'all' || activeType === 'hotel') &&
                  displayHotels.map((hotel) => (
                    <motion.div key={`hotel-${hotel.id}`} variants={fadeUp}>
                      <HotelCard hotel={hotel} onBookNow={handleBookNow} />
                    </motion.div>
                  ))}

                {/* Tickets Section */}
                {(activeType === 'all' || activeType === 'ticket') &&
                  displayTickets.map((ticket) => (
                    <motion.div key={`ticket-${ticket.id}`} variants={fadeUp}>
                      <TicketCard ticket={ticket} onBookNow={handleBookNow} />
                    </motion.div>
                  ))}

                {/* Guides Section */}
                {(activeType === 'all' || activeType === 'guide') &&
                  displayGuides.map((guide) => (
                    <motion.div key={`guide-${guide.id}`} variants={fadeUp}>
                      <GuideCard guide={guide} onBookNow={handleBookNow} />
                    </motion.div>
                  ))}
              </motion.div>
            )}
          </div>

          {/* Right: Interactive Sticky Map */}
          <div
            className={`lg:col-span-4 h-[550px] lg:h-[calc(100vh-140px)] sticky top-24 ${
              showMobileMap ? 'block' : 'hidden lg:block'
            }`}
          >
            <MapView
              items={mapItems}
              activeItem={activeItem}
              onItemSelect={(item) => {
                setActiveItem(item);
              }}
            />
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        item={bookingItem}
        bookingType={bookingType}
      />
    </div>
  );
};

export default SearchPage;
