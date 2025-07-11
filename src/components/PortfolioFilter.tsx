// src/components/PortfolioFilter.tsx
'use client'

interface FilterButton {
   key: string
   icon: string
}

interface PortfolioFilterProps {
   activeFilter: string
   onFilterChange: (filter: string) => void
   translations: any
   isVisible: boolean
}

export default function PortfolioFilter({
   activeFilter,
   onFilterChange,
   translations,
   isVisible
}: PortfolioFilterProps) {

   const filterButtons: FilterButton[] = [
      { key: 'all', icon: '📁' },
      { key: 'mobile', icon: '📱' },
      { key: 'web', icon: '🌐' },
      { key: 'desktop', icon: '💻' },
      { key: 'crossPlatform', icon: '🔄' },
      { key: 'frontend', icon: '🎨' },
      { key: 'backend', icon: '⚙️' },
      { key: 'fullstack', icon: '🚀' }
   ]

   return (
      <div className={`filter-container transition-all duration-1000 ${isVisible ? 'animate-fade-in-up' : 'opacity-0 translate-y-4'}`}>
         <div className="flex flex-wrap justify-center gap-3 mb-12">
            {filterButtons.map((filter, index) => (
               <button
                  key={filter.key}
                  onClick={() => onFilterChange(filter.key)}
                  className={`filter-button group relative px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 active:scale-95 ${activeFilter === filter.key
                        ? 'filter-active'
                        : 'filter-inactive'
                     }`}
                  style={{
                     backgroundColor: activeFilter === filter.key ? 'var(--foreground)' : 'var(--card)',
                     color: activeFilter === filter.key ? 'var(--background)' : 'var(--foreground)',
                     borderColor: 'var(--border)',
                     animationDelay: `${index * 100}ms`
                  }}
               >
                  {/* Button shine effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </div>

                  <span className="relative z-10 flex items-center gap-2">
                     <span className="text-lg">{filter.icon}</span>
                     <span className="text-sm font-semibold">
                        {translations?.portfolio?.filters?.[filter.key] || filter.key}
                     </span>
                  </span>

                  {/* Active indicator */}
                  {activeFilter === filter.key && (
                     <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rounded-full bg-current animate-pulse" />
                  )}
               </button>
            ))}
         </div>

         <style jsx>{`
            @keyframes fade-in-up {
               from {
                  opacity: 0;
                  transform: translateY(20px);
               }
               to {
                  opacity: 1;
                  transform: translateY(0);
               }
            }

            .animate-fade-in-up {
               animation: fade-in-up 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
            }

            .filter-button {
               border: 2px solid;
               backdrop-filter: blur(10px);
               -webkit-backdrop-filter: blur(10px);
            }

            .filter-active {
               box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
               transform: translateY(-2px);
            }

            .filter-inactive:hover {
               background-color: var(--muted) !important;
               transform: translateY(-2px) scale(1.05);
               box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
            }

            .filter-button:active {
               transform: translateY(0) scale(0.95);
            }

            /* Responsive design */
            @media (max-width: 768px) {
               .filter-container {
                  padding: 0 1rem;
               }
               
               .filter-button {
                  padding: 0.75rem 1rem;
                  font-size: 0.875rem;
               }
               
               .filter-button span:first-child {
                  font-size: 1rem;
               }
            }

            @media (max-width: 640px) {
               .filter-container > div {
                  gap: 0.5rem;
               }
               
               .filter-button {
                  padding: 0.625rem 0.875rem;
                  font-size: 0.8rem;
               }
               
               .filter-button span:last-child {
                  display: none;
               }
            }
         `}</style>
      </div>
   )
}