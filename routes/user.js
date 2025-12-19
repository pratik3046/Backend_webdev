import express from 'express';
import { body } from 'express-validator';
import User from '../models/User.js';
import BlogPost from '../models/BlogPost.js';
import ForumThread from '../models/ForumThread.js';
import { authenticateToken } from '../middleware/auth.js';
import { handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Get user profile by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -email');

    if (!user || !user.isActive) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's blog posts count
    const blogPostsCount = await BlogPost.countDocuments({
      author: user._id,
      isPublished: true
    });

    // Get user's forum threads count
    const forumThreadsCount = await ForumThread.countDocuments({
      author: user._id
    });

    // Get user's comments count (Blog Posts)
    const blogCommentsCount = await BlogPost.aggregate([
      { $unwind: "$comments" },
      { $match: { "comments.author": user._id } },
      { $count: "count" }
    ]);

    // Get user's replies count (Forum Threads)
    const forumRepliesCount = await ForumThread.aggregate([
      { $unwind: "$replies" },
      { $match: { "replies.author": user._id } },
      { $count: "count" }
    ]);

    const totalComments = (blogCommentsCount[0]?.count || 0) + (forumRepliesCount[0]?.count || 0);

    res.json({
      user: {
        id: user._id,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        createdAt: user.createdAt,
        stats: {
          blogPosts: blogPostsCount,
          forumThreads: forumThreadsCount,
          comments: totalComments
        }
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error fetching user profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, [
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),

  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL'),

  handleValidationErrors
], async (req, res) => {
  try {
    const { bio, avatar } = req.body;

    const user = await User.findById(req.user._id);

    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// Change password
router.put('/password', authenticateToken, [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),

  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

  handleValidationErrors
], async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Server error updating password' });
  }
});

// Get user's blog posts
router.get('/:id/posts', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.params.id).select('username');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const posts = await BlogPost.find({
      author: req.params.id,
      isPublished: true
    })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await BlogPost.countDocuments({
      author: req.params.id,
      isPublished: true
    });

    res.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching user posts:', error);
    res.status(500).json({ message: 'Server error fetching user posts' });
  }
});

// Get user's forum threads
router.get('/:id/threads', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const user = await User.findById(req.params.id).select('username');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const threads = await ForumThread.find({ author: req.params.id })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ForumThread.countDocuments({ author: req.params.id });

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
    console.error('Error fetching user threads:', error);
    res.status(500).json({ message: 'Server error fetching user threads' });
  }
});

// Deactivate account
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.isActive = false;
    await user.save();

    res.json({ message: 'Account deactivated successfully' });
  } catch (error) {
    console.error('Error deactivating account:', error);
    res.status(500).json({ message: 'Server error deactivating account' });
  }
});

export default router;