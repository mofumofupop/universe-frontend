"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Logo = ({ className }: { className?: string }) => (
  <svg className={`${className} fill-current`} viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg">
    <g>
      <path d="M539.02,687.82l22.18,46.06h.29l22.46-46.06h22.46l-35.14,60.79h-20.59l-34.85-60.79h23.18Z"/>
      <path d="M798.51,687.82v10.75h-54.86v12.79h50.4v10.75h-50.4v15.75h57.31v10.75h-78.48v-60.79h76.03Z"/>
      <path d="M974.33,687.82c19.87,0,31.39,8.04,31.39,17.19,0,6.69-5.62,12.45-15.98,14.48l3.46,1.02c8.78,2.54,9.65,8.64,9.65,13.72v5.67c0,2.03.14,6.44,4.61,7.11v1.61h-23.9c-1.15-1.95-2.16-5.59-2.16-8.64l-.14-6.6c-.14-8.21-8.21-8.55-16.99-8.55h-22.18v23.79h-21.17v-60.79h53.42ZM967.99,714.58c10.37,0,16.13-2.12,16.13-8.3,0-4.83-5.76-7.96-14.54-7.96h-27.5v16.26h25.92Z"/>
      <path d="M1182.84,705.86c-1.01-6.69-9.5-9.14-21.17-9.14-10.51,0-18,2.79-18,7.28,0,2.88,1.44,5.08,12.24,6.6l24.33,3.47c21.02,2.96,26.64,8.64,26.64,16.26,0,13.55-18.29,19.9-40.9,19.9-26.64,0-43.34-6.44-44.06-20.32h20.74c.29,6.18,8.06,9.82,21.89,9.82s21.6-2.54,21.6-7.87c0-5-7.2-6.18-35.86-9.91-18.86-2.46-26.78-7.71-26.78-17.02,0-10.58,12.82-18.71,39.74-18.71,24.19,0,39.74,7.79,40.32,19.64h-20.74Z"/>
      <path d="M1401.71,687.82v10.75h-54.86v12.79h50.4v10.75h-50.4v15.75h57.31v10.75h-78.48v-60.79h76.03Z"/>
    </g>
    <g>
      <path d="M1186.19,483.3l-165.21,165.21c-3.77,3.77-8.89,5.89-14.22,5.89h-91.99c-3.55,0-5.32-4.29-2.82-6.8l154.31-154.31c2.51-2.51.73-6.8-2.82-6.8h-24.03c-5.33,0-10.45,2.12-14.22,5.89l-156.12,156.12c-3.77,3.77-8.89,5.89-14.22,5.89h-93.28c-5.33,0-10.45-2.12-14.22-5.89l-98.16-98.16c-3.77-3.77-8.89-5.89-14.22-5.89h-31.77c-5.33,0-10.45-2.12-14.22-5.89l-165.21-165.21c-2.51-2.51-.73-6.8,2.82-6.8h415.9c.31,0,.62-.03.92-.1,22.31-4.99,31.26-15.55,35.37-40.18.74-4.45,7.11-4.46,7.85-.01,4.46,26.75,14.63,36.91,41.4,41.36,4.44.74,4.44,7.11,0,7.85-26.77,4.45-36.94,14.61-41.4,41.36-.74,4.45-7.11,4.44-7.85-.01-4.11-24.63-13.07-35.19-35.37-40.18-.3-.07-.61-.1-.92-.1h-295.97c-3.55,0-5.32,4.29-2.82,6.8l155.22,155.22c3.77,3.77,8.89,5.89,14.22,5.89h31.77c5.33,0,10.45,2.12,14.22,5.89l34.86,34.86c7.85,7.85,20.58,7.85,28.44,0l102.82-102.82c3.77-3.77,8.89-5.89,14.22-5.89h243.91c3.55,0,5.32,4.29,2.82,6.8Z"/>
      <path d="M1496.22,373.4l-165.16,165.16c-3.78,3.78-8.9,5.9-14.23,5.9h-31.76c-5.34,0-10.46,2.12-14.23,5.9l-98.14,98.14c-3.78,3.78-8.9,5.9-14.23,5.9h-91.93c-3.57,0-5.35-4.31-2.83-6.84l97.2-97.2c3.78-3.78,8.9-5.9,14.23-5.9h31.76c5.34,0,10.46-2.12,14.23-5.9l155.17-155.17c2.52-2.52.74-6.84-2.83-6.84h-118.02c-.31,0-.62.03-.92.1-22.26,4.98-31.23,15.51-35.35,40.04-.75,4.47-7.15,4.48-7.9.01-4.46-26.6-14.62-36.75-41.24-41.2-4.46-.75-4.46-7.15,0-7.89,26.62-4.46,36.78-14.6,41.24-41.2.75-4.47,7.15-4.46,7.9.01,4.12,24.53,13.08,35.06,35.35,40.04.3.07.61.1.92.1h237.95c3.57,0,5.35,4.31,2.83,6.84Z"/>
    </g>
  </svg>
);

interface LoginFormProps {
  onSwitchToSignup?: () => void;
}

export function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ログイン処理は今は実装しない
    console.log("Login attempt:", { username, password });
  };

  return (
    <Card className="w-[90vw] sm:w-full sm:max-w-md bg-slate-50 border-none shadow-lg font-inter">
      <CardHeader className="space-y-1.5 pt-2 pb-2">
        {/* Logo */}
        <div className="flex justify-end mb-0 -mr-4">
          <Logo className="h-20 w-auto text-slate-400 opacity-40" />
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
            >
              Log in
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
