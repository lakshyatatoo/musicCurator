function buildPrompt(musicProfile) {
  return `You are a music analysis assistant. Analyze the following Spotify listening profile and provide personalized insights and recommendations.

User Music Profile:
${JSON.stringify(musicProfile, null, 2)}

Provide your response as a valid JSON object with exactly this structure:
{
  "musicPersonality": "A 2-3 sentence description of the user's overall music personality and listening style",
  "dominantPreferences": {
    "primaryGenres": ["top 3 genres"],
    "moodDescription": "description of the overall mood/vibe of their music taste",
    "eraPreference": "description of whether they prefer newer or classic music"
  },
  "listeningEvolution": {
    "recentVsLongTerm": "analysis of how their recent listening differs from long-term preferences",
    "emergingInterests": ["new artists or genres they're exploring"],
    "consistentFavorites": ["artists/genres that remain constant"]
  },
  "observations": [
    "observation 1",
    "observation 2",
    "observation 3",
    "observation 4",
    "observation 5"
  ],
  "songRecommendations": [
    {"song": "Song Name", "artist": "Artist Name", "reason": "why this fits"},
    {"song": "Song Name", "artist": "Artist Name", "reason": "why this fits"},
    {"song": "Song Name", "artist": "Artist Name", "reason": "why this fits"},
    {"song": "Song Name", "artist": "Artist Name", "reason": "why this fits"},
    {"song": "Song Name", "artist": "Artist Name", "reason": "why this fits"},
    {"song": "Song Name", "artist": "Artist Name", "reason": "why this fits"},
    {"song": "Song Name", "artist": "Artist Name", "reason": "why this fits"},
    {"song": "Song Name", "artist": "Artist Name", "reason": "why this fits"},
    {"song": "Song Name", "artist": "Artist Name", "reason": "why this fits"},
    {"song": "Song Name", "artist": "Artist Name", "reason": "why this fits"}
  ],
  "artistRecommendations": [
    {"artist": "Artist Name", "reason": "why this artist fits their taste"},
    {"artist": "Artist Name", "reason": "why this artist fits their taste"},
    {"artist": "Artist Name", "reason": "why this artist fits their taste"},
    {"artist": "Artist Name", "reason": "why this artist fits their taste"},
    {"artist": "Artist Name", "reason": "why this artist fits their taste"}
  ]
}

Important rules:
- Do NOT recommend any songs or artists that already appear in the user's listening history
- All recommendations should be real, existing songs and artists
- Provide brief but specific reasons for each recommendation
- Return ONLY valid JSON, no additional text`;
}

async function analyzeWithLLM(musicProfile) {
  const apiKey = process.env.OPENCODE_API_KEY;

  if (!apiKey) {
    throw new Error("OPENCODE_API_KEY not configured");
  }

  const prompt = buildPrompt(musicProfile);
  const url = "https://opencode.ai/zen/go/v1/chat/completions";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "mimo-v2.5-pro",
      messages: [
        {
          role: "system",
          content:
            "You are a music analysis expert. Always respond with valid JSON only, no markdown formatting or additional text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 16000,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      `LLM API error: ${response.status} - ${errorData.error?.message || "Unknown error"}`,
    );
  }

  const data = await response.json();
  console.error("=== LLM RAW RESPONSE ===");
  console.error(JSON.stringify(data, null, 2));
  console.error("=== END ===");
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("No content in LLM response");
  }

  try {
    const cleanedContent = content.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleanedContent);
  } catch (parseError) {
    console.error("=== RAW LLM RESPONSE ===");
    console.error(content);
    console.error("=== END RESPONSE ===");
    throw new Error("Invalid JSON response from LLM");
  }
}

module.exports = { analyzeWithLLM };
