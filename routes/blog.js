import express from 'express';
import BlogPost from '../models/BlogPost.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { validateBlogPost, validateComment } from '../middleware/validation.js';

const router = express.Router();

// Get all blog posts
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await BlogPost.find({ isPublished: true })
      .populate('author', 'username avatar')
      .populate('comments.author', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await BlogPost.countDocuments({ isPublished: true });

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
    console.error('Error fetching blog posts:', error);
    res.status(500).json({ message: 'Server error fetching blog posts' });
  }
});

// Get single blog post
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id)
      .populate('author', 'username avatar bio')
      .populate('comments.author', 'username avatar');

    if (!post || !post.isPublished) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Increment views
    post.views += 1;
    await post.save();

    res.json(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    res.status(500).json({ message: 'Server error fetching blog post' });
  }
});

// Create new blog post
router.post('/', authenticateToken, validateBlogPost, async (req, res) => {
  try {
    const { title, content, image, tags } = req.body;

    const post = new BlogPost({
      title,
      content,
      image,
      tags: tags || [],
      author: req.user._id
    });

    await post.save();
    await post.populate('author', 'username avatar');

    res.status(201).json({
      message: 'Blog post created successfully',
      post
    });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ message: 'Server error creating blog post' });
  }
});

// Update blog post
router.put('/:id', authenticateToken, validateBlogPost, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    const { title, content, image, tags } = req.body;
    
    post.title = title;
    post.content = content;
    post.image = image;
    post.tags = tags || [];

    await post.save();
    await post.populate('author', 'username avatar');

    res.json({
      message: 'Blog post updated successfully',
      post
    });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ message: 'Server error updating blog post' });
  }
});

// Delete blog post
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await BlogPost.findByIdAndDelete(req.params.id);

    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ message: 'Server error deleting blog post' });
  }
});

// Add comment to blog post
router.post('/:id/comments', authenticateToken, validateComment, async (req, res) => {
  try {
    const { text } = req.body;
    const post = await BlogPost.findById(req.params.id);

    if (!post || !post.isPublished) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const comment = {
      author: req.user._id,
      text
    };

    post.comments.push(comment);
    await post.save();
    await post.populate('comments.author', 'username avatar');

    const newComment = post.comments[post.comments.length - 1];

    res.status(201).json({
      message: 'Comment added successfully',
      comment: newComment
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server error adding comment' });
  }
});

// Delete comment
router.delete('/:postId/comments/:commentId', authenticateToken, async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const comment = post.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the comment author or post author
    if (comment.author.toString() !== req.user._id.toString() && 
        post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    comment.deleteOne();
    await post.save();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Server error deleting comment' });
  }
});

export default router;