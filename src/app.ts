import express from "express";
import type { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import routes from './routes';
import { ErrorHandler } from "./middlewares/error-handler";

dotenv.config();

const app = express();

app.use(compression());

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', apiRateLimiter);

app.use('/api', routes);

app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

app.use((_req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use(ErrorHandler.handle);

export default app;

