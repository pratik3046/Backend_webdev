import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import emailTemplates from '../templates/emailTemplates.js';

dotenv.config();

// Create a transporter for sending emails
const createTransporter = () => {
    // Validate required environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error('Email credentials not configured. Please set EMAIL_USER and EMAIL_PASS environment variables.');
    }

    // Gmail SMTP configuration
    if (process.env.EMAIL_HOST === 'smtp.gmail.com') {
        return nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false
            },
            debug: process.env.NODE_ENV === 'development',
            logger: process.env.NODE_ENV === 'development'
        });
    }

    // Default configuration for other providers
    const config = {
        host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        debug: process.env.NODE_ENV === 'development',
        logger: process.env.NODE_ENV === 'development'
    };

    // Add TLS configuration for better compatibility
    if (process.env.EMAIL_HOST && process.env.EMAIL_HOST.includes('gmail')) {
        config.tls = {
            rejectUnauthorized: false
        };
    }

    return nodemailer.createTransport(config);
};

// Send welcome email to new users
export const sendWelcomeEmail = async (userEmail, username) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Web Dev Hub" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: 'Welcome to Web Dev Hub! 🎉',
            html: emailTemplates.getWelcomeEmailTemplate(userEmail, username),
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Welcome email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending welcome email:', error);
        // Log detailed error for debugging
        console.error('Email error details:', {
            code: error.code,
            command: error.command,
            response: error.response,
            responseCode: error.responseCode
        });
        return { success: false, error: error.message, code: error.code };
    }
};

// Send password reset email
export const sendPasswordResetEmail = async (userEmail, resetToken) => {
    try {
        const transporter = createTransporter();

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: `"Blog Platform" <${process.env.EMAIL_FROM || 'noreply@blog.com'}>`,
            to: userEmail,
            subject: 'Password Reset Request',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Password Reset Request</h1>
          <p>You requested to reset your password.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetUrl}" 
             style="display: inline-block; padding: 12px 24px; background-color: #007bff; 
                    color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
            Reset Password
          </a>
          <p>Or copy and paste this link into your browser:</p>
          <p style="color: #666; word-break: break-all;">${resetUrl}</p>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            This link will expire in 1 hour. If you didn't request this, please ignore this email.
          </p>
        </div>
      `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return { success: false, error: error.message };
    }
};

// Send notification email for new comment
export const sendCommentNotification = async (postAuthorEmail, commenterName, postTitle) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Web Dev Hub" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
            to: postAuthorEmail,
            subject: `New Comment on "${postTitle}" 💬`,
            html: emailTemplates.getCommentNotificationTemplate(postAuthorEmail, commenterName, postTitle),
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Comment notification sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending comment notification:', error);
        return { success: false, error: error.message };
    }
};

// Send notification email for new forum reply
export const sendReplyNotification = async (threadAuthorEmail, replierName, threadTitle) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Web Dev Hub" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
            to: threadAuthorEmail,
            subject: `New Reply in "${threadTitle}" 🗨️`,
            html: emailTemplates.getForumReplyNotificationTemplate(threadAuthorEmail, replierName, threadTitle),
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Forum reply notification sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending forum reply notification:', error);
        return { success: false, error: error.message };
    }
};

// Send contact notification to admin
export const sendContactNotificationToAdmin = async ({ name, email, subject, message }) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Web Dev Hub Contact" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
            subject: `📧 New Contact: ${subject}`,
            html: emailTemplates.getAdminNotificationTemplate({ name, email, subject, message }),
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Admin notification sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending admin notification:', error);
        return { success: false, error: error.message };
    }
};

// Send auto-reply to user who submitted contact form
export const sendAutoReplyToUser = async ({ name, email, subject, message }) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Web Dev Hub" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
            to: email,
            subject: `✅ Thank you for contacting us - ${subject}`,
            html: emailTemplates.getAutoReplyTemplate({ name, email, subject, message }),
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Auto-reply sent to user:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending auto-reply to user:', error);
        console.error('Email error details:', {
            code: error.code,
            command: error.command,
            response: error.response
        });
        return { success: false, error: error.message, code: error.code };
    }
};

// Send custom reply to contact form submission
export const sendCustomReply = async (contactData, replyMessage) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"Web Dev Hub" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
            to: contactData.email,
            subject: `💬 Re: ${contactData.subject}`,
            html: emailTemplates.getCustomReplyTemplate(contactData, replyMessage),
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Custom reply sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('❌ Error sending custom reply:', error);
        return { success: false, error: error.message };
    }
};

// Test email configuration
export const testEmailConnection = async () => {
    try {
        const transporter = createTransporter();
        await transporter.verify();
        console.log('✅ Email service is ready');
        return { 
            success: true, 
            message: 'Email service connection verified successfully',
            config: {
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                user: process.env.EMAIL_USER,
                secure: process.env.EMAIL_HOST === 'smtp.gmail.com' ? false : undefined
            }
        };
    } catch (error) {
        console.error('❌ Email service error:', error);
        return { 
            success: false, 
            error: error.message,
            code: error.code,
            command: error.command,
            config: {
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                user: process.env.EMAIL_USER ? process.env.EMAIL_USER.replace(/(.{3}).*(@.*)/, '$1***$2') : 'Not set',
                hasPassword: !!process.env.EMAIL_PASS
            }
        };
    }
};

export default {
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendCommentNotification,
    sendReplyNotification,
    sendContactNotificationToAdmin,
    sendAutoReplyToUser,
    sendCustomReply,
    testEmailConnection,
};
