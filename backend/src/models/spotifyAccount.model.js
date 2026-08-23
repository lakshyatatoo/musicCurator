const mongoose = require("mongoose");

const spotifyAccountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    unique: true,
  },
  spotifyAccountId: {
    type: String,
    required: true,
    unique: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  connectedAt: {
    type: Date,
    default: Date.now,
  },
});

const spotifyAccountModel = mongoose.model(
  "spotifyAccount",
  spotifyAccountSchema,
);

module.exports = spotifyAccountModel;
