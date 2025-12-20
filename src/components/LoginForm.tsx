"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/Logo";
import { login } from "@/lib/api";

interface LoginFormProps {
  onSwitchToSignup?: () => void;
}

export function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // パスワードをSHA-256でハッシュ化
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // ログイン
      await login(username, passwordHash);

      // 成功したらsparkleページへリダイレクト
      router.push("/sparkle");
    } catch (err) {
      console.error("Login error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("ログインに失敗しました");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-[90vw] sm:w-full sm:max-w-md bg-slate-50 border-none shadow-lg font-inter">
      <CardHeader className="space-y-1.5 pt-2 pb-2">
        {/* Logo */}
        <div className="flex justify-end mb-0 -mr-4">
          <Logo className="h-12 w-auto text-slate-400 opacity-40" />
        </div>
        
        <CardTitle className="text-xl font-semibold text-slate-900">
          Login to your account
        </CardTitle>
        <CardDescription className="text-sm text-slate-600">
          Enter your ID below to login to your account
        </CardDescription>
        <p className="text-xs text-slate-500">
          Don&apos;t have an account yet?{" "}
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onSwitchToSignup?.();
            }}
            className="text-slate-700 hover:underline"
          >
            Create account <span className="text-slate-400">here</span>
          </button>
        </p>
      </CardHeader>
      
      <CardContent className="px-4 pb-4">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-sm font-medium text-slate-900">
              Username
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white border-slate-300 focus:border-slate-500"
              required
            />
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-medium text-slate-900">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white border-slate-300 focus:border-slate-500"
              required
            />
          </div>
          
          <div className="flex justify-end mt-4">
            <Button 
              type="submit" 
              className="bg-slate-900 hover:bg-slate-800 text-white px-8"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
