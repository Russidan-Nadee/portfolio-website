// src/data/projects/index.ts

export * from './types'
import { ProjectData, ProjectSlug } from './types'

// ===== DYNAMIC IMPORTS FOR TRANSLATIONS =====
type ProjectLoader = () => Promise<ProjectData>

const projectLoaders: Record<string, Record<string, ProjectLoader>> = {
   'kinrai-d-project': {
      th: () => import('./translations/th/kinrai-d-project').then(m => m.kinraiDData),
      en: () => import('./translations/en/kinrai-d-project').then(m => m.kinraiDData),
      ja: () => import('./translations/ja/kinrai-d-project').then(m => m.kinraiDData),
   },
   'tp-rfid': {
      th: () => import('./translations/th/tp-rfid').then(m => m.assetDashboardData),
      en: () => import('./translations/en/tp-rfid').then(m => m.assetDashboardData),
      ja: () => import('./translations/ja/tp-rfid').then(m => m.assetDashboardData),
   },
   'asset-management': {
      th: () => import('./translations/th/asset-management').then(m => m.assetManagementData),
      en: () => import('./translations/en/asset-management').then(m => m.assetManagementData),
      ja: () => import('./translations/ja/asset-management').then(m => m.assetManagementData),
   },
   'calculator': {
      th: () => import('./translations/th/calculator').then(m => m.calculatorData),
      en: () => import('./translations/en/calculator').then(m => m.calculatorData),
      ja: () => import('./translations/ja/calculator').then(m => m.calculatorData),
   },
   'portfolio-website': {
      th: () => import('./translations/th/portfolio-website').then(m => m.portfolioWebsiteData),
      en: () => import('./translations/en/portfolio-website').then(m => m.portfolioWebsiteData),
      ja: () => import('./translations/ja/portfolio-website').then(m => m.portfolioWebsiteData),
   },
   'invest-fam': {
      th: () => import('./translations/th/invest-fam').then(m => m.investFamData),
      en: () => import('./translations/en/invest-fam').then(m => m.investFamData),
      ja: () => import('./translations/ja/invest-fam').then(m => m.investFamData),
   },
   'money-tracker-app': {
      th: () => import('./translations/th/money-tracker-app').then(m => m.moneyTrackerData),
      en: () => import('./translations/en/money-tracker-app').then(m => m.moneyTrackerData),
      ja: () => import('./translations/ja/money-tracker-app').then(m => m.moneyTrackerData),
   },
}

const loadProjectData = async (slug: ProjectSlug, lang: string = 'th'): Promise<ProjectData | undefined> => {
   const loader = projectLoaders[slug]?.[lang]
   if (!loader) return undefined

   try {
      return await loader()
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
import { kinraiDData } from './translations/th/kinrai-d-project'
import { assetDashboardData } from './translations/th/tp-rfid'
import { assetManagementData } from './translations/th/asset-management'
import { calculatorData } from './translations/th/calculator'
import { portfolioWebsiteData } from './translations/th/portfolio-website'
import { investFamData } from './translations/th/invest-fam'
import { moneyTrackerData } from './translations/th/money-tracker-app'

// ===== PROJECT REGISTRY WITH CUSTOM NUMBERING =====
const projectsRegistry: Record<string, ProjectData> = {
   'kinrai-d-project': kinraiDData,
   'tp-rfid': assetDashboardData,
   'asset-management': assetManagementData,
   'calculator': calculatorData,
   'portfolio-website': portfolioWebsiteData,
   'invest-fam': investFamData,
   'money-tracker-app': moneyTrackerData,
}

// Define custom project numbers
// NOTE: Add new projects at the TOP with the next highest number (current max = 7)
const projectNumbers: Record<string, number> = {
   'money-tracker-app': 7, // ← latest, add new project above this line
   'kinrai-d-project': 6,
   'invest-fam': 5,
   'tp-rfid': 4,
   'portfolio-website': 3,
   'asset-management': 2,
   'calculator': 1,
}

// ===== UTILITY FUNCTIONS =====

/**
 * Get project data by slug and language with custom project numbering
 * Each project has a manually assigned number defined in projectNumbers
 * @param slug - Project slug (e.g., 'calculator', 'tp-rfid')
 * @param lang - Language code ('th', 'en', 'ja')
 * @returns Project data with updated navigation or undefined if not found
 */
export const getProjectData = async (slug: ProjectSlug, lang: string = 'th'): Promise<ProjectData | undefined> => {
   const data = await loadProjectData(slug, lang)
   if (!data) return undefined

   // Get custom project number
   const projectNumber = projectNumbers[slug] || 1
   const totalProjects = Object.keys(projectsRegistry).length

   // Calculate navigation based on project numbers (not registry order)
   // Sort projects by their assigned numbers for navigation
   const projectsByNumber = Object.entries(projectNumbers)
      .sort(([, a], [, b]) => b - a) // Sort by number descending (highest first)
      .map(([slug]) => slug)

   const currentPosition = projectsByNumber.indexOf(slug)
   const prevProjectSlug = currentPosition > 0 ? projectsByNumber[currentPosition - 1] : undefined
   const nextProjectSlug = currentPosition < projectsByNumber.length - 1 ? projectsByNumber[currentPosition + 1] : undefined

   // Update navigation data
   return {
      ...data,
      navigation: {
         ...data.navigation,
         projectNumber,
         totalProjects,
         prevProjectSlug,
         nextProjectSlug,
      }
   }
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
   KINRAI_D: 'kinrai-d-project',
   TP_RFID: 'tp-rfid',
   ASSET_MANAGEMENT: 'asset-management',
   CALCULATOR: 'calculator',
   PORTFOLIO_WEBSITE: 'portfolio-website',
   INVEST_FAM: 'invest-fam',
   MONEY_TRACKER_APP: 'money-tracker-app',
} as const

export const SUPPORTED_LANGUAGES = ['th', 'en', 'ja'] as const
export const DEFAULT_LANGUAGE = 'th'
export const DEFAULT_BACK_LINK = '/portfolio'
export const DEFAULT_BACK_TEXT = 'กลับไปหน้าผลงาน'

// ===== LEGACY EXPORTS (for backward compatibility) =====
export { kinraiDData, assetDashboardData, assetManagementData, calculatorData, portfolioWebsiteData, investFamData, moneyTrackerData }

// ===== ADDITIONAL EXPORTS FOR OTHER LANGUAGES =====
export const getKinraiDData = (lang: string = 'th') => getProjectData('kinrai-d-project', lang)
export const getAssetDashboardData = (lang: string = 'th') => getProjectData('tp-rfid', lang)
export const getAssetManagementData = (lang: string = 'th') => getProjectData('asset-management', lang)
export const getCalculatorData = (lang: string = 'th') => getProjectData('calculator', lang)
export const getPortfolioWebsiteData = (lang: string = 'th') => getProjectData('portfolio-website', lang)
export const getInvestFamData = (lang: string = 'th') => getProjectData('invest-fam', lang)
export const getMoneyTrackerData = (lang: string = 'th') => getProjectData('money-tracker-app', lang)