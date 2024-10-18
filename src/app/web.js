import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import errorMiddleware from "../middlewares/error-middleware.js";
import publicRouter from "..//routers/public.js";
import privateRouter from "..//routers/private.js";

export const web = express();
web.set("trust proxy", true);
web.use(cors());
web.use(cookieParser());
web.use(bodyParser.json());

web.use(publicRouter);
web.use(privateRouter);

web.use(errorMiddleware.notFound);
web.use(errorMiddleware.handleError);
