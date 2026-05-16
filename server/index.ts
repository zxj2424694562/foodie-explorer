import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { join } from 'path';
import statusRouter from './routes/status.js';
import searchRouter from './routes/search.js';
import downloadRouter from './routes/download.js';
import notesRouter from './routes/notes.js';
import galleryRouter from './routes/gallery.js';
import queueRouter from './routes/queue.js';
import recommendRouter from './routes/recommend.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api', statusRouter);
app.use('/api', searchRouter);
app.use('/api', downloadRouter);
app.use('/api', notesRouter);
app.use('/api', galleryRouter);
app.use('/api', queueRouter);
app.use('/api', recommendRouter);

// Serve downloaded images
app.use('/api/images', express.static(join(process.cwd(), 'data', 'downloads'), {
  maxAge: '7d',
  setHeaders: (res, filepath) => {
    if (filepath.endsWith('.webp') || filepath.endsWith('.jpg') || filepath.endsWith('.jpeg')) {
      res.setHeader('Content-Type', 'image/webp');
    }
  },
}));

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Foodie Explorer backend running on http://localhost:${PORT}`);
});
