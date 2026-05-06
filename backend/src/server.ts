import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import prisma from "./client";
import route from "./route";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use("/v1", route);

prisma
  .$connect()
  .then(() => {
    console.log("DB Connected successfully");
    app.listen(process.env.PORT, () => {
      console.log("Server listening on ", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log("DB connection issue ", error);
  });
