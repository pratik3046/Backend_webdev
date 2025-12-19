# Forum Backend API

A robust backend API for a MERN stack forum application with blog functionality, built with Express.js, MongoDB Atlas, and deployed on Vercel.

## 🚀 Quick Start

### Local Development

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
```bash
cp .env.example .env
# Edit .env with your MongoDB Atlas credentials
```

3. **Start development server:**
```bash
npm run dev
```

4. **Test the API:**
```bash
# Health check
curl http://localhost:3000/api/health

# Database status
curl http://localhost:3000/api/db-status
```

### Production Deployment (Vercel)

1. **Deploy to Vercel:**
```bash
npm i -g vercel
vercel login
vercel --prod
```

2. **Add environment variables in Vercel dashboard:**
   - Go to Project Settings → Environment Variables
   - Add all variables from the Environment Variables section below

3. **Test deployment:**
```bash
# Replace with your Vercel URL
curl https://your-app.vercel.app/api/health
```

## 🔧 Environment Variables

Create a `.env` file with these variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.example.mongodb.net/webdevhub?retryWrites=true&w=majority&appName=Cluster0

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random_at_least_32_characters_2024

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your_gmail_app_password_here
EMAIL_FROM=your-email@gmail.com
ADMIN_EMAIL=admin@yourdomain.com

# Optional: Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Optional: CORS Configuration
CORS_ORIGIN=http://localhost:5173,http://localhost:5174

# Optional: Session Configuration
SESSION_SECRET=your_session_secret_key_here_make_it_different_from_jwt
```

### 🔐 Security Setup

**Quick Setup:**
```bash
# Generate secure environment
npm run setup-env

# Check security configuration
npm run security-check
```

**Manual Setup:**
```bash
# Copy example file
cp .env.example .env

# Generate secure secrets
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(64).toString('hex'))"
node -e "console.log('SESSION_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

### 📋 MongoDB Atlas Setup

1. **Create MongoDB Atlas Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for free account

2. **Create Cluster:**
   - Choose FREE tier (M0 Sandbox)
   - Select region closest to your users
   - Name your cluster

3. **Create Database User:**
   - Go to "Database Access"
   - Add new user with "Read and write to any database"
   - Save username and password

4. **Configure Network Access:**
   - Go to "Network Access"
   - Add IP Address: "Allow Access from Anywhere" (0.0.0.0/0)
   - Required for Vercel deployment

5. **Get Connection String:**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy connection string and update MONGODB_URI

## 📁 Project Structure

```
forumpage-backend/
├── api/
│   └── index.js         # Vercel serverless entry point
├── middleware/
│   ├── auth.js          # JWT authentication middleware
│   └── validation.js    # Input validation middleware
├── models/
│   ├── User.js          # User schema and model
│   ├── BlogPost.js      # Blog post schema and model
│   ├── ForumThread.js   # Forum thread schema and model
│   └── Contact.js       # Contact form schema and model
├── routes/
│   ├── auth.js          # Authentication endpoints
│   ├── blog.js          # Blog CRUD operations
│   ├── forum.js         # Forum thread operations
│   ├── user.js          # User profile management
│   └── contact.js       # Contact form handling
├── services/
│   └── emailService.js  # Email sending functionality
├── scripts/
│   └── seedDatabase.js  # Database seeding utility
├── .env                 # Environment variables (gitignored)
├── .env.example         # Environment template
├── .gitignore           # Git ignore rules
├── vercel.json          # Vercel deployment configuration
├── package.json         # Dependencies and scripts
└── server.js            # Express app configuration
```

## 🛠 API Endpoints

### System Health
- `GET /api/health` - Server health check (no auth required)
- `GET /api/test` - Basic connectivity test (no auth required)
- `GET /api/db-status` - Database connection status (no auth required)

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user profile (🔒 protected)
- `GET /api/auth/verify` - Verify JWT token (🔒 protected)
- `POST /api/auth/logout` - User logout (🔒 protected)

### Blog Posts (`/api/blog`)
- `GET /api/blog` - Get all blog posts (paginated)
- `GET /api/blog/:id` - Get single blog post
- `POST /api/blog` - Create new blog post (🔒 protected)
- `PUT /api/blog/:id` - Update blog post (🔒 protected)
- `DELETE /api/blog/:id` - Delete blog post (🔒 protected)
- `POST /api/blog/:id/comments` - Add comment (🔒 protected)
- `DELETE /api/blog/:postId/comments/:commentId` - Delete comment (🔒 protected)

