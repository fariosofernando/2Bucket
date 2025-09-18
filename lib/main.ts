import express from "express";
import cors from "cors";
import auth from "./infra/middleware/auth";
import file_upload from "express-fileupload";
import RouterHandler from "./infra/interfaces/routes/route_handler";
import Controller from "./infra/interfaces/controllers/controller";
const v1 = "/v1/api/2bucket";

const env = process.env.SERVICE_ENV;
const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());
app.set("trust proxy", true);
app.use(
  cors({
    origin: "*",
  }),
);

const router = new RouterHandler(new Controller());
app.use(express.json());
app.use(
  file_upload({
    limits: { fileSize: 10 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: "/app/files",
  }),
);

app.use(v1, auth, router.handler);

app.listen(PORT, () => {
  console.info(
    `Service running on port ${PORT}, in ${env === "prod" ? "production" : "development"} environment.`,
  );
});
