import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: [true, 'Reply text is required'],
    trim: true,
    maxlength: [2000, 'Reply cannot exceed 2000 characters']
  }
}, {
  timestamps: true
});

const forumThreadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  replies: [replySchema],
  category: {
    type: String,
    default: 'General',
    trim: true,
    maxlength: [50, 'Category cannot exceed 50 characters']
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update lastActivity when replies are added
replySchema.pre('save', function(next) {
  this.parent().lastActivity = new Date();
  next();
});

export default mongoose.model('ForumThread', forumThreadSchema);