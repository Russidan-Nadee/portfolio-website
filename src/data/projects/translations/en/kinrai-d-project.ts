// src/data/projects/translations/en/kinrai-d-project.ts

import { ProjectData } from '../../types'

export const kinraiDData: ProjectData = {
   navigation: {
      backLink: '/portfolio',
      backText: 'Back to Portfolio',
      projectNumber: 0, // Will be calculated dynamically
      totalProjects: 0, // Will be calculated dynamically
      prevProjectSlug: undefined, // Will be calculated dynamically
      nextProjectSlug: undefined, // Will be calculated dynamically
   },
   header: {
      title: 'Kinrai-D',
      description: 'A cross-platform food randomizer app that helps users discover new dishes in a fun and engaging way',
      tags: ['2025', 'App', 'Cross-Platform', 'Food', 'Random'],
      githubUrl: undefined,
      demoUrl: undefined,
      liveUrl: undefined,
   },
   infoBar: {
      duration: '4 months',
      status: 'In Progress',
      company: 'Personal Project',
      technologies: ['Flutter', 'Nest.js', 'PostgreSQL', 'Supabase'],
      labels: {
         duration: 'Duration',
         status: 'Status',
         company: 'Company',
         technology: 'Technology',
      },
   },
   tabsContent: {
      tabs: {
         overview: 'Overview',
         features: 'Features',
         gallery: 'Gallery',
         technical: 'Technical',
         results: 'Results',
      },
      overview: {
         title: 'Project Overview',
         imageAlt: '',
         about: {
            title: 'About the Project',
            paragraphs: [
               'Kinrai-D is a food randomizer application designed to help users discover and choose food in a fun and engaging way. It uses a smart randomization system to reduce decision-making fatigue when selecting meals.',
               'The application is built with Flutter for cross-platform support and uses Nest.js as the backend with PostgreSQL database through Supabase for reliable data management.',
            ],
         },
         objectives: {
            title: 'Objectives',
            content: 'Create an application that helps users discover new food options conveniently and enjoyably, reduce decision-making time, and enhance the experience of trying diverse food types.',
         },
      },
      features: {
         title: 'Key Features',
         items: [
            {
               title: 'Food Randomization System',
               description: 'Randomly select food from a diverse database with filters based on type and preferences',
            },
            {
               title: 'Favorites Management',
               description: 'Save and manage favorite food items for easier access and future reference',
            },
            {
               title: 'Rating & Review System',
               description: 'Rate and review food items you\'ve tried to help other users make informed choices',
            },
            {
               title: 'Advanced Search',
               description: 'Search for food by category, ingredients, price range, and spice level',
            },
            {
               title: 'Offline Mode',
               description: 'Use the app without internet connection with data sync when reconnected',
            },
         ],
      },
      gallery: {
         title: 'Gallery',
         items: [
            'Kinrai-D app main screen',
            'Food randomization system and results',
            'Favorites management page',
            'Review and rating system',
            'Food search and filtering',
         ],
      },
      technical: {
         title: 'Technical Details',
         details: {
            'Framework': 'Flutter, Nest.js',
            'Language': 'Dart, TypeScript',
            'Platform': 'Cross-Platform (iOS, Android, Web)',
            'Database': 'PostgreSQL, Prisma ORM',
            'Cloud Service': 'Supabase',
            'Version Control': 'Git, GitHub',
         },
         challenges: {
            title: 'Challenges',
            items: [
               {
                  title: 'Smart Randomization Algorithm',
                  description: 'Develop a randomization system that considers user preferences and selection history',
               },
               {
                  title: 'Offline Data Management',
                  description: 'Design a data synchronization system that works both online and offline',
               },
               {
                  title: 'Cross-Platform UI/UX',
                  description: 'Create a consistent user experience across all platforms',
               },
            ],
         },
      },
      results: {
         title: 'Results',
         items: [
            {
               title: 'Cross-Platform Application',
               description: 'Developed an application that works smoothly on iOS, Android, and Web platforms',
            },
            {
               title: 'Efficient Backend System',
               description: 'Built a fast and secure API using Nest.js and Supabase',
            },
            {
               title: 'Engaging User Experience',
               description: 'Designed UI/UX that makes food selection fun and easy',
            },
         ],
         futureGoals: {
            title: 'Future Goals',
            items: [
               {
                  description: 'Add AI and Machine Learning-powered food recommendations',
               },
               {
                  description: 'Develop social features for sharing reviews and recommendations with friends',
               },
               {
                  description: 'Add multi-language support and international cuisine options',
               },
               {
                  description: 'Integrate restaurant booking and food ordering features',
               },
            ],
         },
      },
   },
}