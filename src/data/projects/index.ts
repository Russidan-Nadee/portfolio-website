// src/data/projects/index.ts

export * from './types'
import { ProjectData, ProjectSlug } from './types'

// ===== DYNAMIC IMPORTS FOR TRANSLATIONS =====
const loadProjectData = async (slug: ProjectSlug, lang: string = 'th'): Promise<ProjectData | undefined> => {
   try {
      let data

      switch (slug) {
         case 'asset-dashboard':
            if (lang === 'th') {
               const module = await import('./translations/th/asset-dashboard')
               data = module.assetDashboardData
            } else if (lang === 'en') {
               const module = await import('./translations/en/asset-dashboard')
               data = module.assetDashboardData
            } else if (lang === 'ja') {
               const module = await import('./translations/ja/asset-dashboard')
               data = module.assetDashboardData
            }
            break

         case 'asset-management':
            if (lang === 'th') {
               const module = await import('./translations/th/asset-management')
               data = module.assetManagementData
            } else if (lang === 'en') {
               const module = await import('./translations/en/asset-management')
               data = module.assetManagementData
            } else if (lang === 'ja') {
               const module = await import('./translations/ja/asset-management')
               data = module.assetManagementData
            }
            break

         case 'calculator':
            if (lang === 'th') {
               const module = await import('./translations/th/calculator')
               data = module.calculatorData
            } else if (lang === 'en') {
               const module = await import('./translations/en/calculator')
               data = module.calculatorData
            } else if (lang === 'ja') {
               const module = await import('./translations/ja/calculator')
               data = module.calculatorData
            }
            break

         case 'portfolio-website':
            if (lang === 'th') {
               const module = await import('./translations/th/portfolio-website')
               data = module.portfolioWebsiteData
            } else if (lang === 'en') {
               const module = await import('./translations/en/portfolio-website')
               data = module.portfolioWebsiteData
            } else if (lang === 'ja') {
               const module = await import('./translations/ja/portfolio-website')
               data = module.portfolioWebsiteData
            }
            break

         default:
            return undefined
      }

      return data
   } catch (error) {
      console.error(`Failed to load project data for ${slug} in ${lang}:`, error)
      // Fallback to Thai if other language fails
      if (lang !== 'th') {
         return loadProjectData(slug, 'th')
      }
      return undefined
   }
}

// ===== SYNCHRONOUS IMPORTS FOR THAI (DEFAULT) =====
import { assetDashboardData } from './translations/th/asset-dashboard'
import { assetManagementData } from './translations/th/asset-management'
import { calculatorData } from './translations/th/calculator'
import { portfolioWebsiteData } from './translations/th/portfolio-website'

// ===== PROJECT REGISTRY (THAI ONLY FOR NOW) =====
const projectsRegistry: Record<string, ProjectData> = {
   'asset-dashboard': assetDashboardData,
   'asset-management': assetManagementData,
   'calculator': calculatorData,
   'portfolio-website': portfolioWebsiteData,
}

// ===== UTILITY FUNCTIONS =====

/**
 * Get project data by slug and language
 * @param slug - Project slug (e.g., 'calculator', 'asset-dashboard')
 * @param lang - Language code ('th', 'en', 'ja')
 * @returns Project data or undefined if not found
 */
export const getProjectData = async (slug: ProjectSlug, lang: string = 'th'): Promise<ProjectData | undefined> => {
   return await loadProjectData(slug, lang)
}

/**
 * Get project data synchronously (Thai only)
 * @param slug - Project slug
 * @returns Project data or undefined if not found
 */
export const getProjectDataSync = (slug: ProjectSlug): ProjectData | undefined => {
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

/**
 * Get supported languages for a project
 * @param slug - Project slug
 * @returns Array of supported language codes
 */
export const getSupportedLanguages = (slug: ProjectSlug): string[] => {
   // All projects now support all three languages
   return ['th', 'en', 'ja']
}

/**
 * Get project data with fallback language
 * @param slug - Project slug
 * @param preferredLang - Preferred language
 * @param fallbackLang - Fallback language (default: 'th')
 * @returns Project data
 */
export const getProjectDataWithFallback = async (
   slug: ProjectSlug,
   preferredLang: string = 'th',
   fallbackLang: string = 'th'
): Promise<ProjectData | undefined> => {
   let data = await getProjectData(slug, preferredLang)

   if (!data && preferredLang !== fallbackLang) {
      data = await getProjectData(slug, fallbackLang)
   }

   return data
}

// ===== CONSTANTS =====
export const PROJECT_SLUGS = {
   ASSET_DASHBOARD: 'asset-dashboard',
   ASSET_MANAGEMENT: 'asset-management',
   CALCULATOR: 'calculator',
   PORTFOLIO_WEBSITE: 'portfolio-website',
} as const

export const SUPPORTED_LANGUAGES = ['th', 'en', 'ja'] as const
export const DEFAULT_LANGUAGE = 'th'
export const DEFAULT_BACK_LINK = '/portfolio'
export const DEFAULT_BACK_TEXT = 'กลับไปหน้าผลงาน'

// ===== LEGACY EXPORTS (for backward compatibility) =====
export { assetDashboardData, assetManagementData, calculatorData, portfolioWebsiteData }

// ===== ADDITIONAL EXPORTS FOR OTHER LANGUAGES =====
export const getAssetDashboardData = (lang: string = 'th') => getProjectData('asset-dashboard', lang)
export const getAssetManagementData = (lang: string = 'th') => getProjectData('asset-management', lang)
export const getCalculatorData = (lang: string = 'th') => getProjectData('calculator', lang)
export const getPortfolioWebsiteData = (lang: string = 'th') => getProjectData('portfolio-website', lang)