const BASE_URL = "http://localhost:3000";
const COOKIE_JAR = {};

async function request(method, path, body = null) {
  const url = `${BASE_URL}${path}`;
  const headers = {
    "Content-Type": "application/json",
    Cookie: Object.entries(COOKIE_JAR)
      .map(([k, v]) => `${k}=${v}`)
      .join("; "),
  };

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(url, options);
  const data = await res.json();

  const setCookie = res.headers.get("set-cookie");
  if (setCookie) {
    setCookie.split(",").forEach((cookie) => {
      const [nameValue] = cookie.split(";");
      const [name, value] = nameValue.split("=");
      COOKIE_JAR[name.trim()] = value.trim();
    });
  }

  return { status: res.status, data };
}

async function testRegister() {
  console.log("\n1. Registering user...");
  const res = await request("POST", "/api/auth/register", {
    username: "testuser",
    email: "test@example.com",
    password: "password123",
  });
  console.log(`   Status: ${res.status}`);
  console.log(`   Response:`, res.data);
  return res.status === 201;
}

async function testLogin() {
  console.log("\n2. Logging in...");
  const res = await request("POST", "/api/auth/login", {
    username: "testuser",
    password: "password123",
  });
  console.log(`   Status: ${res.status}`);
  console.log(`   Response:`, res.data);
  return res.status === 200;
}

async function testSpotifyConnect() {
  console.log("\n3. Getting Spotify auth URL...");
  const res = await request("GET", "/api/spotify/connect");
  console.log(`   Status: ${res.status}`);
  if (res.data.authUrl) {
    console.log(`   Auth URL: ${res.data.authUrl}`);
    console.log("\n   >>> Open this URL in your browser to authorize <<<");
    console.log("   >>> After authorizing, you'll be redirected back <<<");
  }
  return res.data.authUrl;
}

async function testAnalyze() {
  console.log("\n4. Running analysis...");
  const res = await request("GET", "/api/spotify/analyze");
  console.log(`   Status: ${res.status}`);
  if (res.status === 200) {
    console.log(`   Profile stats:`, res.data.profile?.stats);
    console.log(`   Top genre:`, res.data.profile?.stats?.topGenre);
    console.log(`   Music personality:`, res.data.analysis?.musicPersonality?.substring(0, 100) + "...");
  } else {
    console.log(`   Response:`, res.data);
  }
  return res.status === 200;
}

async function testLogout() {
  console.log("\n5. Logging out...");
  const res = await request("POST", "/api/auth/logout");
  console.log(`   Status: ${res.status}`);
  console.log(`   Response:`, res.data);
}

async function runTests() {
  console.log("=== Spotify Music Analyzer Test ===");
  console.log("Make sure server is running on port 3000\n");

  try {
    const registered = await testRegister();
    if (!registered) {
      console.log("\nRegistration failed. User might already exist. Trying login...");
    }

    const loggedIn = await testLogin();
    if (!loggedIn) {
      console.log("\nLogin failed. Check credentials.");
      return;
    }

    const authUrl = await testSpotifyConnect();
    if (!authUrl) {
      console.log("\nFailed to get auth URL.");
      return;
    }

    console.log("\n--- Waiting for Spotify authorization ---");
    console.log("After authorizing in browser, press Enter here to continue...");
    
    await new Promise((resolve) => {
      process.stdin.once("data", resolve);
    });

    const analyzed = await testAnalyze();
    if (analyzed) {
      console.log("\n=== Analysis complete! ===");
    }

    await testLogout();
  } catch (error) {
    console.error("\nError:", error.message);
  }

  process.exit(0);
}

runTests();
