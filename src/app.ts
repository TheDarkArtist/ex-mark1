import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';

import routes from './routes';
import { ErrorHandler } from './middlewares/error-handler';
import { openApiDocument } from './openapi';

dotenv.config();

const app = express();

app.use(compression());

app.use(helmet());
app.use(express.json({ limit: '10mb' }));
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

app.get('/', (_req: Request, res: Response) => {
  res.status(200).send(
    `<html>
        <head><title>E‑Commerce API</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 2rem;">
          <h1>🚀 Welcome to ex-mark1 E‑Commerce API</h1>
          <p>Interactive docs → <a href="/api/docs">/api/docs</a></p>
          <p>OpenAPI spec → <code>/api/openapi.json</code></p>
        </body>
      </html>`,
  );
});

app.get('/api', (_req: Request, res: Response) => {
  res.status(200).json({
    name: 'E‑Commerce API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      docs: '/api/docs',
      openapi: '/api/openapi.json',
      v1: '/api/v1',
    },
  });
});

app.get('/api/v1', (_req: Request, res: Response) => {
  res.status(200).json({
    version: 'v1',
    resources: [
      'auth',
      'users',
      'products',
      'categories',
      'cart',
      'orders',
      'payment',
      'notifications',
      'reviews',
    ],
  });
});

app.use('/api', routes);

app.get('/api/openapi.json', (_req: Request, res: Response) => {
  res.status(200).json(openApiDocument);
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

app.use((_req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use(ErrorHandler.handle);

export default app;
