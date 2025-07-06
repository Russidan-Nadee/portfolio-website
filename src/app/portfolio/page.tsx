// src/app/portfolio/page.tsx
export default function Portfolio() {
   return (
      <div className="max-w-6xl mx-auto p-8">
         <h1 className="text-4xl font-bold mb-8">My Portfolio</h1>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="border rounded-lg p-6">
               <h3 className="text-xl font-semibold mb-4">Web Design Project 1</h3>
               <p className="text-gray-600 mb-4">
                  A modern e-commerce website with clean design and smooth user experience.
               </p>
               <div className="w-full h-48 bg-gray-200 rounded mb-4"></div>
               <p className="text-sm text-gray-500">Technologies: Next.js, Tailwind CSS</p>
            </div>

            <div className="border rounded-lg p-6">
               <h3 className="text-xl font-semibold mb-4">Photography Project 1</h3>
               <p className="text-gray-600 mb-4">
                  Portrait photography session capturing authentic moments.
               </p>
               <div className="w-full h-48 bg-gray-200 rounded mb-4"></div>
               <p className="text-sm text-gray-500">Genre: Portrait Photography</p>
            </div>

            <div className="border rounded-lg p-6">
               <h3 className="text-xl font-semibold mb-4">Web Design Project 2</h3>
               <p className="text-gray-600 mb-4">
                  Corporate website with professional design and responsive layout.
               </p>
               <div className="w-full h-48 bg-gray-200 rounded mb-4"></div>
               <p className="text-sm text-gray-500">Technologies: React, CSS</p>
            </div>
         </div>
      </div>
   )
}