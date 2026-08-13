const express = require("express");
const router = express.Router();
const musicController = require("../controllers/music.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

//sequential running of fucntion and process
router.post(
  "/upload",
  authMiddleware.authArtist,
  upload.single("music"),
  musicController.createMusic,
);
router.post("/album", authMiddleware.authArtist, musicController.createAlbum);

router.get("/", authMiddleware.authUser, musicController.getAllMusics);
router.get("/albums", authMiddleware.authArtist, musicController.getAllAlbums);
router.get(
  "/albums/:albumId",
  authMiddleware.authUser,
  musicController.getAlbumById,
);
module.exports = router;
