const express = require("express");
const rateLimit = require("express-rate-limit");
const { createProxyMiddleware } = require("http-proxy-middleware");

const { ServerConfig } = require("./config");
const apiRoutes = require("./routes");

const app = express();

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  limit: 9, // Limit each IP to 4 requests per `window` (here, per 2 minutes).
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter); // Apply the rate limiting middleware to all requests

// Reverse proxy to forward requests to flightsService
app.use(
  createProxyMiddleware({
    target: ServerConfig.FLIGHT_SERVICE_URL,
    changeOrigin: true,
    pathFilter: "/flightsService",
    pathRewrite: {
      "^/flightsService": "/",
    },
  })
);

/*
Use this or the above code to proxy requests to flightsService

app.use('/flightsService',createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true,
  }),
);
*/

// Reverse proxy to forward requests to bookingService
app.use(
  createProxyMiddleware({
    target: ServerConfig.BOOKING_SERVICE_URL,
    changeOrigin: true,
    pathFilter: "/bookingService",
    pathRewrite: {
      "^/bookingService": "/",
    },
  })
);

app.use("/api", apiRoutes);

app.listen(ServerConfig.PORT, () => {
  console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
});