### Forum Threads (`/api/forum`)
- `GET /api/forum` - Get all forum threads (paginated)
- `GET /api/forum/:id` - Get single forum thread
- `POST /api/forum` - Create new thread (🔒 protected)
- `PUT /api/forum/:id` - Update thread (🔒 protected)
- `DELETE /api/forum/:id` - Delete thread (🔒 protected)
- `POST /api/forum/:id/replies` - Add reply (🔒 protected)
- `DELETE /api/forum/:threadId/replies/:replyId` - Delete reply (🔒 protected)
- `GET /api/forum/categories/list` - Get all categories

### User Management (`/api/user`)
- `GET /api/user/:id` - Get user profile
- `PUT /api/user/profile` - Update user profile (🔒 protected)
- `PUT /api/user/password` - Change password (🔒 protected)
- `GET /api/user/:id/posts` - Get user's blog posts
- `GET /api/user/:id/threads` - Get user's forum threads
- `DELETE /api/user/account` - Deactivate account (🔒 protected)

### Contact (`/api/contact`)
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contact submissions (🔒 protected)

## 📧 Email Service Configuration

The backend includes a comprehensive email service for notifications, welcome emails, and contact form responses.

### Email Setup

1. **Gmail Configuration (Recommended)**
   ```env
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=your-email@gmail.com
   ADMIN_EMAIL=admin@gmail.com
   ```

2. **Generate Gmail App Password**
   - Enable 2-Factor Authentication on your Gmail account
   - Go to Google Account Settings > Security > 2-Step Verification
   - Generate an "App Password" for "Mail"
   - Use this 16-character password as `EMAIL_PASS`

### Email Testing Endpoints

- `GET /api/test-email` - Test email connection
- `POST /api/send-test-email` - Send a test email
- `GET /api/preview-email/{type}` - Preview email templates

### Email Templates Available

1. **welcome** - New user welcome email
2. **auto-reply** - Contact form auto-reply
3. **admin-notification** - Contact form admin notification
4. **custom-reply** - Custom response to contact
5. **comment-notification** - New comment notification
6. **forum-reply** - Forum reply notification

### Troubleshooting Email Issues

**535 Authentication Failed Error:**
1. Verify Gmail 2FA is enabled
2. Generate a new App Password
3. Update `EMAIL_PASS` in environment variables
4. Ensure no spaces in the app password
5. Check that the Gmail account is not locked

**Connection Timeout:**
1. Verify `EMAIL_HOST` and `EMAIL_PORT` are correct
2. Check firewall settings
3. Ensure network allows SMTP connections

