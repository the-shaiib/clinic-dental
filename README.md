# Dental Clinic Website

A full-stack dental clinic web application built to present clinic services and manage patient appointment requests.

## Live Demo
https://clinic-dental-six.vercel.app/

## Tech Stack

### Frontend
- React (Vite)
- React Router DOM
- Axios
- TanStack React Query
- Framer Motion

### Backend
- Node.js
- Express
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs

## Features
- Clinic and dentist presentation
- Services section
- Contact and appointment request form
- Admin dashboard to manage requests
- Responsive user interface

## How It Works
- Users browse the website and submit appointment requests
- Frontend sends data using /api endpoints
- Backend processes requests and stores data in MongoDB
- Admin can view and manage incoming requests

## Run Locally

```bash
# Backend
cd server
npm install
npm run dev

# Frontend
cd client
npm install
npm run dev
