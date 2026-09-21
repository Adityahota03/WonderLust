# Travel Website — Technology Stack

**Project:** Travel Booking Platform
**Stack:** React (Frontend) · Python Flask (Backend) · PostgreSQL (Database)

---

## 1.1 Frontend
| Layer | Technology | Purpose |
|---|---|---|
| Core framework | React 18 (Vite) | Component-based SPA |
| Routing | React Router v6 | Page navigation |
| State management | Redux Toolkit (or Context API for smaller scope) | Global state: auth, search filters, cart/booking |
| HTTP client | Axios | API communication with interceptors for JWT |
| Styling | Tailwind CSS | Utility-first responsive styling |
| Forms & validation | React Hook Form + Yup | Login, search, booking forms |
| Maps | Google Maps JavaScript API / Mapbox GL JS | Destination map, hotel pin locations |
| Animation | Framer Motion | Page/UI motion (see Technical Architecture doc, §5) |
| Icons | Lucide-react / React Icons | UI iconography |
| Testing | Jest + React Testing Library | Component/unit tests |

## 1.2 Backend
| Layer | Technology | Purpose |
|---|---|---|
| Framework | Python Flask | REST API server |
| API structure | Flask Blueprints + Flask-RESTful/Flask-Smorest | Modular route organization |
| ORM | SQLAlchemy | Database models & queries |
| Migrations | Alembic (Flask-Migrate) | Schema version control |
| Auth | Flask-JWT-Extended | Access/refresh token issuance & validation |
| Serialization | Marshmallow | Request/response schema validation |
| Security middleware | Flask-Talisman, Flask-CORS, Flask-Limiter | Headers, CORS, rate limiting |
| Background jobs | Celery + Redis | Email confirmations, booking reminders |
| Caching | Redis | Search result caching, session store |
| Testing | Pytest | Unit & integration tests |

## 1.3 Database
| Component | Technology |
|---|---|
| Primary DB | PostgreSQL 15+ |
| Extensions | PostGIS (optional, for geo-queries on hotel/destination coordinates) |
| Connection pooling | PgBouncer |

## 1.4 Infrastructure / DevOps
| Layer | Technology |
|---|---|
| Containerization | Docker + Docker Compose |
| Reverse proxy | Nginx |
| CI/CD | GitHub Actions |
| Hosting | AWS (EC2/ECS + RDS) or equivalent (GCP/Azure) |
| Object storage | AWS S3 (hotel images, guide photos) |
| Monitoring | Sentry (errors), Prometheus + Grafana (metrics) |

## 1.5 Third-Party Integrations
| Service | Used for |
|---|---|
| Stripe / PayPal | Payment processing for hotels, tickets, guides |
| Google Maps / Mapbox | Interactive map, geocoding, directions |
| SendGrid / Mailgun | Booking confirmations, OTP, password reset |
| Twilio (optional) | SMS OTP / booking alerts |
