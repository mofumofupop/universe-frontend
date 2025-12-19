"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import QRScanner from "@/components/QRScanner";
import { Button } from "@/components/ui/button";
import { exchangeBusinessCard, getAuthFromStorage, type ExchangeResponse } from "@/lib/api";
import Header from "@/components/Header";
import FlipAnimation from "@/components/Card/FlipAnimation";
import { User } from "@/types/User";

export default function ScannerPage() {
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exchangeResult, setExchangeResult] = useState<ExchangeResponse | null>(null);
  const [showScanner, setShowScanner] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [exchangedUser, setExchangedUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const { userId, passwordHash } = getAuthFromStorage();
    setIsLoggedIn(!!(userId && passwordHash));
  }, []);

  const handleScan = async (decodedText: string) => {
    setScannedData(decodedText);
    setIsProcessing(true);
    setError(null);
    setExchangeResult(null);

    try {
      // ローカルストレージからユーザー情報を取得
      const { userId, passwordHash } = getAuthFromStorage();

      if (!userId || !passwordHash) {
        setError("ログインが必要です");
        // ログインページへリダイレクト
        router.push("/login");
        return;
      }

      // API呼び出し
      const data = await exchangeBusinessCard(userId, passwordHash, decodedText);

      if (data.success && data.new) {
        // 成功時の処理：結果を保存して表示
        setExchangeResult(data);
        setShowScanner(false);
        
        // 相手のユーザー情報を取得（API呼び出しが必要な場合）
        // ここではダミーデータを作成
        const user: User = {
          id: data.new.id,
          username: data.new.username,
          name: data.new.username,
          affiliation: "Exchange Partner",
          icon_url: "",
          social_links: [],
        };
        setExchangedUser(user);
      } else {
        // エラーハンドリング
        setError(data.message || "名刺交換に失敗しました");
      }
    } catch (err) {
      console.error("API呼び出しエラー:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("通信エラーが発生しました");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setScannedData(null);
    setError(null);
    setExchangeResult(null);
    setShowScanner(true);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const handleCancel = () => {
    const { userId, passwordHash } = getAuthFromStorage();
    
    if (userId && passwordHash) {
      router.push("/sparkle");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header className="text-white" />
      <div className="container mx-auto max-w-4xl pt-24 pb-8 px-4">

        {showScanner && !exchangeResult && (
          <div className="mb-6">
            <QRScanner onScan={handleScan} onError={handleError} onCancel={handleCancel} />

            {isProcessing && (
              <div className="mt-6 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <p className="mt-2 text-gray-300">Processing...</p>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>
        )}

        {exchangeResult && exchangeResult.new && exchangedUser && (
          <div className="mb-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-center text-green-400 mb-2">
                ✓ Exchange Successful!
              </h2>
              <p className="text-center text-gray-300">{exchangeResult.message}</p>
            </div>

            {/* 相手の名刺を表示 */}
            <div className="flex justify-center items-center">
              <FlipAnimation user={exchangedUser} />
            </div>

            <div className="mt-6 flex gap-4 justify-center">
              <Button
                onClick={handleReset}
                className="px-6 py-2 bg-white text-black hover:bg-gray-100"
              >
                Scan Again
              </Button>
              <Button
                onClick={() => router.push(isLoggedIn ? "/sparkle" : "/")}
                className="px-6 py-2 bg-slate-600 text-white hover:bg-slate-500"
              >
                Back to Home
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
