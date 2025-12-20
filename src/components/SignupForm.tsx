"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/Logo";
import { register, uploadIcon } from "@/lib/api";

interface SignupFormProps {
  onSwitchToLogin?: () => void;
}

export function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const router = useRouter();
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [socialLinks, setSocialLinks] = useState<string[]>(["", "", "", "", ""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSocialLinkChange = (index: number, value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index] = value;
    setSocialLinks(newLinks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Username validation: only lowercase letters, numbers and underscore
      const usernameRE = /^[a-z0-9_]+$/;
      if (!usernameRE.test(username)) {
        throw new Error("Username may only contain lowercase letters, numbers, and underscore (_).");
      }

      // パスワードをSHA-256でハッシュ化
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const passwordHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      const filteredSocialLinks = socialLinks.filter(link => link.trim() !== "");
      
      if (filteredSocialLinks.length === 0) {
        throw new Error("少なくとも1つのSocial Linkを入力してください");
      }

      // ユーザー登録
      const registerResult = await register(
        username,
        passwordHash,
        name || undefined,
        affiliation || undefined,
        filteredSocialLinks
      );

      // アイコンがある場合はアップロード
      if (iconFile && registerResult.id) {
        try {
          await uploadIcon(registerResult.id, passwordHash, iconFile);
        } catch (iconErr) {
          console.error("Icon upload failed:", iconErr);
          // アイコンアップロード失敗は登録自体は成功しているので警告のみ
          // エラーは表示するが、登録は成功として扱う
        }
      }

      // 成功したらsparkleページへリダイレクト
      router.push("/sparkle");
    } catch (err) {
      console.error("Signup error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("登録に失敗しました");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-[90vw] sm:w-full sm:max-w-md bg-slate-50 border-none shadow-lg font-inter">
      <CardHeader className="space-y-1.5 pt-4 pb-2">
        {/* Logo */}
        <div className="flex justify-end mb-0 -mr-4">
          <Logo className="h-12 w-auto text-slate-400 opacity-40" />
        </div>
        
        <CardTitle className="text-xl font-semibold text-slate-900">
          Create your account
        </CardTitle>
        <CardDescription className="text-sm text-slate-600">
          Enter your information below to get started
        </CardDescription>
        <p className="text-xs text-slate-500">
          Already have an account?{" "}
          <button 
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onSwitchToLogin?.();
            }}
            className="text-slate-700 hover:underline"
          >
            Log in <span className="text-slate-400">here</span>
          </button>
        </p>
      </CardHeader>
      
      <CardContent className="px-6 pb-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Icon Upload Area */}
          <div className="flex justify-center my-3">
            <label htmlFor="icon-upload" className="cursor-pointer">
              <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border-2 border-slate-300 hover:border-slate-400 transition-colors">
                {iconPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={iconPreview} alt="Icon preview" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                )}
              </div>
              <input
                id="icon-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleIconChange}
              />
            </label>
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <Label htmlFor="username" className="text-sm font-medium text-slate-900">
              Username<span className="text-red-500">*</span>
            </Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-white border-slate-300 focus:border-slate-500"
              pattern="[a-z0-9_]+"
              title="Only lowercase letters (a-z), numbers (0-9), and underscore (_) are allowed"
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              Enter your @username. Allowed: lowercase letters (a-z), numbers (0-9), underscore (_).
            </p>
          </div>

          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-medium text-slate-900">
              Name<span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white border-slate-300 focus:border-slate-500"
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              Enter your nickname
            </p>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="password" className="text-sm font-medium text-slate-900">
              Password<span className="text-red-500">*</span>
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white border-slate-300 focus:border-slate-500"
              required
            />
            <p className="text-xs text-slate-500 mt-1">
              Passwords can include uppercase and lowercase letters, NUMBERS, and symbols ( A,a,1,! )
            </p>
          </div>

          {/* Affiliation */}
          <div className="space-y-1.5">
            <Label htmlFor="affiliation" className="text-sm font-medium text-slate-900">
              Affiliation
            </Label>
            <Input
              id="affiliation"
              type="text"
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
              className="bg-white border-slate-300 focus:border-slate-500"
            />
            <p className="text-xs text-slate-500 mt-1">
              Enter your affiliation and position
            </p>
          </div>

          {/* Social Links */}
          {[1, 2, 3, 4, 5].map((num) => (
            <div key={num} className="space-y-1.5">
              <Label htmlFor={`social-link-${num}`} className="text-sm font-medium text-slate-900">
                Social Links{num}{num === 1 && <span className="text-red-500">*</span>}
              </Label>
              <Input
                id={`social-link-${num}`}
                type="text"
                value={socialLinks[num - 1]}
                onChange={(e) => handleSocialLinkChange(num - 1, e.target.value)}
                className="bg-white border-slate-300 focus:border-slate-500"
                required={num === 1}
              />
              <p className="text-xs text-slate-500 mt-1">
                Enter your social account links (X,Instagram...)
              </p>
            </div>
          ))}

          {/* Submit Button */}
          <div className="flex justify-end mt-4 pt-2">
            <Button 
              type="submit" 
              className="bg-slate-900 hover:bg-slate-800 text-white px-8"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing up..." : "Sign up"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
