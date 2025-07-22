// src/data/projects/index.ts

export * from './types'
import { assetDashboardData } from './asset-dashboard'
import { calculatorData } from './calculator'
import { portfolioWebsiteData } from './portfolio-website'
import { assetManagementData } from './asset-management'
import { ProjectData, ProjectSlug } from './types'

// ===== PROJECT DATA EXPORTS =====
export { assetDashboardData, calculatorData, portfolioWebsiteData, assetManagementData }

// ===== PROJECT REGISTRY =====
const projectsRegistry: Record<string, ProjectData> = {
   'asset-dashboard': assetDashboardData,
   'calculator': calculatorData,
   'portfolio-website': portfolioWebsiteData,
   'asset-management': assetManagementData,
}

// ===== UTILITY FUNCTIONS =====

/**
 * Get project data by slug
 * @param slug - Project slug (e.g., 'calculator', 'asset-dashboard')
 * @returns Project data or undefined if not found
 */
export const getProjectData = (slug: ProjectSlug): ProjectData | undefined => {
   return projectsRegistry[slug]
}

/**
 * Get all available project slugs
 * @returns Array of project slugs
 */
export const getAllProjectSlugs = (): string[] => {
   return Object.keys(projectsRegistry)
}

/**
 * Check if project exists
 * @param slug - Project slug
 * @returns boolean
 */
export const projectExists = (slug: ProjectSlug): boolean => {
   return slug in projectsRegistry
}

/**
 * Get total number of projects
 * @returns Total project count
 */
export const getTotalProjects = (): number => {
   return Object.keys(projectsRegistry).length
}

/**
 * Get next project slug
 * @param currentSlug - Current project slug
 * @returns Next project slug or undefined
 */
export const getNextProjectSlug = (currentSlug: ProjectSlug): string | undefined => {
   const slugs = getAllProjectSlugs()
   const currentIndex = slugs.indexOf(currentSlug)

   if (currentIndex === -1 || currentIndex === slugs.length - 1) {
      return undefined
   }

   return slugs[currentIndex + 1]
}

/**
 * Get previous project slug
 * @param currentSlug - Current project slug
 * @returns Previous project slug or undefined
 */
export const getPrevProjectSlug = (currentSlug: ProjectSlug): string | undefined => {
   const slugs = getAllProjectSlugs()
   const currentIndex = slugs.indexOf(currentSlug)

   if (currentIndex <= 0) {
      return undefined
   }

   return slugs[currentIndex - 1]
}

/**
 * Get project number (1-based index)
 * @param slug - Project slug
 * @returns Project number or 0 if not found
 */
export const getProjectNumber = (slug: ProjectSlug): number => {
   const slugs = getAllProjectSlugs()
   const index = slugs.indexOf(slug)
   return index === -1 ? 0 : index + 1
}

// ===== CONSTANTS =====
export const PROJECT_SLUGS = {
   ASSET_DASHBOARD: 'asset-dashboard',
   CALCULATOR: 'calculator',
   PORTFOLIO_WEBSITE: 'portfolio-website',
   ASSET_MANAGEMENT: 'asset-management',
} as const

export const DEFAULT_BACK_LINK = '/portfolio'
export const DEFAULT_BACK_TEXT = 'กลับไปหน้าผลงาน'