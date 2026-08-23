const spotifyAccountModel = require("../models/spotifyAccount.model");

const SPOTIFY_API_BASE = "https://api.spotify.com/v1";
const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";

async function getValidAccessToken(userId) {
  const account = await spotifyAccountModel.findOne({ user: userId });

  if (!account) {
    throw new Error("Spotify account not connected");
  }

  if (new Date() < account.expiresAt) {
    return account.accessToken;
  }

  const response = await fetch(SPOTIFY_TOKEN_URL, {
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
      grant_type: "refresh_token",
      refresh_token: account.refreshToken,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh Spotify token");
  }

  const data = await response.json();
  const { access_token, expires_in } = data;

  account.accessToken = access_token;
  account.expiresAt = new Date(Date.now() + expires_in * 1000);
  await account.save();

  return access_token;
}

async function fetchSpotifyEndpoint(userId, endpoint, params = {}) {
  const accessToken = await getValidAccessToken(userId);

  const url = new URL(`${SPOTIFY_API_BASE}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `Spotify API error: ${response.status} - ${errorData.error?.message || "Unknown error"}`,
    );
  }

  return response.json();
}

async function getTopTracks(userId, timeRange = "medium_term", limit = 50) {
  return fetchSpotifyEndpoint(userId, "/me/top/tracks", {
    time_range: timeRange,
    limit,
    offset: 0,
  });
}

async function getTopArtists(userId, timeRange = "medium_term", limit = 50) {
  return fetchSpotifyEndpoint(userId, "/me/top/artists", {
    time_range: timeRange,
    limit,
    offset: 0,
  });
}

async function getRecentlyPlayed(userId, limit = 50) {
  return fetchSpotifyEndpoint(userId, "/me/player/recently-played", {
    limit,
  });
}

async function getUserProfile(userId) {
  return fetchSpotifyEndpoint(userId, "/me");
}

module.exports = {
  getTopTracks,
  getTopArtists,
  getRecentlyPlayed,
  getUserProfile,
};
