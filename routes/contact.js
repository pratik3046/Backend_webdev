import express from 'express';
import { body } from 'express-validator';
import Contact from '../models/Contact.js';
import { authenticateToken } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { 
  sendContactNotificationToAdmin, 
  sendAutoReplyToUser,
  sendCustomReply 
} from '../services/emailService.js';

const router = express.Router();

// Validation rules for contact form
const validateContactForm = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('subject')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Subject must be between 5 and 200 characters'),
  
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Message must be between 10 and 2000 characters'),
  
  handleValidationErrors
];

// Submit contact form (public route)
router.post('/', validateContactForm, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Get IP address and user agent
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');

    // Create contact entry in database
    const contact = new Contact({
      name,
      email,
      subject,
      message,
      ipAddress,
      userAgent
    });

    await contact.save();

    // Send emails asynchronously with better error handling
    try {
      const emailResults = await Promise.allSettled([
        sendContactNotificationToAdmin({ name, email, subject, message }),
        sendAutoReplyToUser({ name, email, subject, message })
      ]);
      
      emailResults.forEach((result, index) => {
        const emailType = index === 0 ? 'admin notification' : 'auto-reply';
        if (result.status === 'fulfilled') {
          console.log(`✅ ${emailType} sent successfully:`, result.value);
        } else {
          console.error(`❌ ${emailType} failed:`, result.reason);
        }
      });
    } catch (error) {
      console.error('Error in email sending process:', error);
      // Don't fail the request if emails fail
    }

    res.status(201).json({
      message: 'Thank you for contacting us! We\'ll get back to you soon.',
      contact: {
        id: contact._id,
        name: contact.name,
        email: contact.email,
        subject: contact.subject,
        createdAt: contact.createdAt
      }
    });
  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({ 
      message: 'Failed to submit contact form. Please try again later.' 
    });
  }
});

// Get all contact messages (admin only - protected route)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status; // Filter by status

    const filter = {};
    if (status && ['pending', 'read', 'replied'].includes(status)) {
      filter.status = status;
    }

    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments(filter);

    res.json({
      contacts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalContacts: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Server error fetching contacts' });
  }
});

// Get single contact message (admin only)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    // Mark as read if it's pending
    if (contact.status === 'pending') {
      contact.status = 'read';
      await contact.save();
    }

    res.json(contact);
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ message: 'Server error fetching contact' });
  }
});

// Reply to contact message (admin only)
router.post('/:id/reply', authenticateToken, [
  body('replyMessage')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Reply message must be between 10 and 2000 characters'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { replyMessage } = req.body;
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    // Send custom reply email
    try {
      await sendCustomReply(
        {
          name: contact.name,
          email: contact.email,
          subject: contact.subject,
          message: contact.message
        },
        replyMessage
      );

      // Update contact status
      contact.status = 'replied';
      contact.replied = true;
      contact.replyMessage = replyMessage;
      contact.repliedAt = new Date();
      await contact.save();

      res.json({
        message: 'Reply sent successfully',
        contact
      });
    } catch (emailError) {
      console.error('Error sending reply email:', emailError);
      res.status(500).json({ 
        message: 'Failed to send reply email. Please try again.' 
      });
    }
  } catch (error) {
    console.error('Error replying to contact:', error);
    res.status(500).json({ message: 'Server error sending reply' });
  }
});

// Update contact status (admin only)
router.patch('/:id/status', authenticateToken, [
  body('status')
    .isIn(['pending', 'read', 'replied'])
    .withMessage('Invalid status value'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    contact.status = status;
    await contact.save();

    res.json({
      message: 'Status updated successfully',
      contact
    });
  } catch (error) {
    console.error('Error updating contact status:', error);
    res.status(500).json({ message: 'Server error updating status' });
  }
});

// Delete contact message (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    res.json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'Server error deleting contact' });
  }
});

// Get contact statistics (admin only)
router.get('/stats/summary', authenticateToken, async (req, res) => {
  try {
    const totalContacts = await Contact.countDocuments();
    const pendingContacts = await Contact.countDocuments({ status: 'pending' });
    const readContacts = await Contact.countDocuments({ status: 'read' });
    const repliedContacts = await Contact.countDocuments({ status: 'replied' });

    // Get recent contacts (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentContacts = await Contact.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.json({
      total: totalContacts,
      pending: pendingContacts,
      read: readContacts,
      replied: repliedContacts,
      recentWeek: recentContacts
    });
  } catch (error) {
    console.error('Error fetching contact stats:', error);
    res.status(500).json({ message: 'Server error fetching statistics' });
  }
});

export default router;
