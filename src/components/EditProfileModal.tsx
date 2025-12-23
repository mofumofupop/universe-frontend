"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { getAuthFromStorage, getUser, updateProfile, uploadIcon } from "@/lib/api";

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditProfileModal({ open, onOpenChange }: EditProfileModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [socialLinks, setSocialLinks] = useState<string[]>(["", "", "", "", ""]);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const load = async () => {
      setError(null);
      const { userId, passwordHash } = getAuthFromStorage();
      if (!userId || !passwordHash) {
        setError("ログイン情報が見つかりません");
        return;
      }

      try {
        setIsLoading(true);
        const user = await getUser(userId, userId, passwordHash);
        setName(user.name || "");
        setAffiliation(user.affiliation || "");
        const links = Array.isArray(user.social_links) ? user.social_links : [];
        const filled = [...links].slice(0, 5);
        while (filled.length < 5) filled.push("");
        setSocialLinks(filled);
        setIconPreview(user.icon_url || null);
      } catch (err) {
        console.error(err);
        setError("ユーザー情報の取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [open]);

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIconFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setIconPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSocialLinkChange = (index: number, value: string) => {
    const newLinks = [...socialLinks];
    newLinks[index] = value;
    setSocialLinks(newLinks);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError(null);
    const { userId, passwordHash } = getAuthFromStorage();
    if (!userId || !passwordHash) {
      setError("ログイン情報が見つかりません");
      return;
    }

    const filteredSocialLinks = socialLinks.filter((s) => s.trim() !== "");
    if (filteredSocialLinks.length === 0) {
      setError("少なくとも1つのSocial Linkを入力してください");
      return;
    }

    try {
      setIsLoading(true);
      await updateProfile(userId, passwordHash, {
        name: name || null,
        affiliation: affiliation || null,
        social_links: filteredSocialLinks,
      });

      if (iconFile) {
        try {
          await uploadIcon(userId, passwordHash, iconFile);
        } catch (iconErr) {
          console.warn("Icon upload failed:", iconErr);
          // 続行しても問題ないので警告のみ
        }
      }

      // Notify other parts of the app that profile changed
      try {
        window.dispatchEvent(new Event("auth:changed"));
      } catch {
        // ignore
      }

      onOpenChange(false);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) setError(err.message);
      else setError("更新に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ユーザー情報を編集</DialogTitle>
          <DialogDescription>プロフィール情報を編集します（usernameの変更はできません）</DialogDescription>
        </DialogHeader>

        <Card className="bg-transparent border-none shadow-none">
          <CardContent>
            {error && <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">{error}</div>}

            {/* Icon upload */}
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
                <input id="icon-upload" type="file" accept="image/*" className="hidden" onChange={handleIconChange} />
              </label>
            </div>

            {/* Name */}
            <div className="space-y-1.5 mb-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            {/* Affiliation */}
            <div className="space-y-1.5 mb-2">
              <Label htmlFor="affiliation">Affiliation</Label>
              <Input id="affiliation" value={affiliation} onChange={(e) => setAffiliation(e.target.value)} />
            </div>

            {/* Social Links */}
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-1.5 mb-2">
                <Label htmlFor={`social-${i}`}>Social Link{ i === 0 ? <span className="text-red-500">*</span> : null }</Label>
                <Input id={`social-${i}`} value={socialLinks[i] || ""} onChange={(e) => handleSocialLinkChange(i, e.target.value)} required={i === 0} />
              </div>
            ))}

            <div className="flex justify-end mt-4 gap-2">
              <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={isLoading}>{isLoading ? "Updating..." : "Save"}</Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
