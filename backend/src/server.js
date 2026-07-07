/**
 * Server Entry Point
 * Express application bootstrap with all middleware and route mounting.
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const config = require('./config');
const connectDatabase = require('./config/database.config');
const { createTransporter } = require('./config/mail.config');
const routes = require('./routes');
const errorMiddleware = require('./middlewares/error.middleware');
const { apiLimiter } = require('./middlewares/rate-limiter.middleware');

// Initialize Express
const app = express();

// ──────────────────────────────────────────────
// Global Middleware
// ──────────────────────────────────────────────

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Request logging
if (config.isDev) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parsing
app.use(cookieParser());

// Rate limiting (general)
app.use('/api', apiLimiter);

// ──────────────────────────────────────────────
// Routes
// ──────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Enterprise Workforce Management Platform API is running',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// Mount all API routes
app.use('/api', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    errorCode: 'ROUTE_NOT_FOUND',
  });
});

// Global error handler (must be last)
app.use(errorMiddleware);

// ──────────────────────────────────────────────
// Server Start
// ──────────────────────────────────────────────

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDatabase();

    // Initialize email transporter
    await createTransporter();

    // Start server
    app.listen(config.port, () => {
      console.log('\n╔══════════════════════════════════════════════════════════╗');
      console.log('║  Enterprise Workforce Management Platform               ║');
      console.log('╠══════════════════════════════════════════════════════════╣');
      console.log(`║  🚀 Server running on port ${config.port}                        ║`);
      console.log(`║  🌍 Environment: ${config.nodeEnv.padEnd(39)}║`);
      console.log(`║  📡 API: http://localhost:${config.port}/api                     ║`);
      console.log(`║  ❤️  Health: http://localhost:${config.port}/api/health              ║`);
      console.log('╚══════════════════════════════════════════════════════════╝\n');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
