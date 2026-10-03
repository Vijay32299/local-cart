import express from 'express';
import { apiRouter } from './routes/apiRoutes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Mount Backend API routes
app.use('/api', apiRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'LocalKart Backend API', timestamp: new Date().toISOString() });
});

export default app;
