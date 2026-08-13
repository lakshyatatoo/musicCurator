const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

async function userRegister(req, res) {
  const { username, email, password, role = "user" } = req.body;

  const userExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });
  if (userExists) {
    return res.status(409).json({ message: "User already exists" });
  }

  const hash = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username,
    email,
    password: hash, //hashing the password
    role,
  });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
  );

  res.cookie("token", token);
  res.status(201).json({
    message: "User registered successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
}
async function userLogin(req, res) {
  const { username, email, password } = req.body;

  const user = await userModel.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    return res.status(401).json({ message: "Invalid username or email" });
  }
  //user const return sthe user that has any match from the given username or email
  // now we have some data of the user from above and we can compare its password
  const isPasswordValid = await bcrypt.compare(password, user.password); //password received from the login page and user password that exist
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid password" });
  }
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
  );
  res.cookie("token", token);
  res.status(200).json({
    message: "user logged in successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
}
async function userLogout(req, res) {
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out successfully" });
}

module.exports = { userRegister, userLogin, userLogout };
