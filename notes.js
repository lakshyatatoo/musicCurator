// ============================================================
// BACKEND STRUCTURE
// ============================================================

// Routes      → Define which API endpoint handles which request.
// Controllers → Define what happens when the endpoint is called.
// Models      → Define schema + interact with MongoDB.
// app.js      → Configures Express + mounts routes.
// server.js   → Starts server + connects DB.
// db.js       → Connects to MongoDB using Mongoose.

// Flow:
// Client
//   ↓
// server.js → starts server + DB connection
//   ↓
// app.js → Express configuration + routes
//   ↓
// routes → API endpoints
//   ↓
// controllers → request/response logic
//   ↓
// models → schema + DB operations
//   ↓
// MongoDB

// API prefix:
// /api/auth/register
// /api/auth/login

// ============================================================
// AUTHENTICATION
// ============================================================

// Registration:
// MongoDB automatically creates a unique _id for each user.

// Login:
// User can be found using username OR email.
// Password is checked against the stored hashed password.

// Password hashing:
// Plain password → bcrypt + salt → hashed password.
// Never store the plain password.

// JWT:
// JWT creates a token containing the user's MongoDB _id.
// Token → sent to client → stored in cookie.

// Cookie:
// Small data stored in browser.
// Browser automatically sends it with later requests.

// cookie-parser:
// Reads cookies → makes them available through req.cookies.

// Protected request:
// Cookie → token → jwt.verify()
//        ↓
// Valid token → decoded user id
//        ↓
// Find user in DB
//        ↓
// Check authorization
//        ↓
// Allow / reject request

// ============================================================
// AUTHORIZATION / ROLES
// ============================================================

// Role-based authentication:
// Different roles have different permissions.

// Enum:
// Allows only predefined values for a field.

// Example:
// role: "user" / "artist"

// Music creation:
// Only artists can create music.

// Album creation:
// Only artists can create albums.

// Artist access:
// Login → JWT token → cookie
//        ↓
// Artist middleware verifies token + artist role
//        ↓
// next() → request continues to controller
// OR
// unauthorized → request stops

// ============================================================
// MIDDLEWARE
// ============================================================

// Middleware runs between request and controller.

// Middleware can:
// 1. Read req data
// 2. Modify req data
// 3. Respond to the request
// 4. Pass request forward using next()

// next():
// Tells Express → middleware check passed,
// continue to the next function/handler.

// Artist middleware was created to avoid
// repeating artist-verification code in every route.

// ============================================================
// OTHER
// ============================================================

// $or:
// Matches if at least one condition is true.

// Existing user check:
// username OR email already exists.

// process.exit():
// Stops the Node.js process.

// Nodemon:
// Automatically restarts server when code changes.

//spotify cnnot bring all songs at ocne server will crash and user cannot load so we can limit
//or can skip then limit
//Pagination means splitting a large amount of data into smaller pages instead of sending everything at once.
// a logout created too but on porduction level a concept called token blacklisting is used to logout a user and that is done by storing the token in a database and then checking if the token is present in the database or not and if it is present then the user is logged out and if it is not present then the user is logged in.
 

// can be optmised more using redis by which the token can be stored in the redis database and then checked if the token is present in the redis database or not and if it is present then the user is logged out and if it is not present then the user is logged in.