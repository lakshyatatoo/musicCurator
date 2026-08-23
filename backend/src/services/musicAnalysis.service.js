function calculateGenreDistribution(artists) {
  const genreCounts = {};

  artists.forEach((artist) => {
    if (artist.genres && Array.isArray(artist.genres)) {
      artist.genres.forEach((genre) => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    }
  });

  const totalGenres = Object.values(genreCounts).reduce(
    (sum, count) => sum + count,
    0,
  );

  return Object.entries(genreCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 15)
    .map(([genre, count]) => ({
      genre,
      count,
      percentage: Math.round((count / totalGenres) * 100),
    }));
}

function extractTopArtists(artists, limit = 10) {
  return artists.slice(0, limit).map((artist, index) => ({
    rank: index + 1,
    name: artist.name,
    id: artist.id,
    genres: artist.genres?.slice(0, 3) || [],
    popularity: artist.popularity,
    followers: artist.followers?.total,
  }));
}

function extractTopTracks(tracks, limit = 10) {
  return tracks.slice(0, limit).map((track, index) => ({
    rank: index + 1,
    name: track.name,
    id: track.id,
    artist: track.artists?.[0]?.name || "Unknown",
    artistId: track.artists?.[0]?.id,
    album: track.album?.name,
    popularity: track.popularity,
    durationMs: track.duration_ms,
  }));
}

function calculateListeningDiversity(
  topTracksShort,
  topTracksMedium,
  topTracksLong,
) {
  const shortIds = new Set(topTracksShort.map((t) => t.id));
  const mediumIds = new Set(topTracksMedium.map((t) => t.id));
  const longIds = new Set(topTracksLong.map((t) => t.id));

  const shortMediumOverlap = [...shortIds].filter((id) =>
    mediumIds.has(id),
  ).length;
  const mediumLongOverlap = [...mediumIds].filter((id) =>
    longIds.has(id),
  ).length;
  const shortLongOverlap = [...shortIds].filter((id) => longIds.has(id)).length;

  const totalUnique = new Set([...shortIds, ...mediumIds, ...longIds]).size;

  return {
    totalUniqueTracks: totalUnique,
    shortTermVariety: Math.round(((50 - shortMediumOverlap) / 50) * 100),
    mediumTermStability: Math.round((mediumLongOverlap / 50) * 100),
    overallConsistency: Math.round(
      ((shortMediumOverlap + mediumLongOverlap + shortLongOverlap) / 150) * 100,
    ),
  };
}

function compareTimeRanges(topArtistsShort, topArtistsLong) {
  const shortNames = new Set(topArtistsShort.map((a) => a.name));
  const longNames = new Set(topArtistsLong.map((a) => a.name));

  const consistentArtists = [...shortNames].filter((name) =>
    longNames.has(name),
  );

  const emergingArtists = [...shortNames].filter(
    (name) => !longNames.has(name),
  );

  const fadingArtists = [...longNames].filter((name) => !shortNames.has(name));

  return {
    consistentArtists: consistentArtists.slice(0, 5),
    emergingArtists: emergingArtists.slice(0, 5),
    fadingArtists: fadingArtists.slice(0, 5),
  };
}

function calculateAveragePopularity(tracks) {
  if (!tracks || tracks.length === 0) return 0;
  const total = tracks.reduce((sum, track) => sum + (track.popularity || 0), 0);
  return Math.round(total / tracks.length);
}

function buildMusicProfile(spotifyData) {
  const {
    topTracksShort,
    topTracksMedium,
    topTracksLong,
    topArtistsShort,
    topArtistsMedium,
    topArtistsLong,
    recentlyPlayed,
  } = spotifyData;

  const genreDistribution = calculateGenreDistribution([
    ...topArtistsShort.items,
    ...topArtistsMedium.items,
    ...topArtistsLong.items,
  ]);

  const topArtists = extractTopArtists(topArtistsMedium.items);
  const topTracks = extractTopTracks(topTracksMedium.items);

  const listeningDiversity = calculateListeningDiversity(
    topTracksShort.items,
    topTracksMedium.items,
    topTracksLong.items,
  );

  const timeRangeComparison = compareTimeRanges(
    topArtistsShort.items,
    topArtistsLong.items,
  );

  const recentTracks =
    recentlyPlayed.items?.slice(0, 10).map((item) => ({
      name: item.track.name,
      artist: item.track.artists?.[0]?.name || "Unknown",
      playedAt: item.played_at,
    })) || [];

  const profile = {
    topArtists,
    topTracks,
    dominantGenres: genreDistribution.slice(0, 10),
    listeningDiversity,
    timeRangeComparison,
    recentListening: {
      lastPlayed: recentTracks,
      averagePopularity: calculateAveragePopularity(
        recentlyPlayed.items?.map((item) => item.track) || [],
      ),
    },
    stats: {
      totalTopArtists: topArtistsMedium.items.length,
      totalTopTracks: topTracksMedium.items.length,
      topGenre: genreDistribution[0]?.genre || "Unknown",
      topGenrePercentage: genreDistribution[0]?.percentage || 0,
    },
  };

  return profile;
}

module.exports = { buildMusicProfile };
