# EventBuddy Backend

A comprehensive event management and booking system built with NestJS, TypeScript, TypeORM, and PostgreSQL/MySQL.

**Frontend Repo:** [EventBuddy Frontend](https://github.com/Foysal-Munsy/EventBuddy-Frontend)

## Features

- 🔐 User authentication with JWT (cookie-based)
- 👥 Role-based access control (Admin & User)
- 📅 Event management (CRUD operations)
- 🎫 Seat booking system (1-4 seats per booking)
- 📊 Booking history tracking
- 🔍 Filter events by date (upcoming/previous)

## Tech Stack

- **Framework:** NestJS
- **Language:** TypeScript
- **Database:** TypeORM (PostgreSQL)
- **Authentication:** JWT + bcrypt
- **Validation:** class-validator, class-transformer

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd eventbuddy-backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=8000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_DATABASE=eventbuddy

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key

# Frontend URL (for CORS)
Frontend_URL=http://localhost:3000
```

### 4. Database Setup
Make sure your database is running and accessible with the credentials in `.env`.

### 5. Run the Application

```bash
# Development mode with hot-reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The server will start on `http://localhost:8000`

---

## API Endpoints

### 🔐 Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
**Response:** User object (role defaults to "user")

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```
**Response:** 
```json
{
  "message": "Login successful",
  "user": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```
**Note:** JWT token stored in httpOnly cookie

#### Get Current User
```http
GET /auth/user
Cookie: jwt=<token>
```
**Response:** User payload from JWT

#### Logout
```http
POST /auth/logout
```
**Response:** `{ "message": "Logout successful" }`

---

### 📅 Event Endpoints

#### Get All Events (Admin Only)
```http
GET /events
Cookie: jwt=<admin-token>
```
**Response:** Array of all events

#### Get Specific Event (Public)
```http
GET /events/:id
```
**Response:** Single event object

#### Get Previous Events (Public)
```http
GET /events/previous
```
**Response:** Array of events with `date < now`

#### Get Upcoming Events (Public)
```http
GET /events/upcoming
```
**Response:** Array of events with `date > now`

#### Create Event (Admin Only)
```http
POST /events/create
Cookie: jwt=<admin-token>
Content-Type: application/json

{
  "title": "Music Concert",
  "description": "Amazing live performance",
  "date": "2025-12-25T19:00:00Z",
  "location": "City Hall",
  "totalSeats": 100,
  "imageUrl": "https://example.com/image.jpg"
}
```
**Response:** Created event object

#### Update Event (Admin Only)
```http
PATCH /events/:id
Cookie: jwt=<admin-token>
Content-Type: application/json

{
  "title": "Updated Title",
  "totalSeats": 150
}
```
**Response:** Updated event object

#### Delete Event (Admin Only)
```http
DELETE /events/:id
Cookie: jwt=<admin-token>
```
**Response:** `{ "message": "Event deleted successfully" }`

---

### 🎫 Booking Endpoints

#### Book Event Seats (User Only)
```http
POST /events/:id/book
Cookie: jwt=<user-token>
Content-Type: application/json

{
  "seats": 3
}
```
**Constraints:** 
- User role required
- Seats: 1-4 per booking
- Must have available seats

**Response:**
```json
{
  "message": "Successfully booked 3 seat(s)",
  "event": { ...updated event... },
  "booking": { ...booking record... }
}
```

#### Get My Bookings (User Only)
```http
GET /events/my-bookings
Cookie: jwt=<user-token>
```
**Response:**
```json
[
  {
    "id": 1,
    "userId": 5,
    "eventId": 3,
    "seats": 2,
    "bookedAt": "2025-11-20T10:30:00Z",
    "event": {
      "id": 3,
      "title": "Concert Night",
      "date": "2025-12-15",
      "location": "City Hall",
      ...
    }
  }
]
```

---

## Database Schema

### Users Table
- `id` (PK)
- `fullName`
- `email` (unique)
- `password` (hashed)
- `role` (user/admin)

### Events Table
- `id` (PK)
- `title`
- `description`
- `date`
- `location`
- `totalSeats` (default: 4)
- `bookedSeats` (default: 0)
- `imageUrl` (nullable)

### Bookings Table
- `id` (PK)
- `userId` (FK → Users)
- `eventId` (FK → Events)
- `seats`
- `bookedAt` (timestamp)

---

## Project Structure

```
src/
├── auth/
│   ├── decorators/
│   │   ├── current-user.decorator.ts
│   │   └── roles.decorator.ts
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   └── login-user.dto.ts
│   ├── entities/
│   │   └── user.entity.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
├── events/
│   ├── dto/
│   │   ├── book-event.dto.ts
│   │   ├── create-event.dto.ts
│   │   └── update-event.dto.ts
│   ├── entities/
│   │   ├── booking.entity.ts
│   │   └── event.entity.ts
│   ├── events.controller.ts
│   ├── events.module.ts
│   └── events.service.ts
├── app.controller.ts
├── app.module.ts
├── app.service.ts
└── main.ts
```

---

## Authentication Flow

1. **Register:** User creates account → password is hashed → stored in DB with role="user"
2. **Login:** Credentials validated → JWT token generated → stored in httpOnly cookie
3. **Protected Routes:** JWT extracted from cookie → verified → user info available via `@CurrentUser()` decorator
4. **Role Check:** `@Roles('admin')` or `@Roles('user')` decorator enforces access control

---

## Common Issues & Solutions

### Database Connection Error
- Verify database is running
- Check credentials in `.env`
- Ensure database exists

### CORS Error
- Update `Frontend_URL` in `.env` to match your frontend URL
- Ensure `credentials: 'include'` is set in frontend fetch calls

### JWT Cookie Not Sent
- Use `credentials: 'include'` in fetch/axios
- Ensure frontend and backend are on compatible domains/ports

---

## License

This project is [MIT licensed](LICENSE).

---

