// src/app/admin/page.tsx
export default function AdminHomePage() {
   return (
      <div>
         <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
            Dashboard
         </h1>
         <p className="mt-2" style={{ color: 'var(--muted-foreground)' }}>
            เลือกเมนูด้านซ้ายเพื่อจัดการเนื้อหา
         </p>
      </div>
   )
}
