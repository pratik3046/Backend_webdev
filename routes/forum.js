import express from 'express';
import ForumThread from '../models/ForumThread.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { validateForumThread, validateReply } from '../middleware/validation.js';

const router = express.Router();

// Get all forum threads
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const category = req.query.category;

    const filter = {};
    if (category && category !== 'all') {
      filter.category = category;
    }

    const threads = await ForumThread.find(filter)
      .populate('author', 'username avatar')
      .populate('replies.author', 'username avatar')
      .sort({ isPinned: -1, lastActivity: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ForumThread.countDocuments(filter);

    res.json({
      threads,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalThreads: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching forum threads:', error);
    res.status(500).json({ message: 'Server error fetching forum threads' });
  }
});

// Get single forum thread
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const thread = await ForumThread.findById(req.params.id)
      .populate('author', 'username avatar bio')
      .populate('replies.author', 'username avatar');

    if (!thread) {
      return res.status(404).json({ message: 'Forum thread not found' });
    }

    // Increment views
    thread.views += 1;
    await thread.save();

    res.json(thread);
  } catch (error) {
    console.error('Error fetching forum thread:', error);
    res.status(500).json({ message: 'Server error fetching forum thread' });
  }
});

// Create new forum thread
router.post('/', authenticateToken, validateForumThread, async (req, res) => {
  try {
    const { title, content, category } = req.body;

    const thread = new ForumThread({
      title,
      content,
      category: category || 'General',
      author: req.user._id
    });

    await thread.save();
    await thread.populate('author', 'username avatar');

    res.status(201).json({
      message: 'Forum thread created successfully',
      thread
    });
  } catch (error) {
    console.error('Error creating forum thread:', error);
    res.status(500).json({ message: 'Server error creating forum thread' });
  }
});

// Update forum thread
router.put('/:id', authenticateToken, validateForumThread, async (req, res) => {
  try {
    const thread = await ForumThread.findById(req.params.id);

    if (!thread) {
      return res.status(404).json({ message: 'Forum thread not found' });
    }

    // Check if user is the author
    if (thread.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this thread' });
    }

    if (thread.isLocked) {
      return res.status(403).json({ message: 'Thread is locked and cannot be edited' });
    }

    const { title, content, category } = req.body;
    
    thread.title = title;
    thread.content = content;
    thread.category = category || thread.category;
    thread.lastActivity = new Date();

    await thread.save();
    await thread.populate('author', 'username avatar');

    res.json({
      message: 'Forum thread updated successfully',
      thread
    });
  } catch (error) {
    console.error('Error updating forum thread:', error);
    res.status(500).json({ message: 'Server error updating forum thread' });
  }
});

// Delete forum thread
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const thread = await ForumThread.findById(req.params.id);

    if (!thread) {
      return res.status(404).json({ message: 'Forum thread not found' });
    }

    // Check if user is the author
    if (thread.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this thread' });
    }

    await ForumThread.findByIdAndDelete(req.params.id);

    res.json({ message: 'Forum thread deleted successfully' });
  } catch (error) {
    console.error('Error deleting forum thread:', error);
    res.status(500).json({ message: 'Server error deleting forum thread' });
  }
});

// Add reply to forum thread
router.post('/:id/replies', authenticateToken, validateReply, async (req, res) => {
  try {
    const { text } = req.body;
    const thread = await ForumThread.findById(req.params.id);

    if (!thread) {
      return res.status(404).json({ message: 'Forum thread not found' });
    }

    if (thread.isLocked) {
      return res.status(403).json({ message: 'Thread is locked and cannot accept new replies' });
    }

    const reply = {
      author: req.user._id,
      text
    };

    thread.replies.push(reply);
    thread.lastActivity = new Date();
    await thread.save();
    await thread.populate('replies.author', 'username avatar');

    const newReply = thread.replies[thread.replies.length - 1];

    res.status(201).json({
      message: 'Reply added successfully',
      reply: newReply
    });
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ message: 'Server error adding reply' });
  }
});

// Delete reply
router.delete('/:threadId/replies/:replyId', authenticateToken, async (req, res) => {
  try {
    const thread = await ForumThread.findById(req.params.threadId);

    if (!thread) {
      return res.status(404).json({ message: 'Forum thread not found' });
    }

    const reply = thread.replies.id(req.params.replyId);

    if (!reply) {
      return res.status(404).json({ message: 'Reply not found' });
    }

    // Check if user is the reply author or thread author
    if (reply.author.toString() !== req.user._id.toString() && 
        thread.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this reply' });
    }

    reply.deleteOne();
    thread.lastActivity = new Date();
    await thread.save();

    res.json({ message: 'Reply deleted successfully' });
  } catch (error) {
    console.error('Error deleting reply:', error);
    res.status(500).json({ message: 'Server error deleting reply' });
  }
});

// Get forum categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await ForumThread.distinct('category');
    res.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error fetching categories' });
  }
});

export default router;