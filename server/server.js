const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const connectDB = require('./config/db');
const seedAdmin = require('./config/seedAdmin');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();

const allowedOrigins = (process.env.CLIENT_ORIGINS || process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.length === 0) return callback(null, true);
    const normalizedOrigin = origin.replace(/\/$/, '');
    if (allowedOrigins.includes(normalizedOrigin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json({ limit: '12mb' }));

app.get('/ping', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/gallery', require('./routes/galleryRoutes'));
app.use('/api/before-after', require('./routes/beforeAfterRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/contact-requests', require('./routes/contactRoutes'));

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

const PORT = process.env.PORT || 5000;
const KEEP_ALIVE_INTERVAL_MS = 14 * 60 * 1000;

const normalizeUrl = (url) => {
  if (!url) return '';
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

const startKeepAlive = () => {
  const baseUrl = normalizeUrl(
    process.env.RENDER_EXTERNAL_URL || process.env.BACKEND_URL || ''
  );
  if (!baseUrl || process.env.NODE_ENV !== 'production') {
    return;
  }

  setInterval(async () => {
    try {
      await axios.get(`${baseUrl}/ping`);
    } catch (error) {
      console.warn('Keep-alive ping failed:', error?.message || error);
    }
  }, KEEP_ALIVE_INTERVAL_MS);
};

const startServer = async () => {
  await connectDB();
  await seedAdmin();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    startKeepAlive();
  });
};

startServer();
