// src/app/admin/login/page.tsx
import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function AdminLoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div
        className="w-full max-w-sm rounded-xl border p-8"
        style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}
      >
        <h1
          className="text-2xl font-bold mb-6 text-center"
          style={{ color: "var(--foreground)" }}
        >
          Admin Login
        </h1>

        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
