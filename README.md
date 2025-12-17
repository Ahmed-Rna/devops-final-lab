# MediCare - Pharmacy E-Commerce Platform

A modern, full-stack pharmacy e-commerce application with separated backend API and React frontend.

## Project Structure

```
devops-lab-mid/
├── FinalLab-backend/     # Node.js/Express REST API
└── FinalLab-frontend/    # React + Vite frontend
```

## Features

- **Backend (Node.js/Express)**
  - RESTful API for medicines and orders
  - MongoDB database integration
  - CORS enabled for frontend communication
  - Transaction support for orders
  - Error handling middleware

- **Frontend (React + Vite)**
  - Modern, responsive UI
  - Three main pages: Home, Shop, Admin Dashboard
  - Shopping cart functionality
  - Order placement system
  - Admin panel for managing medicines and orders
  - Real-time API integration

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or remote)
- npm or yarn

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd FinalLab-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your MongoDB connection string:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/medicine-store
FRONTEND_URL=http://localhost:5173
```

5. Start the backend server:
```bash
npm start        # Production
npm run dev      # Development with nodemon
```

The backend will be available at `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd FinalLab-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (or use `.env.example`):
```bash
cp .env.example .env
```

4. The `.env` file should contain:
```
VITE_API_URL=http://localhost:3000
```

5. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Medicines
- `GET /api/medicines` - Get all medicines
- `GET /api/medicines/:id` - Get medicine by ID
- `POST /api/medicines` - Create new medicine
- `PUT /api/medicines/:id` - Update medicine
- `DELETE /api/medicines/:id` - Delete medicine

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status

### Health Check
- `GET /api/health` - API health status

## Frontend Pages

### Home Page
- Welcome section with call-to-action
- Features showcase
- About MediCare information

### Shop Page
- Browse all available medicines
- View medicine details (name, price, stock, category)
- Add medicines to shopping cart
- Place orders with customer information

### Admin Dashboard
- **Medicines Management**: Add, edit, delete medicines
- **Orders Management**: View orders and update their status

## Technologies Used

### Backend
- Express.js - Web framework
- MongoDB - Database
- Mongoose - ODM for MongoDB
- CORS - Cross-origin resource sharing
- Nodemon - Development server with auto-reload

### Frontend
- React 19 - UI library
- Vite - Build tool and dev server
- CSS3 - Styling

## Data Models

### Medicine Schema
```javascript
{
  name: String,           // Required
  description: String,    // Required
  price: Number,         // Required
  stock: Number,         // Required, default: 0
  category: String,      // Required, default: 'General'
  image_url: String,     // Optional
  createdAt: Date        // Auto timestamp
}
```

### Order Schema
```javascript
{
  medicine_id: ObjectId,  // Reference to Medicine
  customer_name: String,  // Required
  customer_email: String, // Required
  quantity: Number,       // Required
  total_price: Number,    // Calculated
  status: String,        // pending, processing, shipped, delivered, cancelled
  createdAt: Date       // Auto timestamp
}
```

## Development

### Backend Development
```bash
cd FinalLab-backend
npm run dev
```

### Frontend Development
```bash
cd FinalLab-frontend
npm run dev
```

### Build Frontend for Production
```bash
cd FinalLab-frontend
npm run build
```

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 3000)
- `MONGODB_URI` - MongoDB connection string
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend (.env)
- `VITE_API_URL` - Backend API URL

