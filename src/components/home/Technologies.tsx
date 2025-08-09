// src/components/Technologies.tsx
'use client'

import React from 'react';

const technologies = [
   { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
   { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
   { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
   { name: 'Dart', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg' },
   { name: 'CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
   { name: 'HTML', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
   { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
   { name: 'C#', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg' },
   { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
   { name: 'Tailwind CSS', icon: 'https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg' },
   { name: 'prisma', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prisma/prisma-original.svg' },
   { name: 'nest.js', icon: 'https://commons.wikimedia.org/wiki/Special:FilePath/NestJS.svg' },
   { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
   { name: 'Express', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
   { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
   { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
   { name: 'Postman', icon: 'https://www.vectorlogo.zone/logos/getpostman/getpostman-icon.svg' },
   { name: 'GitHub', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
   { name: 'Virsal studio', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/visualstudio/visualstudio-plain.svg' },
   { name: 'VS Code', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
   { name: 'supabase', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg' },
   { name: 'vercel', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg' },
   { name: 'netlify', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/netlify/netlify-original.svg' }
   ,
];

// Duplicate the array to create a seamless loop
const doubledTechnologies = [...technologies, ...technologies];

interface Translations {
   header?: {
      logo?: string;
      nav?: {
         home?: string;
         about?: string;
         portfolio?: string;
         contact?: string;
      };
   };
   home?: {
      intro?: string;
      title?: string;
      subtitle?: string;
      location?: string;
      buttons?: {
         portfolio?: string;
         contact?: string;
      };
      projectsShowcase?: {
         title?: string;
         projects?: {
            assetManagement?: { title?: string; tech?: string };
            calculator?: { title?: string; tech?: string };
            portfolio?: { title?: string; tech?: string };
         };
      };
      technologies?: {
         title?: string;
         subtitle?: string;
      };
   };
   about?: any;
   portfolio?: any;
   contact?: any;
}

interface TechnologiesProps {
   translations: Translations;
}

export default function Technologies({ translations }: TechnologiesProps) {
   const t = translations.home?.technologies || {
      title: 'Technologies I Work With',
      subtitle: 'Modern tools for modern solutions',
   };

   return (
      <section className="py-12" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
         <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black mb-4 md:mb-6 leading-none tracking-tight text-center whitespace-nowrap md:whitespace-normal"
               style={{
                  color: 'var(--foreground)',
                  fontFamily: 'var(--font-inter), "IBM Plex Sans Thai", "Noto Sans JP", system-ui, sans-serif',
                  fontSize: 'clamp(2rem, 4vw, 5rem)'
               }}>
               {t.title}
            </h2>
            <p className="text-base md:text-lg lg:text-xl xl:text-2xl mb-8 md:mb-12 text-center opacity-80 tracking-wide"
               style={{
                  color: 'var(--muted-foreground)',
                  fontFamily: 'var(--font-inter), "IBM Plex Sans Thai", "Noto Sans JP", system-ui, sans-serif'
               }}>
               {t.subtitle}
            </p>
            <div className="relative w-full overflow-hidden">
               <div className="flex animate-scroll whitespace-nowrap">
                  {doubledTechnologies.map((tech, index) => (
                     <div key={index} className="flex flex-col items-center mx-6 flex-shrink-0">
                        <div className="w-24 h-24 flex items-center justify-center bg-transparent mb-4">
                           <img
                              src={tech.icon}
                              alt={`${tech.name} logo`}
                              className="w-20 h-20 object-contain"
                              style={{
                                 filter: 'brightness(0.9)',
                                 backgroundColor: 'transparent'
                              }}
                           />
                        </div>
                        <span className="text-lg font-medium" style={{ color: 'var(--muted-foreground)' }}>
                           {tech.name}
                        </span>
                     </div>
                  ))}
               </div>
            </div>
         </div>
         <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          display: inline-flex;
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
      </section>
   );
}