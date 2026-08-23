# Spotify Music Analyzer

A backend service that connects to users' Spotify accounts via OAuth, fetches their listening data, processes it into a statistical profile, and uses AI to provide personalized music analysis and recommendations.

## Features

- User registration and login with JWT authentication
- Spotify OAuth 2.0 Authorization Code Flow
- Fetch user's top tracks, artists, and recently played music
- Process raw Spotify data into compact music profile
- AI-powered music analysis using OpenAI
- Personalized song and artist recommendations

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose
- **Auth:** JWT, bcryptjs
- **External APIs:** Spotify Web API, OpenAI API

## Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js      # User login/register
│   │   └── spotify.controller.js   # Spotify OAuth & analysis
│   ├── db/
│   │   └── db.js                   # MongoDB connection
│   ├── middlewares/
│   │   └── auth.middleware.js       # JWT verification
│   ├── models/
│   │   ├── user.model.js           # User schema
│   │   └── spotifyAccount.model.js # Spotify tokens schema
│   ├── routes/
│   │   ├── auth.routes.js          # Auth endpoints
│   │   └── spotify.routes.js       # Spotify endpoints
│   ├── services/
│   │   ├── spotify.service.js      # Spotify API calls
│   │   ├── musicAnalysis.service.js # Data processing
│   │   └── llm.service.js          # OpenAI integration
│   └── app.js                      # Express app setup
├── .env.example
├── package.json
└── server.js
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Spotify
- `GET /api/spotify/connect` - Get Spotify OAuth URL
- `GET /api/spotify/callback` - OAuth callback (redirect URI)
- `GET /api/spotify/analyze` - Full music analysis pipeline

## Environment Variables

```
MONGO_URI=mongodb://localhost:27017/spotify-analyzer
JWT_SECRET=your-secret-key
SPOTIFY_CLIENT_ID=your-spotify-client-id
SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/api/spotify/callback
OPENAI_API_KEY=your-openai-api-key
```

## Flow

1. User registers/logs into the app
2. User clicks "Connect Spotify" → backend returns Spotify OAuth URL
3. User authorizes → Spotify redirects to callback
4. Backend stores Spotify tokens linked to user
5. User requests analysis → backend fetches Spotify data, processes it, sends to LLM
6. Backend returns structured analysis with recommendations
