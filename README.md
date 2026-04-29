# Dental Clinic Website

A modern, full-stack dental clinic website designed to showcase clinic services, present dental professionals, and manage patient appointment requests through an intuitive admin dashboard.

**Live Demo:** https://clinic-dental-six.vercel.app/

## Architecture Overview

This is a complete **MERN stack** application with a decoupled frontend and backend architecture:

- **Frontend (React/Vite):** Single-page application with client-side routing and real-time data fetching
- **Backend (Node.js/Express):** RESTful API with MongoDB database and JWT authentication
- **Deployment:** Frontend deployed on Vercel, backend on separate server

## Tech Stack

**Frontend:**
- React 19 with Vite (fast build tool)
- React Router v7 for navigation
- Framer Motion for smooth animations
- TanStack React Query for data synchronization
- Axios for HTTP requests
- React Loading Skeleton for loading states

**Backend:**
- Node.js with Express server
- MongoDB + Mongoose ODM
- JWT authentication with bcryptjs password hashing
- CORS enabled for secure cross-origin requests
- Environment-based configuration

## Core Features

### Public Pages
1. **Home Page** - Hero section, services showcase, before/after gallery, customer reviews, and clinic info
2. **Clinic Page** - Detailed clinic information, facilities, team presentation, opening hours
3. **Contact Page** - Appointment request form with patient details and service selection
4. **Gallery** - Before/after transformation cases and clinic gallery with lazy-loaded blur images
5. **Services** - Complete list of dental services offered with descriptions and pricing

### Admin Dashboard (Protected)
- **Login System** - Secure JWT-based authentication with admin credentials
- **Request Management** - View all appointment requests with customer contact details
- **Delete Requests** - Remove processed or spam requests
- **Password Management** - Change admin password securely
- **Real-time Data** - Live data fetching with error handling and fallbacks

### Technical Features
- Responsive design (mobile, tablet, desktop)
- SEO optimization with meta tags
- WhatsApp widget for direct customer messaging
- Animated background for visual appeal
- Form validation and error handling
- Protected routes with authentication middleware
- Image optimization and caching strategies

## Database Models

- **User** - Admin account with hashed password and JWT tokens
- **ContactRequest** - Customer appointment requests with personal and service details
- **Service** - Dental services with descriptions and pricing
- **GalleryItem** - Before/after cases and clinic images
- **BeforeAfterCase** - Detailed transformation cases

## API Endpoints

```
Authentication:  POST /api/auth/login, /api/auth/register, /api/auth/change-password
Contact:         GET/POST /api/contact-requests
Services:        GET /api/services
Gallery:         GET/POST /api/gallery
Before/After:    GET/POST /api/before-after
```

All admin endpoints require JWT token in Authorization header.

## How It Works

1. **User Journey:** Visitor browses the clinic website, views services and gallery, submits appointment request
2. **Data Flow:** Frontend form data → Axios sends to backend → Express validates and stores in MongoDB
3. **Admin Process:** Admin logs in → Dashboard fetches all requests → Can review and delete completed requests
4. **Security:** JWT tokens validate each admin action; passwords hashed with bcryptjs

## Getting Started

```bash
# Install & run backend
cd server
npm install
npm run dev              # Starts on http://localhost:5000

# Install & run frontend (new terminal)
cd client
npm install
npm run dev              # Starts on http://localhost:5173

# Build for production
npm run build
```

## Environment Setup

Create `.env` in server folder with:
```
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
CLIENT_ORIGINS=http://localhost:3000,https://yourdomain.com
```

## Project by
Original: https://github.com/the-shaiib/clinic-dental
