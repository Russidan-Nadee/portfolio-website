// src/components/Header.tsx
import Link from 'next/link'

export default function Header() {
   return (
      <header className="p-4 border-b">
         <nav className="flex justify-between items-center max-w-6xl mx-auto">
            {/* Logo */}
            <div className="text-xl font-bold">
               <Link href="/">My Portfolio</Link>
            </div>

            {/* Navigation Menu */}
            <div className="flex space-x-6">
               <Link href="/" className="hover:text-gray-600">Home</Link>
               <Link href="/about" className="hover:text-gray-600">About</Link>
               <Link href="/portfolio" className="hover:text-gray-600">Portfolio</Link>
               <Link href="/contact" className="hover:text-gray-600">Contact</Link>
            </div>
         </nav>
      </header>
   )
}