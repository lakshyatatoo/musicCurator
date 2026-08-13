const { ImageKit } = require("@imagekit/nodejs");

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function uploadMusic(file) {
  const result = await imagekit.files.upload({
    file,
    fileName: "music_" + Date.now(),
    folder: "artist/music",
  });
  return result;
}

module.exports = {
  uploadMusic,
};
//a function is being exported but inside a object as a property. This is done to allow for future expansion of the module, where multiple functions or properties can be exported together in a single object. It also provides a clear namespace for the function, making it easier to import and use in other parts of the application.