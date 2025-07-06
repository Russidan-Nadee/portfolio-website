// src/app/about/page.tsx
export default function About() {
   return (
      <div className="max-w-4xl mx-auto p-8">
         <h1 className="text-4xl font-bold mb-8">About Me</h1>

         <div className="space-y-6">
            <p className="text-lg text-gray-700">
               Hi, I'm John - a passionate web designer and photographer based in Bangkok, Thailand.
            </p>

            <p className="text-gray-700">
               I've been creating digital experiences for over 5 years, specializing in modern web design
               and user interface development. My work focuses on creating clean, functional, and
               beautiful designs that help businesses connect with their audiences.
            </p>

            <p className="text-gray-700">
               When I'm not designing websites, you can find me behind the camera capturing moments
               and telling stories through photography.
            </p>
         </div>
      </div>
   )
}