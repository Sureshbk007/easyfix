import express from "express";
import {
  GlobalErrorHandler,
  PageNotFound,
} from "./utils/GlobalErrorHandler.js";
import { AuthRouter } from "./routes/index.js";
const app = express();

app.use(express.urlencoded({ limit: "60kb", extended: true }));
app.use(
  express.json({
    limit: "60kb",
    extended: true,
  })
);

//Global Error handler middleware
app.use(GlobalErrorHandler);

app.use("/auth", AuthRouter);
//Page not found
app.use(PageNotFound);

export default app;
