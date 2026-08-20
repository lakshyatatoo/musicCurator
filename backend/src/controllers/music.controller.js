const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { uploadMusic } = require("../services/storage.service");

async function createMusic(req, res) {
  const { title } = req.body;
  const file = req.file;
  if (!file) {
    return res.status(400).json({ message: "Music file is required" });
  }
  const updatedFile = await uploadMusic(file.buffer.toString("base64"));
  const music = await musicModel.create({
    uri: updatedFile.url,
    title,
    artist: req.user.id,
  });
  res.status(201).json({
    message: "Music created successfully",
    music: {
      id: music._id,
      uri: music.uri,
      title: music.title,
      artist: music.artist,
    },
  });
}
async function createAlbum(req, res) {
  const { title, musics } = req.body;
  const album = await albumModel.create({
    title,
    artist: req.user.id,
    musics: musics,
  });
  res.status(201).json({
    message: "Album created successfully",
    album: {
      id: album._id,
      title: album.title,
      artist: album.artist,
      musics: album.musics,
    },
  });
}
async function getAllMusics(req, res) {
  const musics = await musicModel
    .find()
    .limit(1) //.skip (1) // can be used to skip the first document and then limit can be used to limit the number of documents returned
    .populate("artist", "username email"); //.populate can be used to expand individual sections and what in those can also be specified
  res.status(200).json({
    message: "All musics fetched successfully",
    musics: musics,
  });
}
async function getAllAlbums(req, res) {
  const albums = await albumModel
    .find()
    .select("title artist")
    .populate("artist", "username email");

  res.status(200).json({
    message: "All albums fetched successfully",
    albums: albums,
  });
}

async function getAlbumById(req, res) {
  const albumId = req.params.albumId;
  const album = await albumModel
    .findById(albumId)
    .populate("artist", "username email")
    .populate("musics");
  if (!album) {
    return res.status(404).json({ message: "Album not found" });
  }
  res.status(200).json({
    message: "Album fetched successfully",
    album: album,
  });
}

module.exports = {
  createMusic,
  createAlbum,
  getAllMusics,
  getAllAlbums,
  getAlbumById,
};
