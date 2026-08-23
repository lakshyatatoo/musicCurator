const express = require("express");
const router = express.Router();
const spotifyController = require("../controllers/spotify.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.get("/connect", authMiddleware.authUser, spotifyController.connect);
router.get("/callback", spotifyController.callback);
router.get("/analyze", authMiddleware.authUser, spotifyController.analyze);

module.exports = router;
