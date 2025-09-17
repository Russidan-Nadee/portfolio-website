// src/data/projects/types.ts

// ===== INDIVIDUAL COMPONENT INTERFACES =====

// ProjectNavigation Data
export interface ProjectNavigationData {
   backLink: string
   backText: string
   projectNumber: number
   totalProjects: number
   prevProjectSlug?: string
   nextProjectSlug?: string
}

// ProjectHeader Data
export interface ProjectHeaderData {
   title: string
   description: string
   tags: string[]
   githubUrl?: string
   demoUrl?: string
}

// ProjectInfoBar Data
export interface ProjectInfoBarData {
   duration: string
   status: string
   company: string
   technologies: string[]
   labels?: {
      duration: string
      status: string
      company: string
      technology: string
   }
}

// Sub-interfaces for ProjectTabsContent
export interface Feature {
   title: string
   description: string
}

export interface Challenge {
   title: string
   description: string
}

export interface Result {
   title: string
   description: string
}

export interface FutureGoal {
   description: string
}

// ProjectTabsContent Data
export interface ProjectTabsContentData {
   tabs: {
      overview: string
      features: string
      gallery: string
      technical: string
      results: string
   }
   overview: {
      title: string
      imageAlt: string
      about: {
         title: string
         paragraphs: string[]
      }
      objectives: {
         title: string
         content: string
      }
   }
   features: {
      title: string
      items: Feature[]
   }
   gallery: {
      title: string
      items: string[]
   }
   technical: {
      title: string
      details: Record<string, string>
      challenges: {
         title: string
         items: Challenge[]
      }
   }
   results: {
      title: string
      items: Result[]
      futureGoals: {
         title: string
         items: FutureGoal[]
      }
   }
}

// ===== COMPLETE PROJECT DATA INTERFACE =====
export interface ProjectData {
   navigation: ProjectNavigationData
   header: ProjectHeaderData
   infoBar: ProjectInfoBarData
   tabsContent: ProjectTabsContentData
}

// ===== UTILITY TYPES =====
export type ProjectSlug = string
export type ProjectId = 'asset-dashboard' | 'calculator' | 'portfolio-website' | 'invest-fam' | string

// Helper function type for getting project data
export type GetProjectDataFunction = (slug: ProjectSlug) => ProjectData | undefined