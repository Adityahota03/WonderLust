import React, { useState, useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedDestinations from '../components/home/FeaturedDestinations';
import FeaturedHotels from '../components/home/FeaturedHotels';
import FeaturedGuides from '../components/home/FeaturedGuides';
import TrustSection from '../components/home/TrustSection';
import BookingModal from '../components/booking/BookingModal';
import { destinationsAPI, hotelsAPI, guidesAPI } from '../services/api';

const HomePage = () => {
  const [destinations, setDestinations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking Modal State
  const [selectedItem, setSelectedItem] = useState(null);
  const [bookingType, setBookingType] = useState('hotel');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destRes, hotelsRes, guidesRes] = await Promise.all([
          destinationsAPI.getAll(true),
          hotelsAPI.getAll({ featured: true }),
          guidesAPI.getAll({ featured: true }),
        ]);

        setDestinations(destRes.data.destinations || []);
        setHotels(hotelsRes.data.hotels || []);
        setGuides(guidesRes.data.guides || []);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBookNow = (item, type) => {
    setSelectedItem(item);
    setBookingType(type);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen">
      <HeroSection />

      <FeaturedDestinations destinations={destinations} />

      <FeaturedHotels hotels={hotels} onBookNow={handleBookNow} />

      <FeaturedGuides guides={guides} onBookNow={handleBookNow} />

      <TrustSection />

      {/* Booking Modal */}
      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        item={selectedItem}
        bookingType={bookingType}
      />
    </div>
  );
};

export default HomePage;
