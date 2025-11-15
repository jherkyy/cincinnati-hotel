# Elegant hotel website

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/albolerasjheryk24-1559s-projects/v0-elegant-hotel-website)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/dLNJjgYo6Jf)

## Overview

This repository will stay in sync with your deployed chats on [v0.app](https://v0.app).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Deployment

Your project is live at:

**[https://vercel.com/albolerasjheryk24-1559s-projects/v0-elegant-hotel-website](https://vercel.com/albolerasjheryk24-1559s-projects/v0-elegant-hotel-website)**

## Build your app

Continue building your app on:

**[https://v0.app/chat/dLNJjgYo6Jf](https://v0.app/chat/dLNJjgYo6Jf)**

## How It Works

1. Create and modify your project using [v0.app](https://v0.app)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## n8n Integration

The customer chat feature integrates with n8n workflows via webhooks. To enable this functionality:

1. Set up your n8n webhook URL as an environment variable:
   ```
   N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
   ```

2. The webhook should expect a JSON payload with:
   - `userId`: User identifier (currently "guest-user" placeholder)
   - `message`: The customer's message
   - `timestamp`: ISO string timestamp

3. The webhook should return a JSON response with the bot's reply. The response can be:
   - A string directly: `"Your bot response here"`
   - An object with a `message` property: `{"message": "Your bot response here"}`