// Professional Email Templates for Web Dev Hub

// Base template with modern design
const getBaseTemplate = (content, title = 'Web Dev Hub') => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #374151;
            background-color: #f9fafb;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
            padding: 40px 30px;
            text-align: center;
        }
        
        .header h1 {
            color: #ffffff;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            letter-spacing: -0.025em;
        }
        
        .header p {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            font-weight: 400;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 20px;
        }
        
        .message {
            font-size: 16px;
            line-height: 1.7;
            color: #374151;
            margin-bottom: 30px;
        }
        
        .highlight-box {
            background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
            border-left: 4px solid #ec4899;
            padding: 24px;
            border-radius: 8px;
            margin: 24px 0;
        }
        
        .highlight-box h3 {
            color: #111827;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 12px;
        }
        
        .highlight-box p {
            color: #4b5563;
            font-size: 15px;
            line-height: 1.6;
        }
        
        .original-message {
            background-color: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            margin: 24px 0;
        }
        
        .original-message h4 {
            color: #374151;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 12px;
        }
        
        .original-message-content {
            color: #6b7280;
            font-size: 14px;
            font-style: italic;
            line-height: 1.6;
        }
        
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%);
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px -1px rgba(236, 72, 153, 0.3);
        }
        
        .button:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 12px -1px rgba(236, 72, 153, 0.4);
        }
        
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        
        .footer p {
            color: #6b7280;
            font-size: 14px;
            margin-bottom: 8px;
        }
        
        .social-links {
            margin: 20px 0;
        }
        
        .social-links a {
            display: inline-block;
            margin: 0 8px;
            color: #6b7280;
            text-decoration: none;
            font-size: 14px;
        }
        
        .divider {
            height: 1px;
            background: linear-gradient(90deg, transparent 0%, #e5e7eb 50%, transparent 100%);
            margin: 30px 0;
        }
        
        @media only screen and (max-width: 600px) {
            .email-container {
                margin: 0;
                border-radius: 0;
            }
            
            .header, .content, .footer {
                padding: 30px 20px;
            }
            
            .header h1 {
                font-size: 24px;
            }
            
            .button {
                display: block;
                text-align: center;
                margin: 20px 0;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>WEB DEV HUB</h1>
            <p>Your Gateway to Modern Web Development</p>
        </div>
        
        <div class="content">
            ${content}
        </div>
        
        <div class="footer">
            <p><strong>Web Dev Hub</strong> - Empowering developers worldwide</p>
            <p>Stay updated with the latest in web development</p>
            
            <div class="social-links">
                <a href="#">Blog</a> • 
                <a href="#">Forum</a> • 
                <a href="#">Contact</a>
            </div>
            
            <div class="divider"></div>
            
            <p style="font-size: 12px; color: #9ca3af;">
                This email was sent from Web Dev Hub. If you have any questions, 
                please don't hesitate to contact us.
            </p>
        </div>
    </div>
</body>
</html>`;
};

// Custom Reply Template
export const getCustomReplyTemplate = (contactData, replyMessage) => {
  const content = `
    <div class="greeting">Hello ${contactData.name},</div>
    
    <div class="message">
        Thank you for reaching out to us. We've carefully reviewed your message and are pleased to provide you with a personalized response.
    </div>
    
    <div class="highlight-box">
        <h3>📝 Our Response</h3>
        <p>${replyMessage.replace(/\n/g, '<br>')}</p>
    </div>
    
    <div class="original-message">
        <h4>Your Original Message</h4>
        <p><strong>Subject:</strong> ${contactData.subject}</p>
        <div class="original-message-content">
            ${contactData.message.replace(/\n/g, '<br>')}
        </div>
    </div>
    
    <div class="divider"></div>
    
    <div class="message">
        We hope this response addresses your inquiry. If you have any follow-up questions or need further assistance, please don't hesitate to reach out to us again.
    </div>
    
    <div class="message">
        <strong>Best regards,</strong><br>
        The Web Dev Hub Team
    </div>
  `;
  
  return getBaseTemplate(content, `Re: ${contactData.subject} - Web Dev Hub`);
};

// Auto Reply Template
export const getAutoReplyTemplate = ({ name, email, subject, message }) => {
  const content = `
    <div class="greeting">Hello ${name},</div>
    
    <div class="message">
        Thank you for contacting Web Dev Hub! We've successfully received your message and wanted to confirm that it's now in our inbox.
    </div>
    
    <div class="highlight-box">
        <h3>✅ Message Received</h3>
        <p>We typically respond to all inquiries within 24-48 hours during business days. Our team will review your message carefully and get back to you with a detailed response.</p>
    </div>
    
    <div class="original-message">
        <h4>Your Message Summary</h4>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Sent from:</strong> ${email}</p>
        <div class="original-message-content">
            ${message.replace(/\n/g, '<br>')}
        </div>
    </div>
    
    <div class="message">
        In the meantime, feel free to explore our latest blog posts and join the discussions in our community forum.
    </div>
    
    <a href="${process.env.FRONTEND_URL }/blog" class="button">
        📚 Explore Our Blog
    </a>
    
    <div class="message">
        <strong>Thank you for being part of our community!</strong><br>
        The Web Dev Hub Team
    </div>
  `;
  
  return getBaseTemplate(content, `Thank you for contacting us - ${subject}`);
};

// Admin Notification Template
export const getAdminNotificationTemplate = ({ name, email, subject, message }) => {
  const timestamp = new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  const content = `
    <div class="greeting">New Contact Form Submission</div>
    
    <div class="message">
        A new message has been received through the Web Dev Hub contact form. Please review the details below and respond accordingly.
    </div>
    
    <div class="highlight-box">
        <h3>📧 Contact Details</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #ec4899;">${email}</a></p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Received:</strong> ${timestamp}</p>
    </div>
    
    <div class="original-message">
        <h4>Message Content</h4>
        <div style="color: #374151; font-style: normal; font-size: 15px; line-height: 1.6;">
            ${message.replace(/\n/g, '<br>')}
        </div>
    </div>
    
    <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subject)}" class="button">
        📧 Reply to ${name}
    </a>
    
    <div class="message">
        <strong>Action Required:</strong> Please respond to this inquiry within 24-48 hours to maintain our excellent customer service standards.
    </div>
  `;
  
  return getBaseTemplate(content, `New Contact: ${subject} - Web Dev Hub Admin`);
};

// Welcome Email Template
export const getWelcomeEmailTemplate = (userEmail, username) => {
  const content = `
    <div class="greeting">Welcome to Web Dev Hub, ${username}! 🎉</div>
    
    <div class="message">
        We're thrilled to have you join our community of passionate web developers. You're now part of a growing network of developers who are shaping the future of the web.
    </div>
    
    <div class="highlight-box">
        <h3>🚀 What You Can Do Now</h3>
        <p>
            • <strong>Create & Share:</strong> Write blog posts about your development journey<br>
            • <strong>Engage & Learn:</strong> Participate in forum discussions<br>
            • <strong>Connect & Grow:</strong> Network with fellow developers<br>
            • <strong>Stay Updated:</strong> Get the latest web development insights
        </p>
    </div>
    
    <a href="${process.env.FRONTEND_URL || 'https://web-dev-hub-iota.vercel.app'}/profile" class="button">
        🎯 Complete Your Profile
    </a>
    
    <div class="message">
        Ready to dive in? Start by exploring our latest blog posts or jump into a forum discussion. Our community is here to support you every step of the way.
    </div>
    
    <div class="message">
        <strong>Happy coding!</strong><br>
        The Web Dev Hub Team
    </div>
  `;
  
  return getBaseTemplate(content, 'Welcome to Web Dev Hub! 🎉');
};

// Comment Notification Template
export const getCommentNotificationTemplate = (postAuthorEmail, commenterName, postTitle) => {
  const content = `
    <div class="greeting">Great news! Your post got a new comment 💬</div>
    
    <div class="message">
        <strong>${commenterName}</strong> just commented on your blog post "<strong>${postTitle}</strong>". 
        Engagement like this shows your content is making an impact in the developer community!
    </div>
    
    <div class="highlight-box">
        <h3>📝 Post Activity</h3>
        <p><strong>Post:</strong> ${postTitle}</p>
        <p><strong>Commenter:</strong> ${commenterName}</p>
        <p><strong>Action:</strong> New comment added</p>
    </div>
    
    <a href="${process.env.FRONTEND_URL || 'https://web-dev-hub-iota.vercel.app'}/blog" class="button">
        👀 View Comment
    </a>
    
    <div class="message">
        Keep the conversation going! Respond to comments to build stronger connections with your readers and foster meaningful discussions.
    </div>
    
    <div class="message">
        <strong>Keep inspiring!</strong><br>
        The Web Dev Hub Team
    </div>
  `;
  
  return getBaseTemplate(content, `New Comment on "${postTitle}" - Web Dev Hub`);
};

// Forum Reply Notification Template
export const getForumReplyNotificationTemplate = (threadAuthorEmail, replierName, threadTitle) => {
  const content = `
    <div class="greeting">Your forum thread got a new reply! 🗨️</div>
    
    <div class="message">
        <strong>${replierName}</strong> just replied to your forum thread "<strong>${threadTitle}</strong>". 
        The discussion is heating up and your topic is generating valuable insights!
    </div>
    
    <div class="highlight-box">
        <h3>💬 Thread Activity</h3>
        <p><strong>Thread:</strong> ${threadTitle}</p>
        <p><strong>Replied by:</strong> ${replierName}</p>
        <p><strong>Action:</strong> New reply added</p>
    </div>
    
    <a href="${process.env.FRONTEND_URL || 'https://web-dev-hub-iota.vercel.app'}/forum" class="button">
        🔍 View Reply
    </a>
    
    <div class="message">
        Join the conversation! Reply back to keep the discussion active and help other developers learn from the exchange of ideas.
    </div>
    
    <div class="message">
        <strong>Keep the discussion alive!</strong><br>
        The Web Dev Hub Team
    </div>
  `;
  
  return getBaseTemplate(content, `New Reply in "${threadTitle}" - Web Dev Hub`);
};

export default {
  getCustomReplyTemplate,
  getAutoReplyTemplate,
  getAdminNotificationTemplate,
  getWelcomeEmailTemplate,
  getCommentNotificationTemplate,
  getForumReplyNotificationTemplate
};