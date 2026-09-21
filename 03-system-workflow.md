# Travel Website — System Workflow

**Project:** Travel Booking Platform

---

## 3.1 Registration & Login Flow

```mermaid
sequenceDiagram
    participant U as User (Browser)
    participant F as React Frontend
    participant A as Flask Auth API
    participant DB as PostgreSQL

    U->>F: Enter email/password, submit
    F->>A: POST /auth/login
    A->>DB: Verify user & password hash
    DB-->>A: User record
    A->>A: Generate JWT (access + refresh)
    A-->>F: 200 OK { access_token, refresh_token }
    F->>F: Store tokens (httpOnly cookie / memory)
    F-->>U: Redirect to Home (authenticated)
```

## 3.2 Search Flow

```mermaid
flowchart LR
    A[User enters destination/dates on Home/Search bar] --> B[Click Search button]
    B --> C[Frontend calls GET /api/search]
    C --> D[Backend queries Hotels, Tickets, Guides tables]
    D --> E{Cache hit in Redis?}
    E -- Yes --> F[Return cached results]
    E -- No --> G[Query PostgreSQL, cache result]
    G --> F
    F --> H[Render results list + Map view]
```

## 3.3 Hotel / Ticket / Guide Booking Flow

```mermaid
flowchart TD
    A[User selects Hotel/Ticket/Guide] --> B{Logged in?}
    B -- No --> C[Redirect to Login] --> D[Return to booking after auth]
    B -- Yes --> E[Fill booking details - dates, guests]
    E --> F[Click Book Now]
    F --> G[POST /booking endpoint - creates booking, status=pending]
    G --> H[Redirect to Payment]
    H --> I[POST /payments/checkout via Stripe/PayPal]
    I --> J{Payment success?}
    J -- Yes --> K[Webhook confirms payment]
    K --> L[Booking status -> confirmed]
    L --> M[Celery sends confirmation email]
    M --> N[Show booking confirmation to user]
    J -- No --> O[Booking status -> failed, show retry]
```

## 3.4 Map Interaction Flow

```mermaid
flowchart LR
    A[User opens Search Results / Hotel Details] --> B[Frontend loads Map component]
    B --> C[Call Maps API with hotel/destination coordinates]
    C --> D[Render pins for hotels/attractions]
    D --> E[User clicks a pin]
    E --> F[Show info card - name, price, rating]
    F --> G[Click through to detail/booking page]
```

## 3.5 Overall User Journey

```mermaid
flowchart TD
    Home[Home Page] --> Search[Search: Hotels / Tickets / Guides]
    Search --> Results[Results + Map View]
    Results --> Details[Item Details Page]
    Details --> Login{Authenticated?}
    Login -- No --> LoginPage[Login/Register] --> Details
    Login -- Yes --> Booking[Booking Form]
    Booking --> Payment[Payment]
    Payment --> Confirmation[Booking Confirmation]
    Home --> About[About Page]
    Home --> Contact[Contact Page]
```
