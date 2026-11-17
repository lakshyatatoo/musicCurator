# musicCurator 🎧
### Spotify Music Analyzer & AI-Powered Recommendation System

musicCurator is a backend-focused music analytics application that connects to users' Spotify accounts, analyzes their listening history, and generates personalized music insights and recommendations using an LLM API.

The application combines Spotify's Web API with data processing and LLM-powered analysis to turn raw listening activity into meaningful insights about a user's music taste.

## ✨ Features

- **User Authentication:** User registration and login with JWT-based authentication.
- **Spotify OAuth 2.0:** Securely connect individual Spotify accounts.
- **Listening Data Collection:** Fetch top tracks, top artists, and recently played tracks.
- **Multi-Period Analysis:** Compare listening preferences across short-term, medium-term, and long-term periods.
- **Music Profile Generation:** Process raw Spotify responses into structured analytics.
- **Genre Distribution:** Identify dominant music genres and their distribution.
- **Listening Diversity:** Measure track overlap and consistency across different listening periods.
- **Listening Evolution:** Identify emerging artists, fading interests, and consistent favorites.
- **LLM Integration:** Send processed Spotify data to an LLM API for contextual analysis.
- **Personalized Recommendations:** Generate song and artist recommendations based on listening preferences.
- **Structured AI Responses:** Generate machine-readable JSON containing music personality insights, observations, and recommendations.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Runtime | Node.js |
| Backend | Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| Music Data | Spotify Web API |
| OAuth | Spotify OAuth 2.0 |
| LLM Integration | OpenAI-compatible API via OpenCode Zen |
| Frontend | HTML, CSS, JavaScript |
| Development | Git, Postman, Nodemon |

## 🧠 How It Works

The application follows a multi-stage data processing and analysis pipeline.

1. **User Authentication:** Users register or log in, with JWT authentication handled through HTTP-only cookies.
2. **Spotify Connection:** Users authorize the application through Spotify OAuth 2.0.
3. **Data Collection:** The backend fetches the user's top 50 tracks and artists across three listening periods, along with recently played tracks.
4. **Data Processing:** Raw Spotify responses are processed into a structured music profile containing genre distribution, listening diversity, top artists, tracks, and listening trends.
5. **LLM Analysis:** The processed profile is supplied to an LLM through a dynamically constructed prompt.
6. **Response Generation:** The LLM generates personalized music insights and recommendations in a predefined JSON structure.
7. **API Response:** The backend returns both the processed music profile and the generated AI analysis.

## 🤖 LLM Integration

The application integrates an LLM API to interpret structured Spotify listening data and generate personalized insights.

Instead of directly sending raw API responses to the model, the application first processes the data into a compact music profile.

The generated prompt instructs the model to return structured JSON containing:

- **Music Personality:** An interpretation of the user's overall listening style.
- **Dominant Preferences:** Primary genres, musical mood, and era preferences.
- **Listening Evolution:** Differences between recent and long-term preferences.
- **Observations:** Interesting patterns identified in the user's listening history.
- **Song Recommendations:** Ten personalized song recommendations with explanations.
- **Artist Recommendations:** Five artists suited to the user's musical preferences.

The integration also includes response parsing and JSON validation to ensure the generated output can be consumed programmatically.

## 📊 Music Analytics

The application calculates several metrics before passing the processed profile to the LLM:

| Metric | Description |
|---|---|
| Genre Distribution | Frequency and percentage distribution of artist genres |
| Listening Diversity | Unique tracks and overlap across listening periods |
| Overall Consistency | Track preference overlap across different periods |
| Emerging Artists | Artists appearing in recent preferences but not long-term preferences |
| Fading Artists | Artists appearing in long-term preferences but not recent preferences |
| Consistent Artists | Artists appearing in both recent and long-term preferences |
| Average Popularity | Average popularity score of recently played tracks |

## 📁 Project Structure

```text
backend/
├── public/
│   └── index.html
│
├── src/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── spotify.controller.js
│   │
│   ├── db/
│   │   └── db.js
│   │
│   ├── middlewares/
│   │   └── auth.middleware.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   └── spotifyAccount.model.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── spotify.routes.js
│   │
│   ├── services/
│   │   ├── spotify.service.js
│   │   ├── musicAnalysis.service.js
│   │   └── llm.service.js
│   │
│   └── app.js
│
├── .env.example
├── package.json
├── server.js
└── test.js
```

## ⚙️ Getting Started

### Prerequisites

- Node.js
- MongoDB
- Spotify Developer Account
- API key for the configured LLM provider

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd <repository-name>/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend` directory.

```env
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/api/spotify/callback

OPENCODE_API_KEY=your_llm_api_key
```

### 4. Configure Spotify OAuth

1. Visit the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Create a Spotify application.
3. Obtain your Client ID and Client Secret.
4. Add the following Redirect URI to your Spotify application:

```text
http://127.0.0.1:3000/api/spotify/callback
```

5. Add the credentials to your `.env` file.

### 5. Run the Application

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The application runs at:

```text
http://localhost:3000
```

## 🔗 API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Authenticate an existing user |
| POST | `/api/auth/logout` | Log out the current user |

### Spotify

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/spotify/connect` | Generate Spotify authorization URL |
| GET | `/api/spotify/callback` | Handle Spotify OAuth callback |
| GET | `/api/spotify/analyze` | Fetch, process, and analyze listening data |

**Note:** Spotify connection and analysis endpoints require an authenticated application user.

## 🔐 Authentication & Token Management

- JWT-based user authentication.
- Password hashing using bcryptjs.
- HTTP-only cookies for authentication tokens.
- Spotify access and refresh tokens stored in MongoDB.
- Automatic Spotify access-token refresh when expired.
- Individual Spotify accounts linked to application users.

## 🔮 Future Improvements

- Interactive frontend dashboard for music analytics.
- Conversational AI interface with contextual follow-up questions.
- More advanced listening pattern analysis.
- Improved recommendation validation and ranking.
- Enhanced visualizations for listening trends.

## 📌 Project Scope

This project focuses on backend development, third-party API integration, OAuth authentication, data processing, and LLM-powered application development.

It demonstrates how external APIs and existing language models can be integrated into a backend application to transform user-specific data into structured, personalized insights.

---

**Built with Node.js, Express.js, MongoDB, Spotify Web API, and LLM integration.**
