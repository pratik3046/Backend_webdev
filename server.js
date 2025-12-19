import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import blogRoutes from './routes/blog.js';
import forumRoutes from './routes/forum.js';
import userRoutes from './routes/user.js';
import contactRoutes from './routes/contact.js';

// Load environment variables
dotenv.config();

// Catch uncaught exceptions to prevent silent crashes
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting - More lenient for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Higher limit for development
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration - Allow multiple origins for development
app.use(cors({
  origin: true, // Allow all origins for development
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection with serverless optimization
let isConnected = false;

async function connectToMongoDB() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    // Optimized connection settings for serverless
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
      bufferCommands: false // Disable mongoose buffering
    });

    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    isConnected = false;
    throw error;
  }
}

// Middleware to ensure MongoDB connection
app.use(async (req, res, next) => {
  // Skip database connection for health and test endpoints
  if (req.path === '/api/health' || req.path === '/api/test' || !process.env.MONGODB_URI) {
    return next();
  }

  try {
    await connectToMongoDB();
    next();
  } catch (error) {
    console.error('Database connection failed:', error);
    res.status(500).json({
      message: 'Database connection failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Service temporarily unavailable'
    });
  }
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/user', userRoutes);
app.use('/api/contact', contactRoutes);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    message: 'Welcome to the Blog Backend API',
    status: 'Running',
    documentation: '/api/health'
  });
});

// Health check endpoint (no DB required)
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Test endpoint (no DB required)
app.get('/api/test', (_req, res) => {
  res.json({
    status: 'OK',
    message: 'Test endpoint working',
    timestamp: new Date().toISOString(),
    hasMongoUri: !!process.env.MONGODB_URI
  });
});

// Test email endpoint
app.get('/api/test-email', async (_req, res) => {
  try {
    const { testEmailConnection } = await import('./services/emailService.js');
    const result = await testEmailConnection();
    
    res.json({
      status: 'OK',
      message: 'Email test completed',
      emailConfig: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER ? '***@' + process.env.EMAIL_USER.split('@')[1] : 'Not set',
        hasPassword: !!process.env.EMAIL_PASS
      },
      result
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Email test failed',
      error: error.message
    });
  }
});

// Send test email endpoint
app.post('/api/send-test-email', async (req, res) => {
  try {
    const { sendAutoReplyToUser } = await import('./services/emailService.js');
    const testData = {
      name: 'Test User',
      email: process.env.EMAIL_USER, // Send to self for testing
      subject: 'Email System Test',
      message: 'This is a test email to verify the email system is working correctly.'
    };
    
    const result = await sendAutoReplyToUser(testData);
    
    res.json({
      status: 'OK',
      message: 'Test email sent',
      result
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Test email failed',
      error: error.message
    });
  }
});

// Preview email templates endpoint
app.get('/api/preview-email/:type', async (req, res) => {
  try {
    const { default: emailTemplates } = await import('./templates/emailTemplates.js');
    const { type } = req.params;
    
    let html = '';
    
    switch (type) {
      case 'welcome':
        html = emailTemplates.getWelcomeEmailTemplate('user@example.com', 'John Developer');
        break;
      case 'auto-reply':
        html = emailTemplates.getAutoReplyTemplate({
          name: 'Jane Smith',
          email: 'jane@example.com',
          subject: 'Question about React Hooks',
          message: 'Hi, I have a question about using React Hooks in my project. Could you help me understand the best practices?'
        });
        break;
      case 'admin-notification':
        html = emailTemplates.getAdminNotificationTemplate({
          name: 'Mike Johnson',
          email: 'mike@example.com',
          subject: 'Partnership Inquiry',
          message: 'Hello, I am interested in partnering with Web Dev Hub for our upcoming developer conference. Please let me know if this is something you would be interested in discussing.'
        });
        break;
      case 'custom-reply':
        html = emailTemplates.getCustomReplyTemplate({
          name: 'Sarah Wilson',
          email: 'sarah@example.com',
          subject: 'Technical Support Request',
          message: 'I am having trouble with the authentication system in my React app. The JWT tokens seem to expire too quickly.'
        }, 'Thank you for reaching out! For JWT token expiration issues, you can adjust the expiration time in your backend configuration. I recommend setting it to 24 hours for better user experience. Here\'s a code example: jwt.sign(payload, secret, { expiresIn: \'24h\' }). Let me know if you need further assistance!');
        break;
      case 'comment-notification':
        html = emailTemplates.getCommentNotificationTemplate('author@example.com', 'Alex Developer', 'Understanding React Server Components');
        break;
      case 'forum-reply':
        html = emailTemplates.getForumReplyNotificationTemplate('thread-author@example.com', 'Emma Coder', 'Best Practices for API Design');
        break;
      default:
        return res.status(400).json({ error: 'Invalid template type' });
    }
    
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (error) {
    res.status(500).json({
      status: 'ERROR',
      message: 'Template preview failed',
      error: error.message
    });
  }
});



// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Export the Express app for Vercel serverless functions
export default app;

// Start server if run directly (Local Development)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    // Attempt to connect to DB locally
    if (process.env.MONGODB_URI) {
      try {
        await connectToMongoDB();
      } catch (error) {
        console.error('Failed to connect to MongoDB locally:', error);
      }
    }
  });
}
