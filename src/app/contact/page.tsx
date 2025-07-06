// src/app/contact/page.tsx
export default function Contact() {
   return (
      <div className="max-w-4xl mx-auto p-8">
         <h1 className="text-4xl font-bold mb-8">Get In Touch</h1>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
               <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
               <div className="space-y-4">
                  <div>
                     <h3 className="font-semibold">Email</h3>
                     <p className="text-gray-600">hello@myportfolio.com</p>
                  </div>
                  <div>
                     <h3 className="font-semibold">Phone</h3>
                     <p className="text-gray-600">+66 (0) 123-456-789</p>
                  </div>
                  <div>
                     <h3 className="font-semibold">Location</h3>
                     <p className="text-gray-600">Bangkok, Thailand</p>
                  </div>
               </div>
            </div>

            <div>
               <h2 className="text-2xl font-semibold mb-4">Send Message</h2>
               <form className="space-y-4">
                  <div>
                     <label className="block text-sm font-medium mb-1">Name</label>
                     <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="Your name"
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-medium mb-1">Email</label>
                     <input
                        type="email"
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="Your email"
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-medium mb-1">Message</label>
                     <textarea
                        rows={4}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="Your message"
                     ></textarea>
                  </div>
                  <button className="bg-black text-white px-6 py-3 rounded w-full">
                     Send Message
                  </button>
               </form>
            </div>
         </div>
      </div>
   )
}