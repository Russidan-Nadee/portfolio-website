// src/data/projects/translations/en/invest-fam.ts

import { ProjectData } from '../../types'

export const investFamData: ProjectData = {
   navigation: {
      backLink: '/portfolio',
      backText: 'Back to Portfolio',
      projectNumber: 1,
      totalProjects: 5,
      prevProjectSlug: undefined,
      nextProjectSlug: 'tp-rfid',
   },
   header: {
      title: 'InvestFam',
      description: 'Your comprehensive hub for smart financial planning and investment decisions',
      tags: ['2025', 'Website', 'Personal', 'Tools', 'Multilingual', 'Light/Dark'],
      githubUrl: undefined,
      demoUrl: undefined,
      liveUrl: 'https://investfam.netlify.app',
   },
   infoBar: {
      duration: '1 month',
      status: 'Completed',
      company: 'Personal Project',
      technologies: ['Next.js'],
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
         imageAlt: 'InvestFam Website Preview',
         about: {
            title: 'About the Project',
            paragraphs: [
               'InvestFam is a comprehensive web platform providing free financial planning and investment calculation tools designed to help users make informed financial decisions.',
               'The application supports Progressive Web App (PWA) functionality with multilingual support (English and Thai), featuring various calculation tools for different financial needs.',
            ],
         },
         objectives: {
            title: 'Objectives',
            content: 'Create a free and accessible financial tools platform that helps users plan their finances and investments effectively',
         },
      },
      features: {
         title: 'Key Features',
         items: [
            {
               title: 'Mutual Fund Calculator',
               description: 'Calculate mutual fund investment returns with detailed fee inputs',
            },
            {
               title: 'DCA Calculator',
               description: 'Calculate returns from Dollar Cost Averaging investment strategy',
            },
            {
               title: 'Saving Goal Calculator',
               description: 'Plan your savings to achieve financial goals',
            },
            {
               title: 'Loan Calculator',
               description: 'Calculate loan payments and interest for financial planning',
            },
            {
               title: 'Tax Calculator',
               description: 'Calculate income tax and plan tax strategies',
            },
         ],
      },
      gallery: {
         title: 'Gallery',
         items: [
            'InvestFam App Homepage',
            'Mutual Fund Calculator',
            'DCA Calculator',
            'Saving Goal Calculator',
            'Loan and Tax Calculators',
         ],
      },
      technical: {
         title: 'Technical Details',
         details: {
            'Framework': 'Next.js 14',
            'Language': 'TypeScript',
            'Platform': 'Web',
            'Styling': 'Tailwind CSS',
            'Features': 'PWA, i18n',
            'Deployment': 'Netlify, Cloudflare',
            'Version Control': 'Git, GitHub',
         },
         challenges: {
            title: 'Challenges',
            items: [
               {
                  title: 'Complex Financial Calculations',
                  description: 'Create accurate algorithms for investment returns and fee calculations',
               },
               {
                  title: 'User-Friendly UX Design',
                  description: 'Design financial tools that are easy to understand for general users',
               },
               {
                  title: 'Multi-language Support',
                  description: 'Provide comprehensive service in both Thai and English',
               },
            ],
         },
      },
      results: {
         title: 'Results',
         items: [
            {
               title: 'Comprehensive Platform',
               description: 'Created a complete web application with comprehensive financial calculation tools ready for real use',
            },
            {
               title: 'Easy Accessibility',
               description: 'Provided free financial tools accessible to everyone',
            },
            {
               title: 'Great User Experience',
               description: 'Designed UI/UX that is easy to use and understand for general users',
            },
         ],
         futureGoals: {
            title: 'Future Goals',
            items: [
               {
                  description: 'Add new types of financial calculation tools',
               },
               {
                  description: 'Develop features for saving and tracking financial data',
               },
               {
                  description: 'Add investment data analysis and reporting',
               },
               {
                  description: 'Develop Mobile App for iOS and Android',
               },
            ],
         },
      },
   },
}