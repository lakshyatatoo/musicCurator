const jwt = require("jsonwebtoken");

async function authArtist(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorised access" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "artist") {
      return res.status(403).json({
        message:
          "Access denied. Only user with artist account can create music.",
      });
    }
    // property of req is being modified to add the decoded data from the token, which can be used in the next function in the route. This allows for passing data between middleware and route handlers without using global variables or other less secure methods.
    req.user = decoded; // to pass the decoded data to the next function in the route
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unauthorised access" });
  }
}
async function authUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorised access" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "user") {
      return res.status(403).json({
        message: "Access denied. Only valid users can access this resource.",
      });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Unauthorised access" });
  }
}

module.exports = { authArtist, authUser };
