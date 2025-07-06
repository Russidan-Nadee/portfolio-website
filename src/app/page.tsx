// src/app/page.tsx
export default function Home() {
  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="text-center py-16">
        <p className="text-lg text-gray-600 mb-4">
          My name is Russidan and I am a Developer
        </p>

        <h1 className="text-6xl font-bold mb-4">
          Developer
        </h1>

        <h2 className="text-4xl text-gray-400 mb-8">
          cross-platform, full-stack, and mobile
        </h2>

        <p className="text-gray-600 mb-12">
          based in Bangkok, Thailand.
        </p>

        <div className="flex gap-4 justify-center">
          <button className="bg-black text-white px-6 py-3 rounded">
            Portfolio
          </button>
          <button className="border border-gray-300 px-6 py-3 rounded">
            Contact
          </button>
        </div>
      </div>
    </div>
  )
}