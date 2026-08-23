const spotifyAccountModel = require("../models/spotifyAccount.model");
const spotifyService = require("../services/spotify.service");
const { buildMusicProfile } = require("../services/musicAnalysis.service");
const { analyzeWithLLM } = require("../services/llm.service");
const crypto = require("crypto");

const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SCOPES = [
  "user-top-read",
  "user-read-recently-played",
  "user-read-private",
  "user-read-email",
];

function encodeState(userId) {
  const payload = JSON.stringify({ userId, nonce: crypto.randomBytes(8).toString("hex") });
  return Buffer.from(payload).toString("base64url");
}

function decodeState(state) {
  try {
    const payload = Buffer.from(state, "base64url").toString("utf-8");
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

async function connect(req, res) {
  const state = encodeState(req.user.id);

  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.SPOTIFY_CLIENT_ID,
    scope: SCOPES.join(" "),
    redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
    state: state,
    show_dialog: true,
  });

  const authUrl = `${SPOTIFY_AUTH_URL}?${params.toString()}`;

  res.status(200).json({ authUrl });
}

async function callback(req, res) {
  const { code, state, error } = req.query;

  if (error) {
    return res.status(400).json({ message: "Spotify authorization denied" });
  }

  if (!state) {
    return res.status(400).json({ message: "Missing state parameter" });
  }

  const stateData = decodeState(state);
  if (!stateData || !stateData.userId) {
    return res.status(403).json({ message: "Invalid state parameter" });
  }

  const userId = stateData.userId;

  try {
    const tokenResponse = await fetch(SPOTIFY_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
          ).toString("base64"),
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("Spotify token error:", errorData);
      return res
        .status(500)
        .json({ message: "Failed to exchange code for token" });
    }

    const tokenData = await tokenResponse.json();
    const { access_token, refresh_token, expires_in } = tokenData;

    const profileResponse = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!profileResponse.ok) {
      return res
        .status(500)
        .json({ message: "Failed to fetch Spotify profile" });
    }

    const profile = await profileResponse.json();
    const spotifyAccountId = profile.id;
    const expiresAt = new Date(Date.now() + expires_in * 1000);

    await spotifyAccountModel.findOneAndUpdate(
      { user: userId },
      {
        spotifyAccountId,
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt,
        connectedAt: new Date(),
      },
      { upsert: true, new: true },
    );

    res.status(200).json({
      message: "Spotify account connected successfully",
      spotifyProfile: {
        id: profile.id,
        displayName: profile.display_name,
        email: profile.email,
      },
    });
  } catch (error) {
    console.error("Spotify callback error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function analyze(req, res) {
  try {
    const userId = req.user.id;

    const spotifyAccount = await spotifyAccountModel.findOne({
      user: userId,
    });

    if (!spotifyAccount) {
      return res.status(400).json({
        message: "Spotify account not connected. Please connect first.",
      });
    }

    const [
      topTracksShort,
      topTracksMedium,
      topTracksLong,
      topArtistsShort,
      topArtistsMedium,
      topArtistsLong,
      recentlyPlayed,
    ] = await Promise.all([
      spotifyService.getTopTracks(userId, "short_term", 50),
      spotifyService.getTopTracks(userId, "medium_term", 50),
      spotifyService.getTopTracks(userId, "long_term", 50),
      spotifyService.getTopArtists(userId, "short_term", 50),
      spotifyService.getTopArtists(userId, "medium_term", 50),
      spotifyService.getTopArtists(userId, "long_term", 50),
      spotifyService.getRecentlyPlayed(userId, 50),
    ]);

    const musicProfile = buildMusicProfile({
      topTracksShort,
      topTracksMedium,
      topTracksLong,
      topArtistsShort,
      topArtistsMedium,
      topArtistsLong,
      recentlyPlayed,
    });

    const llmAnalysis = await analyzeWithLLM(musicProfile);

    res.status(200).json({
      message: "Music analysis completed successfully",
      profile: musicProfile,
      analysis: llmAnalysis,
    });
  } catch (error) {
    console.error("Analysis error:", error);
    res.status(500).json({ message: "Failed to analyze music data", error: error.message });
  }
}

module.exports = { connect, callback, analyze };
