import json
from app import create_app
from app.extensions import db
from app.models.user import User
from app.models.destination import Destination
from app.models.hotel import Hotel, Room
from app.models.ticket import Ticket
from app.models.guide import Guide
from app.models.review import Review
from app.models.booking import Booking
from app.models.payment import Payment
from app.utils.auth_helpers import hash_password

app = create_app()

def seed_database():
    with app.app_context():
        print("Clearing existing tables...")
        db.drop_all()
        db.create_all()

        print("Seeding Users...")
        demo_traveler = User(
            name="Alex Mercer",
            email="traveler@traveldemo.com",
            password_hash=hash_password("Demo123!"),
            role="user",
            phone="+1 (555) 234-5678",
            avatar_url="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
        )
        demo_guide = User(
            name="Elena Rostova",
            email="guide@traveldemo.com",
            password_hash=hash_password("Demo123!"),
            role="guide_partner",
            phone="+33 6 12 34 56 78",
            avatar_url="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
        )
        demo_admin = User(
            name="Sarah Jenkins",
            email="admin@traveldemo.com",
            password_hash=hash_password("Demo123!"),
            role="admin",
            phone="+1 (555) 999-0000",
            avatar_url="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80"
        )
        db.session.add_all([demo_traveler, demo_guide, demo_admin])
        db.session.commit()

        print("Seeding Destinations...")
        dest_data = [
            {
                "name": "Paris",
                "country": "France",
                "region": "Europe",
                "description": "The City of Light dazzles with iconic architecture, haute cuisine, world-class art collections, and romantic Seine riverbanks.",
                "image_url": "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
                "banner_url": "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1920&q=80",
                "lat": 48.8566,
                "lng": 2.3522,
                "is_popular": True,
                "rating": 4.9,
                "visitor_count": "19.1M visitors"
            },
            {
                "name": "Tokyo",
                "country": "Japan",
                "region": "Asia",
                "description": "An ultra-modern metropolis seamlessly blending neon-lit skyscrapers with ancient Shinto shrines and legendary culinary traditions.",
                "image_url": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
                "banner_url": "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1920&q=80",
                "lat": 35.6762,
                "lng": 139.6503,
                "is_popular": True,
                "rating": 4.9,
                "visitor_count": "15.4M visitors"
            },
            {
                "name": "Bali",
                "country": "Indonesia",
                "region": "Southeast Asia",
                "description": "An island sanctuary of lush emerald rice terraces, sacred ocean temples, tranquil surf beaches, and holistic spiritual retreats.",
                "image_url": "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80",
                "banner_url": "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1920&q=80",
                "lat": -8.4095,
                "lng": 115.1889,
                "is_popular": True,
                "rating": 4.8,
                "visitor_count": "6.3M visitors"
            },
            {
                "name": "Rome",
                "country": "Italy",
                "region": "Europe",
                "description": "An open-air living museum where 3,000 years of globally influential art, architecture, and Italian passion collide.",
                "image_url": "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80",
                "banner_url": "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=1920&q=80",
                "lat": 41.9028,
                "lng": 12.4964,
                "is_popular": True,
                "rating": 4.8,
                "visitor_count": "10.2M visitors"
            },
            {
                "name": "Swiss Alps (Zermatt)",
                "country": "Switzerland",
                "region": "Europe",
                "description": "Home of the majestic Matterhorn peak, pristine glacier pistes, panoramic alpine railway journeys, and luxury mountain chalets.",
                "image_url": "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80",
                "banner_url": "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80",
                "lat": 45.9763,
                "lng": 7.7491,
                "is_popular": True,
                "rating": 4.9,
                "visitor_count": "4.1M visitors"
            },
            {
                "name": "Santorini",
                "country": "Greece",
                "region": "Europe",
                "description": "Dramatic volcanic cliffs crowned by whitewashed cubiform villages, cobalt Aegean seas, and world-renowned golden hour sunsets.",
                "image_url": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1200&q=80",
                "banner_url": "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1920&q=80",
                "lat": 36.3932,
                "lng": 25.4615,
                "is_popular": True,
                "rating": 4.9,
                "visitor_count": "3.5M visitors"
            },
            {
                "name": "New York City",
                "country": "United States",
                "region": "North America",
                "description": "The city that never sleeps offers towering skyline views, Broadway theatre, boundless international culinary scenes, and vibrant neighborhoods.",
                "image_url": "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80",
                "banner_url": "https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=1920&q=80",
                "lat": 40.7128,
                "lng": -74.0060,
                "is_popular": True,
                "rating": 4.7,
                "visitor_count": "13.8M visitors"
            },
            {
                "name": "Dubai",
                "country": "United Arab Emirates",
                "region": "Middle East",
                "description": "Futuristic skyline rising from golden desert dunes, world-record landmarks, opulent beach resorts, and luxury shopping.",
                "image_url": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
                "banner_url": "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1920&q=80",
                "lat": 25.2048,
                "lng": 55.2708,
                "is_popular": True,
                "rating": 4.8,
                "visitor_count": "16.7M visitors"
            }
        ]

        dest_objs = {}
        for d in dest_data:
            obj = Destination(**d)
            db.session.add(obj)
            dest_objs[d['name']] = obj

        db.session.commit()

        print("Seeding Hotels and Rooms...")
        hotels_data = [
            {
                "destination": "Paris",
                "name": "Hôtel Plaza Athénée & Haute Spa",
                "tagline": "Iconic luxury on prestigious Avenue Montaigne with Eiffel Tower vistas",
                "address": "25 Avenue Montaigne, 75008 Paris, France",
                "description": "A Paris icon since 1913, Hôtel Plaza Athénée blends French classical luxury with Parisian couture chic. Home to red-awning balconies overlooking the Eiffel Tower and an exclusive Dior Spa.",
                "stars": 5,
                "rating": 4.9,
                "review_count": 340,
                "starting_price": 680,
                "lat": 48.8660,
                "lng": 2.3045,
                "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
                "gallery_json": json.dumps([
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
                    "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80",
                    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1000&q=80"
                ]),
                "amenities_json": json.dumps([
                    "Dior Luxury Spa", "Eiffel Tower View", "Michelin Star Dining", "24/7 Concierge", 
                    "Valet Parking", "Free High-Speed WiFi", "Marble Bathrooms", "Pet Friendly"
                ]),
                "featured": True,
                "rooms": [
                    {
                        "room_type": "Deluxe King",
                        "name": "Deluxe Parisian Room",
                        "description": "High ceilings, authentic antique moldings, bespoke fabrics, and an Italian marble bathroom.",
                        "capacity": 2,
                        "bed_type": "1 King Bed",
                        "size_sqm": 42,
                        "price_per_night": 680,
                        "perks_json": json.dumps(["Complimentary Breakfast", "Courtyard View", "Nespresso Bar"]),
                        "image_url": "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"
                    },
                    {
                        "room_type": "Signature Suite",
                        "name": "Eiffel Balcony Suite",
                        "description": "Private red-awning terrace facing the Eiffel Tower, spacious living salon, and private butler service.",
                        "capacity": 3,
                        "bed_type": "1 King Bed + 1 Rollaway",
                        "size_sqm": 85,
                        "price_per_night": 1450,
                        "perks_json": json.dumps(["Direct Eiffel View", "Dior Welcome Gifts", "Private Butler", "Champagne on Arrival"]),
                        "image_url": "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80"
                    }
                ]
            },
            {
                "destination": "Paris",
                "name": "Le Marais Boutique Hotel & Garden",
                "tagline": "Charming historical mansion tucked inside vibrant Rue des Rosiers",
                "address": "18 Rue des Rosiers, 75004 Paris, France",
                "description": "An intimate 17th-century boutique hideaway featuring secret courtyard gardens, artisanal breakfast buffets, and exposed stone walls.",
                "stars": 4,
                "rating": 4.7,
                "review_count": 182,
                "starting_price": 240,
                "lat": 48.8573,
                "lng": 2.3592,
                "image_url": "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1000&q=80",
                "gallery_json": json.dumps([
                    "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1000&q=80",
                    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=80"
                ]),
                "amenities_json": json.dumps(["Secret Garden Courtyard", "Free WiFi", "Artisanal Bakery Breakfast", "Cocktail Lounge", "Bicycle Rental"]),
                "featured": False,
                "rooms": [
                    {
                        "room_type": "Boutique Queen",
                        "name": "Classic Marais Room",
                        "description": "Cozy Parisian styling with hardwood floors, vintage accents, and rain shower.",
                        "capacity": 2,
                        "bed_type": "1 Queen Bed",
                        "size_sqm": 24,
                        "price_per_night": 240,
                        "perks_json": json.dumps(["Garden View", "Artisanal Coffee Machine", "Free High-Speed WiFi"]),
                        "image_url": "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80"
                    }
                ]
            },
            {
                "destination": "Tokyo",
                "name": "Aman Tokyo Sanctuary",
                "tagline": "Zen luxury perched high above the Otemachi business & palace district",
                "address": "The Otemachi Tower, 1-5-6 Otemachi, Chiyoda-ku, Tokyo, Japan",
                "description": "Ascend above Tokyo’s skyline into a tranquil sanctuary inspired by traditional Japanese residential architecture, featuring washi paper lanterns and expansive vistas of the Imperial Palace Gardens.",
                "stars": 5,
                "rating": 4.9,
                "review_count": 290,
                "starting_price": 790,
                "lat": 35.6866,
                "lng": 139.7645,
                "image_url": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80",
                "gallery_json": json.dumps([
                    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80",
                    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1000&q=80"
                ]),
                "amenities_json": json.dumps(["Indoor Infinity Pool", "Traditional Onsen Spa", "Imperial Palace View", "Wine Cellar", "Kaiseki Dining", "24/7 Butler"]),
                "featured": True,
                "rooms": [
                    {
                        "room_type": "Deluxe Premier",
                        "name": "Deluxe Room with Palace Panorama",
                        "description": "Traditional furo stone soaking tub, shoji sliding panels, and floor-to-ceiling panoramic city views.",
                        "capacity": 2,
                        "bed_type": "1 King Bed",
                        "size_sqm": 71,
                        "price_per_night": 790,
                        "perks_json": json.dumps(["Traditional Furo Soaking Tub", "Skyline Views", "Japanese Breakfast Included"]),
                        "image_url": "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80"
                    }
                ]
            },
            {
                "destination": "Bali",
                "name": "Four Seasons Resort Sayan Rainforest",
                "tagline": "Architectural wonder enveloped in Ubud's sacred Ayung River valley",
                "address": "Jl. Raya Sayan, Ubud, Bali 80571, Indonesia",
                "description": "Cross an awe-inspiring suspension bridge suspended above jungle treetops into an architectural lotus pond and descend into private riverside villas.",
                "stars": 5,
                "rating": 4.9,
                "review_count": 412,
                "starting_price": 540,
                "lat": -8.4984,
                "lng": 115.2435,
                "image_url": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80",
                "gallery_json": json.dumps([
                    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80",
                    "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=80"
                ]),
                "amenities_json": json.dumps(["Private Plunge Pool", "Ayurvedic Chakra Spa", "River Rafting Arrival", "Yoga Pavilion", "Balinese Cooking Class"]),
                "featured": True,
                "rooms": [
                    {
                        "room_type": "River Villa",
                        "name": "One-Bedroom Riverfront Pool Villa",
                        "description": "Perched directly over the rushing Ayung River with private sun terrace, plunge pool, and outdoor lotus shower.",
                        "capacity": 2,
                        "bed_type": "1 King Bed",
                        "size_sqm": 120,
                        "price_per_night": 540,
                        "perks_json": json.dumps(["Private Plunge Pool", "Daily Morning Yoga", "Floating Breakfast Option"]),
                        "image_url": "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=800&q=80"
                    }
                ]
            },
            {
                "destination": "Rome",
                "name": "Hotel de Russie & Secret Garden",
                "tagline": "Historic palazzo located between the Spanish Steps and Piazza del Popolo",
                "address": "Via del Babuino 9, 00187 Rome, Italy",
                "description": "Famed for its cascading terraced garden and Stravinskij Bar, Hotel de Russie blends classical Roman grandeur with contemporary Italian refinement.",
                "stars": 5,
                "rating": 4.8,
                "review_count": 215,
                "starting_price": 520,
                "lat": 41.9103,
                "lng": 12.4776,
                "image_url": "https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=1000&q=80",
                "gallery_json": json.dumps([
                    "https://images.unsplash.com/photo-1549294413-26f195200c16?auto=format&fit=crop&w=1000&q=80",
                    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80"
                ]),
                "amenities_json": json.dumps(["Secret Garden Courtyard", "Wellness Spa & Saltwater Pool", "Award-Winning Bar", "Limousine Service", "Historic Center Location"]),
                "featured": True,
                "rooms": [
                    {
                        "room_type": "Classic Double",
                        "name": "Superior Garden Room",
                        "description": "Overlooking the secret pine and rose gardens with Italian marble bathroom and artisan ceramics.",
                        "capacity": 2,
                        "bed_type": "1 King or 2 Twins",
                        "size_sqm": 35,
                        "price_per_night": 520,
                        "perks_json": json.dumps(["Garden Views", "Complimentary Roman Breakfast", "Free Spa Access"]),
                        "image_url": "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80"
                    }
                ]
            },
            {
                "destination": "Swiss Alps (Zermatt)",
                "name": "The Omnia Mountain Lodge",
                "tagline": "Contemporary alpine lodge clinging dramatically to the rock above Zermatt",
                "address": "Auf dem Fels, 3920 Zermatt, Switzerland",
                "description": "Accessed via a cave tunnel and private rock elevator, The Omnia reinterprets the classic mountain chalet with minimalist American modernism and unobstructed Matterhorn views.",
                "stars": 5,
                "rating": 4.9,
                "review_count": 188,
                "starting_price": 610,
                "lat": 45.9782,
                "lng": 7.7470,
                "image_url": "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1000&q=80",
                "gallery_json": json.dumps([
                    "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1000&q=80",
                    "https://images.unsplash.com/photo-1517840901100-8179e982acb7?auto=format&fit=crop&w=1000&q=80"
                ]),
                "amenities_json": json.dumps(["Indoor/Outdoor Heated Pool", "Matterhorn View Whirlpool", "Finnish Sauna", "Ski Butler & Equipment Room", "Open Fireplace Lounge"]),
                "featured": True,
                "rooms": [
                    {
                        "room_type": "Matterhorn Suite",
                        "name": "Panoramic Matterhorn Chalet Suite",
                        "description": "Floor-to-ceiling glass framing the Matterhorn, wood-burning fireplace, and private cedar balcony.",
                        "capacity": 2,
                        "bed_type": "1 King Bed",
                        "size_sqm": 68,
                        "price_per_night": 610,
                        "perks_json": json.dumps(["Direct Matterhorn View", "Wood Fireplace", "Ski Shuttle", "Gourmet Breakfast"]),
                        "image_url": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80"
                    }
                ]
            },
            {
                "destination": "Santorini",
                "name": "Canaves Oia Cliffside Suites",
                "tagline": "17th-century caldera cave suites carved into the precipice of Oia",
                "address": "Main Street, Oia 847 02, Santorini, Greece",
                "description": "Pristine white curves carved into the volcanic cliff face with private infinity pools merging seamlessly with the deep sapphire blue of the Aegean Caldera.",
                "stars": 5,
                "rating": 5.0,
                "review_count": 320,
                "starting_price": 720,
                "lat": 36.4618,
                "lng": 25.3753,
                "image_url": "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1000&q=80",
                "gallery_json": json.dumps([
                    "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1000&q=80",
                    "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1000&q=80"
                ]),
                "amenities_json": json.dumps(["Caldera Infinity Pool", "Private Yacht Charters", "Champagne Sunset Bar", "Cave Spa", "Greek Degustation Dining"]),
                "featured": True,
                "rooms": [
                    {
                        "room_type": "Infinity Suite",
                        "name": "Caldera View Cave Suite with Plunge Pool",
                        "description": "Authentic cycladic cave architecture with private heated infinity plunge pool looking over the volcano.",
                        "capacity": 2,
                        "bed_type": "1 King Bed",
                        "size_sqm": 55,
                        "price_per_night": 720,
                        "perks_json": json.dumps(["Private Caldera Plunge Pool", "Sunset Terrace", "Champagne Breakfast on Balcony"]),
                        "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80"
                    }
                ]
            },
            {
                "destination": "New York City",
                "name": "The 1 Hotel Central Park",
                "tagline": "Sustainable luxury and biophilic oasis just steps from Central Park",
                "address": "1414 6th Ave, New York, NY 10019, USA",
                "description": "Constructed using reclaimed woods, lush living ivy walls, organic cotton bedding, and farm-to-table cuisine crafted by award-winning chefs.",
                "stars": 5,
                "rating": 4.8,
                "review_count": 480,
                "starting_price": 450,
                "lat": 40.7648,
                "lng": -73.9760,
                "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
                "gallery_json": json.dumps([
                    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80"
                ]),
                "amenities_json": json.dumps(["Central Park Proximity", "Farmstand In-Room Dining", "Audi e-tron House Car", "Field House Gym", "Pet Concierge"]),
                "featured": False,
                "rooms": [
                    {
                        "room_type": "Park View King",
                        "name": "City King Nook Room",
                        "description": "Reclaimed barn wood interiors with cushioned window seat looking down upon 6th Avenue and Central Park.",
                        "capacity": 2,
                        "bed_type": "1 King Bed",
                        "size_sqm": 32,
                        "price_per_night": 450,
                        "perks_json": json.dumps(["Filtered Water Tap", "Yoga Mat", "Nespresso Machine"]),
                        "image_url": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80"
                    }
                ]
            }
        ]

        hotel_objs = []
        for h in hotels_data:
            dest = dest_objs[h['destination']]
            hotel = Hotel(
                destination_id=dest.id,
                name=h['name'],
                tagline=h['tagline'],
                address=h['address'],
                description=h['description'],
                stars=h['stars'],
                rating=h['rating'],
                review_count=h['review_count'],
                starting_price=h['starting_price'],
                lat=h['lat'],
                lng=h['lng'],
                image_url=h['image_url'],
                gallery_json=h['gallery_json'],
                amenities_json=h['amenities_json'],
                featured=h['featured']
            )
            db.session.add(hotel)
            db.session.flush()
            hotel_objs.append(hotel)

            for r in h['rooms']:
                room = Room(
                    hotel_id=hotel.id,
                    room_type=r['room_type'],
                    name=r['name'],
                    description=r['description'],
                    capacity=r['capacity'],
                    bed_type=r['bed_type'],
                    size_sqm=r['size_sqm'],
                    price_per_night=r['price_per_night'],
                    perks_json=r['perks_json'],
                    image_url=r['image_url'],
                    available_count=5
                )
                db.session.add(room)

        db.session.commit()

        print("Seeding Transport Tickets (Flights, High-speed Trains)...")
        tickets_data = [
            {
                "transport_type": "flight",
                "carrier": "Air France",
                "carrier_logo": "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=200&q=80",
                "carrier_code": "AF 1680",
                "origin": "London Heathrow Airport (LHR)",
                "origin_city": "London",
                "destination": "Paris Charles de Gaulle (CDG)",
                "destination_city": "Paris",
                "departure_time": "08:15 AM",
                "arrival_time": "10:35 AM",
                "departure_date": "2026-10-15",
                "duration": "1h 20m",
                "stops": 0,
                "class_type": "Economy",
                "baggage_allowance": "1 Cabin bag (12kg) + 1 Checked bag (23kg)",
                "price": 129,
                "seats_available": 14,
                "lat_origin": 51.4700,
                "lng_origin": -0.4543,
                "lat_destination": 49.0097,
                "lng_destination": 2.5479
            },
            {
                "transport_type": "train",
                "carrier": "Eurostar High-Speed",
                "carrier_logo": "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=200&q=80",
                "carrier_code": "ES 9014",
                "origin": "London St Pancras International",
                "origin_city": "London",
                "destination": "Paris Gare du Nord",
                "destination_city": "Paris",
                "departure_time": "09:31 AM",
                "arrival_time": "12:47 PM",
                "departure_date": "2026-10-15",
                "duration": "2h 16m",
                "stops": 0,
                "class_type": "Standard Premier",
                "baggage_allowance": "2 Large suitcases + 1 Hand luggage (No weight limit)",
                "price": 165,
                "seats_available": 22,
                "lat_origin": 51.5314,
                "lng_origin": -0.1261,
                "lat_destination": 48.8809,
                "lng_destination": 2.3553
            },
            {
                "transport_type": "train",
                "carrier": "JR Shinkansen Bullet Train",
                "carrier_logo": "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=200&q=80",
                "carrier_code": "Nozomi 213",
                "origin": "Tokyo Central Station",
                "origin_city": "Tokyo",
                "destination": "Kyoto Station",
                "destination_city": "Kyoto",
                "departure_time": "10:00 AM",
                "arrival_time": "12:15 PM",
                "departure_date": "2026-10-16",
                "duration": "2h 15m",
                "stops": 2,
                "class_type": "Green Car (First Class)",
                "baggage_allowance": "Complimentary oversized baggage reservation included",
                "price": 142,
                "seats_available": 30,
                "lat_origin": 35.6812,
                "lng_origin": 139.7671,
                "lat_destination": 34.9858,
                "lng_destination": 135.7588
            },
            {
                "transport_type": "flight",
                "carrier": "Singapore Airlines",
                "carrier_logo": "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=200&q=80",
                "carrier_code": "SQ 942",
                "origin": "Singapore Changi (SIN)",
                "origin_city": "Singapore",
                "destination": "Denpasar Bali (DPS)",
                "destination_city": "Bali",
                "departure_time": "09:20 AM",
                "arrival_time": "12:05 PM",
                "departure_date": "2026-10-18",
                "duration": "2h 45m",
                "stops": 0,
                "class_type": "Economy",
                "baggage_allowance": "30kg Checked baggage + 7kg Carry-on",
                "price": 185,
                "seats_available": 18,
                "lat_origin": 1.3644,
                "lng_origin": 103.9915,
                "lat_destination": -8.7482,
                "lng_destination": 115.1672
            },
            {
                "transport_type": "train",
                "carrier": "Glacier Express Scenic Rail",
                "carrier_logo": "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=200&q=80",
                "carrier_code": "GEX 902",
                "origin": "St. Moritz Station",
                "origin_city": "St. Moritz",
                "destination": "Zermatt Matterhorn Station",
                "destination_city": "Swiss Alps (Zermatt)",
                "departure_time": "08:52 AM",
                "arrival_time": "05:10 PM",
                "departure_date": "2026-10-20",
                "duration": "8h 18m",
                "stops": 6,
                "class_type": "Excellence Class",
                "baggage_allowance": "Luggage transfer service + 5-course alpine regional lunch",
                "price": 420,
                "seats_available": 8,
                "lat_origin": 46.4983,
                "lng_origin": 9.8436,
                "lat_destination": 45.9763,
                "lng_destination": 7.7491
            },
            {
                "transport_type": "flight",
                "carrier": "Emirates Airlines",
                "carrier_logo": "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=200&q=80",
                "carrier_code": "EK 074",
                "origin": "Paris Charles de Gaulle (CDG)",
                "origin_city": "Paris",
                "destination": "Dubai International (DXB)",
                "destination_city": "Dubai",
                "departure_time": "02:30 PM",
                "arrival_time": "11:55 PM",
                "departure_date": "2026-10-22",
                "duration": "6h 25m",
                "stops": 0,
                "class_type": "Business Class",
                "baggage_allowance": "40kg Checked bag + Chauffeur drive service",
                "price": 1150,
                "seats_available": 6,
                "lat_origin": 49.0097,
                "lng_origin": 2.5479,
                "lat_destination": 25.2532,
                "lng_destination": 55.3657
            }
        ]

        ticket_objs = []
        for t in tickets_data:
            ticket = Ticket(**t)
            db.session.add(ticket)
            ticket_objs.append(ticket)

        db.session.commit()

        print("Seeding Travel Guides...")
        guides_data = [
            {
                "destination": "Paris",
                "name": "Camille Laurent",
                "title": "Sorbonne Art Historian & Private Louvre Curator",
                "photo_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80",
                "bio": "Born and raised in Saint-Germain-des-Prés, Camille has 9 years of experience leading exclusive VIP art and architectural walks across the Marais, Latin Quarter, and private salon galleries.",
                "languages_json": json.dumps(["French (Native)", "English (Fluent)", "Italian"]),
                "specialties_json": json.dumps(["Louvre Hidden Masterpieces", "Secret Wine Cellars", "Belle Époque Architecture", "Vintage Bookshops"]),
                "rating": 5.0,
                "review_count": 89,
                "daily_rate": 280,
                "experience_years": 9,
                "featured": True,
                "lat": 48.8566,
                "lng": 2.3522
            },
            {
                "destination": "Tokyo",
                "name": "Kenji Takahashi",
                "title": "Tsukiji Market Insider & Certified Sake Sommelier",
                "photo_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
                "bio": "Kenji unlocks the culinary secrets of Tokyo from hidden omakase counters in Ginza to dawn tuna auctions and historic Yanaka craftsman workshops.",
                "languages_json": json.dumps(["Japanese (Native)", "English (Fluent)"]),
                "specialties_json": json.dumps(["Omakase Culinary Tours", "Sake Tasting Journeys", "Edo Period Heritage", "Night Street Photography"]),
                "rating": 4.9,
                "review_count": 114,
                "daily_rate": 320,
                "experience_years": 11,
                "featured": True,
                "lat": 35.6762,
                "lng": 139.6503
            },
            {
                "destination": "Bali",
                "name": "Wayan Suardana",
                "title": "Master Temple Priest & Eco-Trek Specialist",
                "photo_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
                "bio": "Wayan leads travelers beyond tourist paths into sacred water purification ceremonies (Melukat), ancient jungle bamboo paths, and sunrise caldera treks.",
                "languages_json": json.dumps(["Indonesian", "Balinese", "English (Fluent)"]),
                "specialties_json": json.dumps(["Sacred Water Blessing", "Hidden Waterfall Treks", "Organic Herbal Farming", "Volcano Sunrise"]),
                "rating": 4.9,
                "review_count": 96,
                "daily_rate": 160,
                "experience_years": 8,
                "featured": True,
                "lat": -8.4095,
                "lng": 115.1889
            },
            {
                "destination": "Rome",
                "name": "Marco Valenti",
                "title": "Archaeologist & Vatican Epigraphist",
                "photo_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80",
                "bio": "Author and field archaeologist who brings the Roman Forum and subterranean catacombs to vivid life through thrilling historical storytelling.",
                "languages_json": json.dumps(["Italian (Native)", "English", "Spanish"]),
                "specialties_json": json.dumps(["Underground Rome", "Imperial Colosseum & Forum", "Jewish Ghetto Culinary", "Caravaggio Trail"]),
                "rating": 4.9,
                "review_count": 78,
                "daily_rate": 260,
                "experience_years": 12,
                "featured": True,
                "lat": 41.9028,
                "lng": 12.4964
            },
            {
                "destination": "Swiss Alps (Zermatt)",
                "name": "Beatrix Meyer",
                "title": "IFMGA Mountain Guide & Alpine Photographer",
                "photo_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80",
                "bio": "Licensed mountain guide who takes travelers on safe, breathtaking glacier trails and secret Matterhorn photography ridges.",
                "languages_json": json.dumps(["German", "English", "French"]),
                "specialties_json": json.dumps(["Gornergrat Sunrise", "Glacier Crevasse Safaris", "Alpine Flora & Wildflowers", "Ski Mountaineering"]),
                "rating": 5.0,
                "review_count": 64,
                "daily_rate": 390,
                "experience_years": 14,
                "featured": False,
                "lat": 45.9763,
                "lng": 7.7491
            }
        ]

        guide_objs = []
        for g in guides_data:
            dest = dest_objs[g['destination']]
            guide = Guide(
                destination_id=dest.id,
                name=g['name'],
                title=g['title'],
                photo_url=g['photo_url'],
                bio=g['bio'],
                languages_json=g['languages_json'],
                specialties_json=g['specialties_json'],
                rating=g['rating'],
                review_count=g['review_count'],
                daily_rate=g['daily_rate'],
                experience_years=g['experience_years'],
                featured=g['featured'],
                lat=g['lat'],
                lng=g['lng']
            )
            db.session.add(guide)
            guide_objs.append(guide)

        db.session.commit()

        print("Seeding Reviews...")
        reviews_data = [
            {
                "user_id": demo_traveler.id,
                "hotel_id": hotel_objs[0].id,
                "rating": 5,
                "title": "Unmatched Parisian Elegance & Balcony Views",
                "comment": "Staying at Plaza Athénée was the highlight of our Europe trip. Waking up to fresh croissants on our terrace overlooking the Eiffel Tower was magical. Flawless service from the concierge."
            },
            {
                "user_id": demo_traveler.id,
                "hotel_id": hotel_objs[2].id,
                "rating": 5,
                "title": "Peaceful Zen Heaven in the Heart of Tokyo",
                "comment": "The architecture of Aman Tokyo is truly breathtaking. After a long flight, soaking in the stone furo tub with Mount Fuji in the distance was pure bliss."
            },
            {
                "user_id": demo_traveler.id,
                "hotel_id": hotel_objs[3].id,
                "rating": 5,
                "title": "A Sacred Jungle Retreat Like No Other",
                "comment": "Arriving across the suspension bridge in Sayan felt like stepping into an enchanted dream. The private pool villa was serene and the staff felt like family."
            }
        ]
        for r in reviews_data:
            review = Review(**r)
            db.session.add(review)

        print("Seeding Initial Booking for Demo User...")
        initial_booking = Booking(
            user_id=demo_traveler.id,
            booking_type="hotel",
            item_id=hotel_objs[0].id,
            title="Hôtel Plaza Athénée — Deluxe Parisian Room",
            image_url=hotel_objs[0].image_url,
            destination_name="Paris",
            details_json=json.dumps({
                "hotel_name": "Hôtel Plaza Athénée & Haute Spa",
                "room_name": "Deluxe Parisian Room",
                "nights": 3,
                "guests": 2,
                "check_in": "2026-11-10",
                "check_out": "2026-11-13",
                "price_per_night": 680,
                "taxes": 140,
                "total": 2180
            }),
            total_amount=2180,
            currency="USD",
            status="confirmed",
            start_date="2026-11-10",
            end_date="2026-11-13",
            guest_name="Alex Mercer",
            guest_email="traveler@traveldemo.com",
            guest_phone="+1 (555) 234-5678",
            special_requests="High floor room facing quiet inner courtyard if possible."
        )
        db.session.add(initial_booking)
        db.session.flush()

        initial_payment = Payment(
            booking_id=initial_booking.id,
            amount=2180,
            currency="USD",
            status="succeeded",
            payment_method="Mastercard ending in 8832",
            provider_ref="ch_simulated_demo_initial",
            card_last4="8832"
        )
        db.session.add(initial_payment)
        db.session.commit()

        print("Database seeded successfully with rich travel data!")

if __name__ == '__main__':
    seed_database()
