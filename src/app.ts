import express, { type NextFunction, type Request, type Response } from 'express';
import path from 'path';
import routes from './routes';
import { AppError } from './core/errors/AppError';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api', routes);

app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Route ${req.originalUrl} not found`, 404));
});

app.use(errorHandler);

export default app;
