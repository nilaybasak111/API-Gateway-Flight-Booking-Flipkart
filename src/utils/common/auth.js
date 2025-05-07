const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { ServerConfig } = require("../../config");

// This function is used to check if the password is correct or not
// It takes the plain password and the encrypted password as arguments
function checkPassword(plainPassword, encryptedPassword) {
  try {
    return bcrypt.compareSync(plainPassword, encryptedPassword);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// This function is used to create a JWT token
// It takes the input data as an argument and signs it with the secret key
function createToken(input) {
  try {
    return jwt.sign(input, ServerConfig.JWT_SECRET_KEY, {
      expiresIn: ServerConfig.JWT_EXPIRY,
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// This function is used to verify the JWT token
// It takes the token as an argument and verifies it with the secret key
function verifyToken(token) {
  try {
    return jwt.verify(token, ServerConfig.JWT_SECRET_KEY);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = { checkPassword, createToken, verifyToken };
