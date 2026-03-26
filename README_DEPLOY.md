# 🚀 Production Deployment Guide

Follow these steps to deploy your backend and connect it to your frontend.

## 1. Set up MongoDB Atlas (Cloud Database)
Since the cloud does not save files, you need a database:
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register).
2.  Create a **Free Cluster**.
3.  Go to **Database Access** -> Add a new user (remember the password).
4.  Go to **Network Access** -> Add IP Address (`0.0.0.0/0` for "Allow access from anywhere").
5.  Go to **Clusters** -> Click **Connect** -> **Connect your application**.
6.  Copy the **Connection String** (URI).

## 2. Deploy Backend to Render.com
1.  Push this project to **GitHub**.
2.  Go to [Render.com](https://render.com) and sign in with GitHub.
3.  Click **New +** -> **Web Service**.
4.  Select this repository.
5.  **Build Command**: `npm install`
6.  **Start Command**: `npm start` (Make sure it points to the `backend/` directory or run from root).
7.  Go to **Environment** and add:
    *   `MONGO_URI`: (Your string from MongoDB Atlas)
    *   `TWILIO_ACCOUNT_SID`: (Your Twilio SID)
    *   `TWILIO_AUTH_TOKEN`: (Your Twilio Token)
    *   `TWILIO_PHONE_NUMBER`: (Your Twilio WhatsApp Number)
8.  Click **Deploy**. Copy the **URL** Render gives you (e.g., `https://my-backend.onrender.com`).

## 3. Update Frontend on Vercel
1.  Go to your **Vercel Dashboard** -> Your Project.
2.  Go to **Settings** -> **Environment Variables**.
3.  Edit `VITE_API_URL` and set it to your **Render URL** + `/api`.
    - Example: `https://my-backend.onrender.com/api`
4.  **Redeploy** on Vercel.

---
**Done!** Your system is now 100% online and works from any device.
