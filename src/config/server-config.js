const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    SALT_ROUNDS: process.env.SALT_ROUNDS,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    JWT_EXPIRY: process.env.JWT_EXPIRY,
    FLIGHT_SERVICE_URL: process.env.FLIGHT_SERVICE_URL,
    BOOKING_SERVICE_URL: process.env.BOOKING_SERVICE_URL,
}