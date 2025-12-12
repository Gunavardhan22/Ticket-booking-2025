# Ticket-booking-2025
![Image Description](https://github.com/Gunavardhan22/Ticket-booking-2025/blob/6914c57bd0832d7b09e72ec65847696949c60de8/Screenshot%202025-12-12%20121057.png)
![Image Description](https://github.com/Gunavardhan22/Ticket-booking-2025/blob/6914c57bd0832d7b09e72ec65847696949c60de8/Screenshot%202025-12-12%20121113.png
)
![Image Description](https://github.com/Gunavardhan22/Ticket-booking-2025/blob/6914c57bd0832d7b09e72ec65847696949c60de8/Screenshot%202025-12-12%20121119.png
)
![Image Description](https://github.com/Gunavardhan22/Ticket-booking-2025/blob/6914c57bd0832d7b09e72ec65847696949c60de8/Screenshot%202025-12-12%20121126.png
)
![Image Description](https://github.com/Gunavardhan22/Ticket-booking-2025/blob/6914c57bd0832d7b09e72ec65847696949c60de8/Screenshot%202025-12-12%20121150.png
)
![Image Description](https://github.com/Gunavardhan22/Ticket-booking-2025/blob/6914c57bd0832d7b09e72ec65847696949c60de8/Screenshot%202025-12-12%20121159.png)


Ticket Booking System

A full-stack booking management platform inspired by systems like RedBus, BookMyShow, and doctor appointment schedulers.
The application enables admins to create shows/trips and allows users to view availability, select seats, and perform safe, concurrency-proof bookings.

Features
Admin

Create shows, trips, or appointment slots

Define show name, start time, and total available seats

View all created shows

User

Browse available shows/trips

View seat layout (available, selected, booked)

Book one or more seats

Receive real-time booking status: PENDING, CONFIRMED, FAILED

System

Concurrency-safe booking using database transactions

Prevents double-booking even under simultaneous requests

Clean REST API architecture

Fully deployed frontend and backend

ATS-friendly codebase and documentation

Tech Stack
Backend

Node.js

Express.js

PostgreSQL

Sequelize ORM

SQL Transactional Locking (SELECT FOR UPDATE)

REST API

Frontend

React

TypeScript

Vite

Context API

Axios

React Router

Deployment

Backend: Render / Railway

Frontend: Vercel / Netlify

System Architecture

The application follows a modular service-oriented architecture:

Frontend communicates with backend via REST APIs.

Backend performs business logic, validation, and concurrency control.

PostgreSQL database stores shows, seats, and booking records.

Booking logic uses row-level locks to prevent race conditions and overbooking.

Database Schema
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE booking_status AS ENUM ('PENDING', 'CONFIRMED', 'FAILED');

CREATE TABLE shows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  total_seats INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE seats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  show_id UUID NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
  seat_number INTEGER NOT NULL,
  is_booked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (show_id, seat_number)
);

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  show_id UUID NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
  seat_numbers INTEGER[] NOT NULL,
  status booking_status DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

API Endpoints
Shows
POST /api/shows
GET /api/shows
GET /api/shows/:id (optional)

Booking
POST /api/bookings
GET /api/bookings/:id

Concurrency Handling

To prevent race conditions and overbooking:

The backend wraps seat booking in a SQL transaction

Uses SELECT ... FOR UPDATE for row-level locking

Ensures only one request can modify a seat at a time

If the seat is already booked, booking fails gracefully

Frontend Features

Admin dashboard for show creation

User interface for browsing shows

Seat grid visualization

Seat selection with dynamic UI state

Booking confirmation flow

Error handling for API failures and booking conflicts

Local Setup Instructions
Backend Setup
cd backend
npm install
cp .env.example .env
# Configure DATABASE_URL
node src/index.js

Frontend Setup
cd frontend
npm install
echo "VITE_API_URL=http://localhost:4000/api" > .env
npm run dev

Deployment
Backend (Render/Railway)

Add environment variable DATABASE_URL

Build Command: npm install

Start Command: node src/index.js

Frontend (Vercel/Netlify)

Add environment variable: VITE_API_URL=<backend-url>/api

Build Command (Vite): npm run build

Output Directory: dist

Project Structure
frontend/
│
├── public/
│   ├── index.html
│   └── favicon.ico
│
├── src/
│   ├── api/
│   │   ├── axiosClient.ts          # Base Axios instance / fetch wrapper
│   │   ├── showApi.ts              # Show/trip CRUD API handlers
│   │   └── bookingApi.ts           # Seat-booking API handlers
│   │
│   ├── components/
│   │   ├── SeatGrid/
│   │   │   ├── SeatGrid.tsx        # Visual seat layout component
│   │   │   └── SeatGrid.css
│   │   ├── ShowCard.tsx            # Reusable card for shows
│   │   └── Loader.tsx              # Loading indicator
│   │
│   ├── contexts/
│   │   ├── AuthContext.tsx         # Mock authentication context
│   │   ├── ShowContext.tsx         # Global show/trip caching
│   │   └── BookingContext.tsx      # Global booking state
│   │
│   ├── pages/
│   │   ├── Admin/
│   │   │   ├── AdminDashboard.tsx  # List + create shows
│   │   │   └── CreateShowForm.tsx  # Admin form with validation
│   │   ├── User/
│   │   │   ├── ShowList.tsx        # User list view
│   │   │   └── BookingPage.tsx     # Seat selection + booking
│   │   └── NotFound.tsx
│   │
│   ├── router/
│   │   └── AppRouter.tsx           # Route definitions
│   │
│   ├── hooks/
│   │   └── useFetch.ts             # Memoized data fetching hook
│   │
│   ├── utils/
│   │   ├── seatUtils.ts            # DOM seat selection helpers
│   │   └── validators.ts           # Form validation logic
│   │
│   ├── styles/
│   │   └── global.css
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── tsconfig.json
├── package.json
└── README.md

Assumptions

Seat layout is linear (1 to total_seats)

Concurrency managed at database layer

No authentication required (mock admin access)

Future Enhancements

WebSocket for real-time seat updates

Payment gateway integration

JWT-based authentication

Role-based admin control panel

Author

Your Name
Full Stack Developer
