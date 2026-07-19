// src/app/admin/login/page.tsx
export default function AdminLoginPage() {
   return (
      <div
         className="min-h-screen flex items-center justify-center px-4"
         style={{ backgroundColor: 'var(--background)' }}
      >
         <div
            className="w-full max-w-sm rounded-xl border p-8"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
         >
            <h1 className="text-2xl font-bold mb-6 text-center" style={{ color: 'var(--foreground)' }}>
               Admin Login
            </h1>

            <form className="space-y-4">
               <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
                     Email
                  </label>
                  <input
                     type="email"
                     className="w-full rounded-lg border px-3 py-2"
                     style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  />
               </div>

               <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: 'var(--muted-foreground)' }}>
                     Password
                  </label>
                  <input
                     type="password"
                     className="w-full rounded-lg border px-3 py-2"
                     style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  />
               </div>

               <button
                  type="submit"
                  className="w-full rounded-lg py-2 font-medium"
                  style={{ backgroundColor: 'var(--foreground)', color: 'var(--background)' }}
               >
                  Log In
               </button>
            </form>
         </div>
      </div>
   )
}