**Testing Email Service:**
```bash
# Test connection
curl https://your-backend-url/api/test-email

# Send test email
curl -X POST https://your-backend-url/api/send-test-email
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

```javascript
// Include token in Authorization header
headers: {
  'Authorization': 'Bearer <your_jwt_token>',
  'Content-Type': 'application/json'
}
```

**Token Details:**
- Expires after 7 days
- Required for all 🔒 protected endpoints
- Generated on successful login/register

## 📝 Request/Response Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Create Blog Post
```bash
POST /api/blog
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My First Blog Post",
  "content": "This is the content of my blog post...",
  "tags": ["technology", "programming"]
}
```

## ⚠️ Error Handling

The API returns consistent error responses:

```json
{
  "message": "Error description",
  "errors": [
    {
      "field": "fieldName",
      "msg": "Specific error message"
    }
  ]
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

## 🛡️ Security Features

- **Password Security**: bcrypt hashing (12 rounds)
- **Authentication**: JWT token-based auth
- **Input Validation**: express-validator sanitization
- **Rate Limiting**: 100 requests per 15 minutes (production), 1000 (development)
- **CORS Protection**: Configurable origins
- **Security Headers**: Helmet.js middleware
- **Environment Protection**: Sensitive data in environment variables
- **Database Security**: MongoDB Atlas with network access controls

### Security Best Practices

#### Environment Variables
```bash
# ✅ Good - Strong, unique secrets
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
SESSION_SECRET=z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0f9e8d7c6b5a4

# ❌ Bad - Weak, default secrets
JWT_SECRET=secret123
SESSION_SECRET=mysecret
```

#### Database Security



# ❌ Bad - Admin user or weak password
MONGODB_URI=mongodb+srv://admin:123456@cluster.mongodb.net/webdevhub
```

#### Email Security
```bash
# ✅ Good - App-specific password
EMAIL_PASS=abcd efgh ijkl mnop

# ❌ Bad - Account password
EMAIL_PASS=mypassword123
```

### Security Checklist

**Before Deployment:**
- [ ] All `.env` files are in `.gitignore`
- [ ] No hardcoded secrets in source code
- [ ] Strong JWT secret (64+ characters)
- [ ] Database user has minimal required permissions
- [ ] Email uses app-specific passwords
- [ ] CORS is configured for production domains only
- [ ] Rate limiting is enabled
- [ ] HTTPS is enforced in production

**Regular Maintenance:**
- [ ] Rotate JWT secrets periodically
- [ ] Update dependencies regularly
- [ ] Monitor for security vulnerabilities
- [ ] Review access logs
- [ ] Backup environment configurations securely

### What to Do If Secrets Are Exposed

**Immediate Actions:**
1. Rotate all exposed secrets immediately
2. Change database passwords
3. Regenerate JWT secrets
4. Update email app passwords
5. Review git history for exposed secrets

**Prevention:**
1. Use `.env.example` files for documentation
2. Never commit actual `.env` files
3. Use different secrets for each environment
4. Implement secret scanning in CI/CD
5. Regular security audits

## 📧 Email Templates

The backend includes professional, responsive email templates for all communications:

### Available Templates

1. **Custom Reply Template** - Admin responses to contact inquiries
2. **Auto Reply Template** - Instant confirmation for contact submissions
3. **Admin Notification Template** - Alerts for new contact messages
4. **Welcome Email Template** - Onboarding for new users
5. **Comment Notification Template** - Blog engagement notifications
6. **Forum Reply Template** - Community interaction alerts

### Email Template Features

- 🎨 Modern gradient design (pink/purple branding)
- 📱 Fully responsive (mobile-friendly)
- 🔤 Inter font family for clean typography
- ✨ Professional styling with hover effects
- 🌐 Cross-client compatibility (Gmail, Outlook, Apple Mail, etc.)

### Preview Email Templates

```bash
# Start the server
npm start

# Preview templates in browser
http://localhost:3000/api/preview-email/custom-reply
http://localhost:3000/api/preview-email/auto-reply
http://localhost:3000/api/preview-email/admin-notification
http://localhost:3000/api/preview-email/welcome
http://localhost:3000/api/preview-email/comment-notification
http://localhost:3000/api/preview-email/forum-reply
```

### Email Configuration

**Gmail Setup:**
1. Enable 2-Factor Authentication on your Google account
2. Generate App Password: Google Account → Security → App Passwords
3. Use the generated password in `EMAIL_PASS`

**Environment Variables:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your_16_character_app_password
EMAIL_FROM=your-email@gmail.com
ADMIN_EMAIL=admin@yourdomain.com
```

**Test Email Connection:**
```bash
curl http://localhost:3000/api/test-email
```

### Email Template Documentation

For detailed email template documentation, see:
- `templates/emailTemplates.js` - Template implementations
- `templates/README.md` - Complete template documentation

## Database Models

### User
- username (unique, 3-30 characters)
- email (unique, valid email format)
- password (hashed, min 6 characters)
- avatar (optional URL)
- bio (optional, max 500 characters)
- isActive (boolean)
- lastLogin (date)
- timestamps (createdAt, updatedAt)

### BlogPost
- title (required, max 200 characters)
- content (required)
- excerpt (auto-generated or custom, max 300 characters)
- image (optional URL)
- author (reference to User)
- comments (array of comment objects)
- tags (array of strings)
- isPublished (boolean)
- views (number)
- timestamps (createdAt, updatedAt)

### ForumThread
- title (required, max 200 characters)
- content (required)
- author (reference to User)
- replies (array of reply objects)
- category (string, default: "General")
- isPinned (boolean)
- isLocked (boolean)
- views (number)
- lastActivity (date)
- timestamps (createdAt, updatedAt)

## Testing

You can test the API using tools like:
- Postman
- Insomnia
- cURL
- Thunder Client (VS Code extension)

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Prepare for deployment:**
```bash
git add .
git commit -m "Ready for deployment"
git push
```

2. **Deploy to Vercel:**
```bash
npm i -g vercel
vercel login
vercel --prod
```

3. **Configure environment variables in Vercel:**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add all variables from the Environment Variables section
   - **Important**: Set `NODE_ENV=production`

4. **Test deployment:**
```bash
# Replace with your actual Vercel URL
curl https://your-app.vercel.app/api/health
curl https://your-app.vercel.app/api/db-status
```

### Production Checklist

- ✅ MongoDB Atlas cluster created and configured
- ✅ Database user created with proper permissions
- ✅ Network access allows connections from anywhere (0.0.0.0/0)
- ✅ Environment variables set in Vercel dashboard
- ✅ `NODE_ENV=production` in Vercel
- ✅ `FRONTEND_URL` updated to production domain
- ✅ Strong `JWT_SECRET` (minimum 32 characters)
- ✅ Gmail App Password configured for email service

## 🧪 Testing

### Local Testing
```bash
# Start development server
npm run dev

# Test endpoints
curl http://localhost:3000/api/health
curl http://localhost:3000/api/test
curl http://localhost:3000/api/db-status
```

### Production Testing
```bash
# Test basic connectivity
curl https://your-app.vercel.app/api/health

# Test database connection
curl https://your-app.vercel.app/api/db-status

# Test API endpoint
curl -X POST https://your-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

## 🐛 Troubleshooting

### Deployment Issues

**Function Timeout Error:**
- Check MongoDB Atlas connection string
- Verify network access settings (0.0.0.0/0)
- Ensure environment variables are set in Vercel
- Check Vercel function logs

**Module Not Found:**
- Verify all imports use `.js` extensions
- Check `package.json` has `"type": "module"`
- Ensure all route files exist

**Environment Variables:**
- Add variables in Vercel dashboard, not in code
- Redeploy after adding environment variables
- Check variable names match exactly

### Database Issues

**Connection Timeout:**
- Verify MongoDB Atlas cluster is running
- Check connection string format
- Ensure network access allows Vercel IPs

**Authentication Failed:**
- Check username/password in connection string
- Verify database user permissions
- Test connection string locally first

### API Issues

**CORS Errors:**
- Update `FRONTEND_URL` to match your frontend domain
- Check CORS configuration in server.js

**Authentication Errors:**
- Verify `JWT_SECRET` is set and consistent
- Check token format in Authorization header
- Ensure token hasn't expired (7 days)

## 📊 Performance & Monitoring

### Serverless Optimization
- Connection pooling configured for serverless
- Database connections reused across requests
- Optimized timeouts for Vercel functions
- Memory allocation: 1024MB
- Function timeout: 60 seconds

### Monitoring
- Health check endpoint: `/api/health`
- Database status: `/api/db-status`
- Vercel function logs available in dashboard
- Rate limiting prevents abuse

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Related Links

- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Vercel Documentation](https://vercel.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [JWT.io](https://jwt.io/)

---

**Built with ❤️ using Express.js, MongoDB Atlas, and deployed on Vercel**


## 🎉 Production Deployment

**✅ Backend is live and operational!**

- **Production URL:** https://backend-webdev-three.vercel.app
- **Frontend URL:** https://web-dev-hub-iota.vercel.app
- **Status:** Fully deployed and functional

### Quick Production Tests
```bash
# Test backend health
curl https://backend-webdev-three.vercel.app/api/health

# Test email system
curl https://backend-webdev-three.vercel.app/api/test-email

# View email templates
https://backend-webdev-three.vercel.app/api/preview-email/welcome
```

### Production Features
- ✅ MongoDB Atlas database connected
- ✅ JWT authentication working
- ✅ Email system configured
- ✅ CORS enabled for frontend
- ✅ Rate limiting active
- ✅ Security headers enabled
- ✅ Professional email templates
- ✅ Contact form with notifications

**🚀 Ready for production use!**
