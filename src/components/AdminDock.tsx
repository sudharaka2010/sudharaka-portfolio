"use client";

import { useState } from "react";
import { KeyRound, LoaderCircle, Lock, LogOut, ShieldCheck } from "lucide-react";

export default function AdminDock({
  initialIsAdmin,
}: {
  initialIsAdmin: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(initialIsAdmin);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        setError(payload.error ?? "Login failed.");
        return;
      }

      setIsAdmin(true);
      window.location.reload();
    } catch {
      setError("Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLogout() {
    setIsSubmitting(true);
    setError(null);

    try {
      await fetch("/api/admin/logout", { method: "POST" });
      setIsAdmin(false);
      window.location.reload();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className={[
          "inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium backdrop-blur-sm transition",
          isAdmin
            ? "border-emerald-300/30 bg-emerald-400/14 text-emerald-50"
            : "border-white/14 bg-black/55 text-white/86 hover:bg-black/70",
        ].join(" ")}
      >
        {isAdmin ? (
          <ShieldCheck className="h-4 w-4" />
        ) : (
          <Lock className="h-4 w-4" />
        )}
        {isAdmin ? "Admin Unlocked" : "Admin"}
      </button>

      {isOpen ? (
        <div className="mt-3 w-[320px] rounded-[28px] border border-white/12 bg-[#090d14]/95 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.5)]">
          {isAdmin ? (
            <div className="space-y-4">
              <div>
                <div className="mono text-[10px] tracking-[0.16em] text-white/46 uppercase">
                  Admin status
                </div>
                <div className="mt-2 text-lg font-semibold text-white/94">
                  Editing is unlocked.
                </div>
                <p className="mt-2 text-sm leading-relaxed text-white/64">
                  Upload and content management features are now available to you on the site.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/6 px-4 py-3 text-sm font-medium text-white/88 transition hover:bg-white/10 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                Logout
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="mono text-[10px] tracking-[0.16em] text-white/46 uppercase">
                  Admin login
                </div>
                <div className="mt-2 text-lg font-semibold text-white/94">
                  Unlock admin editing
                </div>
                <p className="mt-2 text-sm leading-relaxed text-white/64">
                  Only the admin account can upload or remove media from the website.
                </p>
              </div>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-white/84">Username</span>
                <input
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  className="w-full rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/28 focus:border-white/26"
                  placeholder="Admin username"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-white/84">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full rounded-2xl border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/28 focus:border-white/26"
                  placeholder="Admin password"
                />
              </label>

              {error ? (
                <div className="rounded-xl border border-rose-300/18 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                  {error}
                </div>
              ) : null}

              <button
                type="button"
                onClick={handleLogin}
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:opacity-92 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <KeyRound className="h-4 w-4" />
                )}
                Unlock admin
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
