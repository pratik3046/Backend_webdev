import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import BlogPost from '../models/BlogPost.js';
import ForumThread from '../models/ForumThread.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/forumpage');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await BlogPost.deleteMany({});
    await ForumThread.deleteMany({});
    console.log('Cleared existing data');

    // Create sample users
    const users = await User.create([
      {
        username: 'react_dev_alex',
        email: 'alex.frontend@gmail.com',
        password: 'Password123!'
      },
      {
        username: 'fullstack_sarah',
        email: 'sarah.fullstack@gmail.com',
        password: 'Password123!'
      },
      {
        username: 'backend_ninja',
        email: 'ninja.backend@gmail.com',
        password: 'Password123!'
      }
    ]);

    console.log('Created sample users');

    // Create sample blog posts
    const blogPosts = await BlogPost.create([
      {
        title: 'Mastering Next.js 14: App Router and Server Components',
        content: 'Next.js 14 introduces powerful new features that revolutionize how we build React applications. The App Router provides a more intuitive file-based routing system, while Server Components enable better performance by rendering on the server. In this comprehensive guide, we\'ll explore how to leverage these features to build lightning-fast web applications. We\'ll cover data fetching patterns, streaming, and the new metadata API that makes SEO optimization effortless.',
        author: users[0]._id,
        tags: ['Next.js', 'React', 'Server Components', 'Performance'],
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800'
      },
      {
        title: 'TypeScript Best Practices for Large-Scale Applications',
        content: 'TypeScript has become essential for modern web development, especially in large-scale applications. This article covers advanced TypeScript patterns, utility types, and architectural decisions that will make your codebase more maintainable. We\'ll explore strict mode configurations, custom type guards, conditional types, and how to effectively use generics. Learn how companies like Microsoft, Slack, and Airbnb structure their TypeScript codebases for maximum developer productivity.',
        author: users[1]._id,
        tags: ['TypeScript', 'JavaScript', 'Architecture', 'Best Practices'],
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800'
      },
      {
        title: 'Building Modern APIs with GraphQL and Prisma',
        content: 'GraphQL is transforming how we think about API design and data fetching. Combined with Prisma as an ORM, you can build type-safe, efficient APIs that scale with your application. This tutorial walks through setting up a complete GraphQL API with authentication, real-time subscriptions, and optimized database queries. We\'ll also cover testing strategies, schema design patterns, and deployment to production environments like Vercel and Railway.',
        author: users[2]._id,
        tags: ['GraphQL', 'Prisma', 'API Design', 'Database'],
        image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800'
      },
      {
        title: 'CSS Grid and Flexbox: Modern Layout Techniques',
        content: 'Modern CSS layout has evolved dramatically with CSS Grid and Flexbox. These powerful layout systems allow us to create complex, responsive designs without relying on frameworks. In this deep dive, we\'ll explore practical examples of grid layouts, flexbox patterns, and how to combine both for optimal results. Learn about subgrid, container queries, and the latest CSS features that are changing how we approach responsive design.',
        author: users[0]._id,
        tags: ['CSS', 'Layout', 'Responsive Design', 'Frontend'],
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'
      },
      {
        title: 'Micro-Frontends: Scaling Frontend Architecture',
        content: 'As applications grow, monolithic frontends become harder to maintain. Micro-frontends offer a solution by breaking down large applications into smaller, manageable pieces. This article explores different micro-frontend approaches, from Module Federation to single-spa, and when to use each. We\'ll discuss team organization, deployment strategies, and how companies like Netflix and Spotify implement micro-frontend architectures.',
        author: users[1]._id,
        tags: ['Micro-Frontends', 'Architecture', 'Scalability', 'Team Management'],
        image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800'
      },
      {
        title: 'Web Performance Optimization in 2024',
        content: 'Web performance directly impacts user experience and business metrics. This comprehensive guide covers the latest performance optimization techniques, from Core Web Vitals to advanced bundling strategies. Learn about image optimization with next-gen formats, code splitting patterns, service worker caching, and how to use tools like Lighthouse and WebPageTest to measure and improve your site\'s performance. We\'ll also explore edge computing and CDN strategies.',
        author: users[2]._id,
        tags: ['Performance', 'Optimization', 'Core Web Vitals', 'User Experience'],
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'
      }
    ]);

    // Add comments to blog posts
    blogPosts[0].comments.push({
      author: users[1]._id,
      text: 'Excellent breakdown of Next.js 14 features! The Server Components section was particularly helpful. Have you encountered any issues with third-party libraries that don\'t support server components yet?'
    });

    blogPosts[0].comments.push({
      author: users[2]._id,
      text: 'This is exactly what I needed! Just migrated our app to the App Router last week. The performance improvements are incredible, especially with streaming.'
    });

    blogPosts[1].comments.push({
      author: users[0]._id,
      text: 'Great TypeScript tips! The section on utility types saved me hours of work. Would love to see a follow-up on advanced generic patterns.'
    });

    blogPosts[3].comments.push({
      author: users[2]._id,
      text: 'CSS Grid has completely changed my workflow. No more fighting with float layouts! The subgrid feature is a game-changer for nested layouts.'
    });

    await Promise.all([blogPosts[0].save(), blogPosts[1].save(), blogPosts[3].save()]);

    console.log('Created sample blog posts with comments');

    // Create sample forum threads
    const forumThreads = await ForumThread.create([
      {
        title: 'Should I migrate from Create React App to Vite?',
        content: 'My team is considering migrating our React application from Create React App to Vite for better development experience and faster builds. Has anyone made this transition? What are the main challenges and benefits you\'ve experienced? Are there any gotchas I should be aware of during the migration process?',
        author: users[0]._id,
        category: 'react'
      },
      {
        title: 'AI-Powered Development Tools: Game Changer or Hype?',
        content: 'With tools like GitHub Copilot, ChatGPT, and Claude becoming more prevalent in development workflows, I\'m curious about everyone\'s experience. Are these tools actually improving your productivity, or do you find yourself spending more time debugging AI-generated code? What\'s your take on the future of AI in software development?',
        author: users[1]._id,
        category: 'general'
      },
      {
        title: 'Serverless vs Traditional Backend: 2024 Perspective',
        content: 'I\'m architecting a new SaaS application and debating between serverless (Vercel Functions, AWS Lambda) and traditional server deployment (Docker containers). The app will have moderate traffic with some real-time features. What factors should I consider? Has anyone compared costs and performance between these approaches recently?',
        author: users[2]._id,
        category: 'nodejs'
      },
      {
        title: 'Web Components vs Framework Components',
        content: 'With native Web Components gaining better browser support, I\'m wondering if they\'re a viable alternative to framework-specific components. Has anyone built production applications using Web Components? How do they compare to React/Vue components in terms of developer experience and performance?',
        author: users[0]._id,
        category: 'javascript'
      },
      {
        title: 'Monorepo Management: Nx vs Turborepo vs Lerna',
        content: 'Our company is growing and we\'re considering moving to a monorepo structure to manage our multiple frontend and backend projects. I\'ve been researching Nx, Turborepo, and Lerna. Which tool would you recommend for a team of 15 developers working on React, Node.js, and mobile apps?',
        author: users[1]._id,
        category: 'general'
      },
      {
        title: 'CSS-in-JS vs Tailwind CSS: Performance Impact',
        content: 'I\'ve been using styled-components for years, but I\'m seeing more projects adopt Tailwind CSS. From a performance perspective, which approach is better? I\'m particularly concerned about bundle size and runtime performance. Has anyone done detailed comparisons between different styling approaches?',
        author: users[2]._id,
        category: 'general'
      }
    ]);

    // Add replies to forum threads
    forumThreads[0].replies.push({
      author: users[1]._id,
      text: 'We migrated from CRA to Vite last month and it was totally worth it! Dev server startup went from 30s to 3s. The main challenge was updating some webpack-specific configurations, but Vite\'s documentation is excellent.'
    });

    forumThreads[0].replies.push({
      author: users[2]._id,
      text: 'Just be careful with environment variables - Vite uses VITE_ prefix instead of REACT_APP_. Also, some older libraries might need polyfills. Overall, the migration is straightforward.'
    });

    forumThreads[1].replies.push({
      author: users[0]._id,
      text: 'I\'ve been using Copilot for 6 months now. It\'s genuinely helpful for boilerplate code and common patterns, but you still need to understand what it\'s generating. It\'s a productivity boost, not a replacement for knowledge.'
    });

    forumThreads[1].replies.push({
      author: users[2]._id,
      text: 'The key is using AI tools as a starting point, not the final solution. I find them great for exploring different approaches to problems I haven\'t solved before.'
    });

    forumThreads[2].replies.push({
      author: users[0]._id,
      text: 'For moderate traffic with real-time features, I\'d lean towards traditional servers. Serverless can get expensive with sustained connections, and cold starts might affect real-time performance.'
    });

    forumThreads[4].replies.push({
      author: users[2]._id,
      text: 'We use Turborepo at my company and love it. The caching is incredible - builds that used to take 20 minutes now take 2-3 minutes. Nx is more feature-rich but has a steeper learning curve.'
    });

    await Promise.all(forumThreads.map(thread => thread.save()));

    console.log('Created sample forum threads with replies');
    console.log('Database seeded successfully!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();