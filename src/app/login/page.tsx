/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { login } from "@/lib/api";
import type { LoginCredentials } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const credentials: LoginCredentials = {
        username,
        password,
        expiresInMins: 30,
      };

      const response = await login(credentials);

      // Store tokens in localStorage
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("user", JSON.stringify(response));

      // Dispatch custom event to notify navbar of auth change
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth-change"));
      }

      toast.success("Login successful!");
      router.push("/");
      router.refresh();
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-linear-to-b from-sky-50 to-white px-4 py-12 dark:from-sky-950/20 dark:to-background">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 -top-1/4 h-96 w-96 rounded-full bg-sky-200/30 blur-3xl dark:bg-sky-900/20" />
        <div className="absolute -right-1/4 -bottom-1/4 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl dark:bg-blue-900/20" />
        {/* Subtle arcing lines pattern */}
        <svg
          className="absolute inset-0 h-full w-full opacity-20 dark:opacity-10"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,200 Q400,100 800,200 T1600,200"
            stroke="#0ea5e9"
            strokeWidth="1"
            fill="none"
            className="dark:text-sky-400"
          />
          <path
            d="M0,400 Q400,300 800,400 T1600,400"
            stroke="#3b82f6"
            strokeWidth="1"
            fill="none"
            className="dark:text-blue-400"
          />
          <path
            d="M0,600 Q400,500 800,600 T1600,600"
            stroke="#7dd3fc"
            strokeWidth="1"
            fill="none"
            className="dark:text-sky-300"
          />
        </svg>
      </div>

      <Card className="relative z-10 w-full max-w-md border-0 bg-linear-to-b from-sky-50/80 via-white/90 to-white shadow-2xl backdrop-blur-sm dark:from-sky-950/30 dark:via-gray-900/90 dark:to-gray-900">
        <CardHeader className="space-y-4 text-center">
          {/* Icon */}
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-md bg-gray-100/80 dark:bg-gray-800/80">
            <div className="flex items-center gap-0.5 text-gray-700 dark:text-gray-300">
              <ArrowRight className="h-4 w-4" />
              <span className="text-base font-bold">]</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Sign in
          </CardTitle>
          <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
            Make a new doc to bring your words, data, and teams together. For free
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Test credentials message */}
          <div className="rounded-lg bg-blue-50/80 border border-blue-200/50 px-4 py-3 text-sm text-blue-800 dark:bg-blue-950/30 dark:border-blue-800/50 dark:text-blue-300">
            <p className="font-medium">Using test credentials</p>
            <p className="text-xs mt-1 opacity-90">Username: emilys | Password: emilyspass</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username Field */}
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-12 rounded-lg border-gray-200 bg-gray-50 pl-11 pr-4 text-base dark:border-gray-700 dark:bg-gray-800/50"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 rounded-lg border-gray-200 bg-gray-50 pl-11 pr-11 text-base dark:border-gray-700 dark:bg-gray-800/50"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="h-12 w-full rounded-lg bg-gray-900 text-base font-medium text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Get Started"}
            </Button>
          </form>

          {/* Separator */}
          <div className="relative flex items-center py-4">
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
            <span className="px-4 text-sm text-gray-500 dark:text-gray-400">Or sign in with</span>
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-3 gap-3">
            {/* Google */}
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-lg border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
              onClick={() => toast.info("Google sign-in coming soon")}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            </Button>

            {/* Facebook */}
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-lg border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
              onClick={() => toast.info("Facebook sign-in coming soon")}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </Button>

            {/* Apple */}
            <Button
              type="button"
              variant="outline"
              className="h-12 rounded-lg border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
              onClick={() => toast.info("Apple sign-in coming soon")}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
