# 📱 Twilio SaaS Dashboard

A premium, full-stack WhatsApp message management system built with React, Node.js, and MongoDB. This dashboard allows businesses to manage message templates, simulate approval workflows, and send messages through the Twilio API.

## ✨ Features

- **Template Management**: Full CRUD (Create, Read, Update, Delete) for WhatsApp message templates.
- **Approval Workflow**: Support for template states: `Draft`, `Pending`, `Approved`, and `Rejected`.
- **Live Preview**: Real-time WhatsApp-style message preview during template creation.
- **Interactive Buttons**: Support for URL and Call actions in templates.
- **Unified Dashboard**: Clean, modern UI with search, filtering, and status tracking.
- **Render Ready**: Pre-configured for deployment on Render.com (Backend) and Vercel (Frontend).

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account (for cloud persistence)
- Twilio account (optional for simulation mode)

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   ```

2. Install root dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables in `backend/.env`:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_atlas_uri
   TWILIO_ACCOUNT_SID=your_sid
   TWILIO_AUTH_TOKEN=your_token
   TWILIO_PHONE_NUMBER=whatsapp:your_number
   ```

### Running Locally

Use the root-level scripts to manage both services simultaneously:

```bash
# Start both Frontend & Backend
npm run dev

# Start only Backend
npm run dev:backend

# Start only Frontend
npm run dev:frontend
```

## 🛠️ Technology Stack

- **Frontend**: React, Tailwind CSS, Lucide Icons, Axios.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB with Mongoose.
- **API**: Twilio WhatsApp API.

## 📁 Project Structure

- `frontend/`: React application with styling and components.
- `backend/`: Express server, controllers, and MongoDB models.
- `twilio-api/`: Helper service for Twilio integrations.

## 🌐 API Configuration

The frontend is configured to connect to the Render-hosted backend by default. You can modify this in `frontend/src/api.js`.

Current Backend: `https://twilio11-1.onrender.com/api`

---
*Created with ❤️ for professional Saas dashboards.*
