// Packages & modules Import
import http from "http";
import express, { Express } from "express";
import mongoose from "mongoose";
import { allRoutes } from "./src/routes";
import dotenv from "dotenv";
dotenv.config();

const expressApp: Express = express();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const router = express.Router();

// Db Connetion
mongoose.connect(process.env.MONGO_DB_URL, {}, () => {
  console.log("connected to database");
});

/** Parse the request */
expressApp.use(express.urlencoded({ extended: false }));

/** Takes care of JSON data */
expressApp.use(express.json());

/** RULES OF OUR API */
expressApp.use((req, res, next) => {
  // set the CORS policy
  res.header("Access-Control-Allow-Origin", "*");
  // set the CORS headers
  res.header(
    "Access-Control-Allow-Headers",
    "origin, X-Requested-With,Content-Type,Accept, Authorization"
  );
  // set the CORS method headers
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET PATCH DELETE POST");
    return res.status(200).json({});
  }
  next();
});

/** Routes */
expressApp.use("/api/", allRoutes.userRouter);
expressApp.use("/api/", allRoutes.productRouter);
expressApp.use("/api/", allRoutes.orderRouter);

/** Error handling */
expressApp.use((req, res) => {
  const error = new Error("not found");
  return res.status(404).json({
    message: error.message,
  });
});

/** Server */
const httpServer = http.createServer(expressApp);
const PORT: string | number = process.env.PORT ?? 3000;
httpServer.listen(PORT, () =>
  console.log(`The server is running on port ${PORT}`)
);
