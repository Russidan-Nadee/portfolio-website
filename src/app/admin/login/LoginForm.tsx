// src/app/admin/login/LoginForm.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

const ERROR_MESSAGES: Record<string, string> = {
  unauthorized: "บัญชีนี้ไม่มีสิทธิ์เข้าหน้า Admin",
  auth: "เข้าสู่ระบบไม่สำเร็จ ลองใหม่อีกครั้ง",
};

export default function LoginForm() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error");

  const handleGoogleLogin = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/admin/auth/callback`,
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {errorCode && (
        <p className="text-sm text-center" style={{ color: "#dc2626" }}>
          {ERROR_MESSAGES[errorCode] || ERROR_MESSAGES.auth}
        </p>
      )}

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full rounded-lg py-2 font-medium flex items-center justify-center gap-2 border"
        style={{ borderColor: "var(--border)", color: "var(--foreground)" }}
      >
        <FaGoogle size={16} />
        Sign in with Google
      </button>
    </div>
  );
}
