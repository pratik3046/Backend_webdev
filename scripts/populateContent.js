import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Sample users to register
const users = [
  {
    username: 'react_dev_alex',
    email: 'alex@webdevhub.com',
    password: 'Password123!'
  },
  {
    username: 'fullstack_sarah',
    email: 'sarah@webdevhub.com', 
    password: 'Password123!'
  },
  {
    username: 'backend_ninja',
    email: 'ninja@webdevhub.com',
    password: 'Password123!'
  }
];

// Blog posts content
const blogPosts = [
  {
    title: 'Mastering Next.js 14: App Router and Server Components',
    content: 'Next.js 14 introduces powerful new features that revolutionize how we build React applications. The App Router provides a more intuitive file-based routing system, while Server Components enable better performance by rendering on the server. In this comprehensive guide, we\'ll explore how to leverage these features to build lightning-fast web applications. We\'ll cover data fetching patterns, streaming, and the new metadata API that makes SEO optimization effortless.',
    tags: ['Next.js', 'React', 'Server Components', 'Performance'],
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800'
  },
  {
    title: 'TypeScript Best Practices for Large-Scale Applications',
    content: 'TypeScript has become essential for modern web development, especially in large-scale applications. This article covers advanced TypeScript patterns, utility types, and architectural decisions that will make your codebase more maintainable. We\'ll explore strict mode configurations, custom type guards, conditional types, and how to effectively use generics. Learn how companies like Microsoft, Slack, and Airbnb structure their TypeScript codebases for maximum developer productivity.',
    tags: ['TypeScript', 'JavaScript', 'Architecture', 'Best Practices'],
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800'
  },
  {
    title: 'Building Modern APIs with GraphQL and Prisma',
    content: 'GraphQL is transforming how we think about API design and data fetching. Combined with Prisma as an ORM, you can build type-safe, efficient APIs that scale with your application. This tutorial walks through setting up a complete GraphQL API with authentication, real-time subscriptions, and optimized database queries. We\'ll also cover testing strategies, schema design patterns, and deployment to production environments like Vercel and Railway.',
    tags: ['GraphQL', 'Prisma', 'API Design', 'Database'],
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800'
  },
  {
    title: 'CSS Grid and Flexbox: Modern Layout Techniques',
    content: 'Modern CSS layout has evolved dramatically with CSS Grid and Flexbox. These powerful layout systems allow us to create complex, responsive designs without relying on frameworks. In this deep dive, we\'ll explore practical examples of grid layouts, flexbox patterns, and how to combine both for optimal results. Learn about subgrid, container queries, and the latest CSS features that are changing how we approach responsive design.',
    tags: ['CSS', 'Layout', 'Responsive Design', 'Frontend'],
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'
  },
  {
    title: 'Micro-Frontends: Scaling Frontend Architecture',
    content: 'As applications grow, monolithic frontends become harder to maintain. Micro-frontends offer a solution by breaking down large applications into smaller, manageable pieces. This article explores different micro-frontend approaches, from Module Federation to single-spa, and when to use each. We\'ll discuss team organization, deployment strategies, and how companies like Netflix and Spotify implement micro-frontend architectures.',
    tags: ['Micro-Frontends', 'Architecture', 'Scalability', 'Team Management'],
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800'
  },
  {
    title: 'Web Performance Optimization in 2024',
    content: 'Web performance directly impacts user experience and business metrics. This comprehensive guide covers the latest performance optimization techniques, from Core Web Vitals to advanced bundling strategies. Learn about image optimization with next-gen formats, code splitting patterns, service worker caching, and how to use tools like Lighthouse and WebPageTest to measure and improve your site\'s performance. We\'ll also explore edge computing and CDN strategies.',
    tags: ['Performance', 'Optimization', 'Core Web Vitals', 'User Experience'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800'
  }
];

// Forum threads content
const forumThreads = [
  {
    title: 'Should I migrate from Create React App to Vite?',
    content: 'My team is considering migrating our React application from Create React App to Vite for better development experience and faster builds. Has anyone made this transition? What are the main challenges and benefits you\'ve experienced? Are there any gotchas I should be aware of during the migration process?',
    category: 'react'
  },
  {
    title: 'AI-Powered Development Tools: Game Changer or Hype?',
    content: 'With tools like GitHub Copilot, ChatGPT, and Claude becoming more prevalent in development workflows, I\'m curious about everyone\'s experience. Are these tools actually improving your productivity, or do you find yourself spending more time debugging AI-generated code? What\'s your take on the future of AI in software development?',
    category: 'general'
  },
  {
    title: 'Serverless vs Traditional Backend: 2024 Perspective',
    content: 'I\'m architecting a new SaaS application and debating between serverless (Vercel Functions, AWS Lambda) and traditional server deployment (Docker containers). The app will have moderate traffic with some real-time features. What factors should I consider? Has anyone compared costs and performance between these approaches recently?',
    category: 'nodejs'
  },
  {
    title: 'Web Components vs Framework Components',
    content: 'With native Web Components gaining better browser support, I\'m wondering if they\'re a viable alternative to framework-specific components. Has anyone built production applications using Web Components? How do they compare to React/Vue components in terms of developer experience and performance?',
    category: 'javascript'
  },
  {
    title: 'Monorepo Management: Nx vs Turborepo vs Lerna',
    content: 'Our company is growing and we\'re considering moving to a monorepo structure to manage our multiple frontend and backend projects. I\'ve been researching Nx, Turborepo, and Lerna. Which tool would you recommend for a team of 15 developers working on React, Node.js, and mobile apps?',
    category: 'general'
  },
  {
    title: 'CSS-in-JS vs Tailwind CSS: Performance Impact',
    content: 'I\'ve been using styled-components for years, but I\'m seeing more projects adopt Tailwind CSS. From a performance perspective, which approach is better? I\'m particularly concerned about bundle size and runtime performance. Has anyone done detailed comparisons between different styling approaches?',
    category: 'general'
  }
];

async function populateContent() {
  try {
    console.log('Starting content population...');
    
    // Register users and get tokens
    const userTokens = [];
    
    for (let i = 0; i < users.length; i++) {
      try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/register`, users[i]);
        userTokens.push(response.data.token);
        console.log(`Registered user: ${users[i].username}`);
      } catch (error) {
        // User might already exist, try to login
        try {
          const loginData = {
            identifier: users[i].email,
            password: users[i].password
          };
          const loginResponse = await axios.post(`${API_BASE_URL}/api/auth/login`, loginData);
          userTokens.push(loginResponse.data.token);
          console.log(`Logged in existing user: ${users[i].username}`);
        } catch (loginError) {
          console.error(`Failed to register/login user ${users[i].username}:`, loginError.response?.data);
        }
      }
    }

    // Create blog posts
    for (let i = 0; i < blogPosts.length && i < userTokens.length; i++) {
      try {
        const token = userTokens[i % userTokens.length];
        const response = await axios.post(
          `${API_BASE_URL}/api/blog`,
          blogPosts[i],
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log(`Created blog post: ${blogPosts[i].title}`);
      } catch (error) {
        console.error(`Failed to create blog post ${blogPosts[i].title}:`, error.response?.data);
      }
    }

    // Create forum threads
    for (let i = 0; i < forumThreads.length && i < userTokens.length; i++) {
      try {
        const token = userTokens[i % userTokens.length];
        const response = await axios.post(
          `${API_BASE_URL}/api/forum`,
          forumThreads[i],
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log(`Created forum thread: ${forumThreads[i].title}`);
      } catch (error) {
        console.error(`Failed to create forum thread ${forumThreads[i].title}:`, error.response?.data);
      }
    }

    console.log('Content population completed!');
  } catch (error) {
    console.error('Error populating content:', error);
  }
}

populateContent();