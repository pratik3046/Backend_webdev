# Email Templates Documentation

## Overview
This directory contains professional, responsive email templates for Web Dev Hub. All templates feature:

- 🎨 Modern gradient design with pink/purple branding
- 📱 Fully responsive (mobile-friendly)
- 🔤 Inter font family for clean typography
- ✨ Professional styling with hover effects
- 🌐 Cross-client compatibility

## Available Templates

### 1. Custom Reply Template
**Function:** `getCustomReplyTemplate(contactData, replyMessage)`
**Usage:** Admin responses to contact form submissions
**Preview:** `GET /api/preview-email/custom-reply`

### 2. Auto Reply Template  
**Function:** `getAutoReplyTemplate({ name, email, subject, message })`
**Usage:** Automatic confirmation when users submit contact form
**Preview:** `GET /api/preview-email/auto-reply`

### 3. Admin Notification Template
**Function:** `getAdminNotificationTemplate({ name, email, subject, message })`
**Usage:** Notify admin of new contact form submissions
**Preview:** `GET /api/preview-email/admin-notification`

### 4. Welcome Email Template
**Function:** `getWelcomeEmailTemplate(userEmail, username)`
**Usage:** Welcome new users after registration
**Preview:** `GET /api/preview-email/welcome`

### 5. Comment Notification Template
**Function:** `getCommentNotificationTemplate(postAuthorEmail, commenterName, postTitle)`
**Usage:** Notify blog post authors of new comments
**Preview:** `GET /api/preview-email/comment-notification`

### 6. Forum Reply Notification Template
**Function:** `getForumReplyNotificationTemplate(threadAuthorEmail, replierName, threadTitle)`
**Usage:** Notify forum thread authors of new replies
**Preview:** `GET /api/preview-email/forum-reply`

## Template Features

### Design Elements
- **Header:** Gradient background with Web Dev Hub branding
- **Content:** Clean typography with proper spacing
- **Highlight Boxes:** Important information with colored borders
- **Buttons:** Gradient call-to-action buttons with hover effects
- **Footer:** Consistent branding and social links

### Responsive Design
- Mobile-optimized layout
- Scalable fonts and spacing
- Touch-friendly button sizes
- Proper viewport handling

### Email Client Compatibility
- Gmail ✅
- Outlook ✅  
- Apple Mail ✅
- Yahoo Mail ✅
- Thunderbird ✅

## Usage Examples

```javascript
// Send custom reply
import emailTemplates from './templates/emailTemplates.js';

const html = emailTemplates.getCustomReplyTemplate({
  name: 'John Doe',
  email: 'john@example.com', 
  subject: 'Technical Question',
  message: 'How do I implement authentication?'
}, 'You can use JWT tokens for authentication...');

// Send welcome email
const welcomeHtml = emailTemplates.getWelcomeEmailTemplate(
  'user@example.com', 
  'Jane Developer'
);
```

## Testing Templates

Use the preview endpoints to test templates in browser:

- http://localhost:3000/api/preview-email/custom-reply
- http://localhost:3000/api/preview-email/auto-reply
- http://localhost:3000/api/preview-email/admin-notification
- http://localhost:3000/api/preview-email/welcome
- http://localhost:3000/api/preview-email/comment-notification
- http://localhost:3000/api/preview-email/forum-reply

## Customization

To modify templates:

1. Edit the template functions in `emailTemplates.js`
2. Update CSS styles in the `<style>` section
3. Test changes using preview endpoints
4. Restart server to apply changes

## Environment Variables

Templates use these environment variables:
- `FRONTEND_URL` - Link back to the website
- `EMAIL_FROM` - Sender email address
- `EMAIL_USER` - Fallback sender email

## Best Practices

1. **Keep it Simple:** Focus on clear, concise messaging
2. **Mobile First:** Always test on mobile devices
3. **Accessibility:** Use proper contrast and alt text
4. **Performance:** Optimize images and inline CSS
5. **Testing:** Preview templates before deployment