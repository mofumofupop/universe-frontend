"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface QRScannerProps {
  onScan: (decodedText: string) => void;
  onError?: (error: string) => void;
  onCancel?: () => void;
}

export default function QRScanner({ onScan, onError, onCancel }: QRScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isStartedRef = useRef(false);

  useEffect(() => {
    const startScanning = async () => {
      if (isStartedRef.current) return;
      isStartedRef.current = true;

      try {
        // カメラの取得
        const cameras = await Html5Qrcode.getCameras();

        if (!cameras || cameras.length === 0) {
          const errorMsg = "カメラが見つかりませんでした";
          setError(errorMsg);
          onError?.(errorMsg);
          return;
        }

        // 外カメラ優先で選択
        const backCamera = cameras.find(
          (camera) =>
            camera.label.toLowerCase().includes("back") ||
            camera.label.toLowerCase().includes("rear") ||
            camera.label.toLowerCase().includes("environment") ||
            camera.label.toLowerCase().includes("外") ||
            camera.label.toLowerCase().includes("facing back")
        );
        const cameraId = backCamera?.id || cameras[0].id;

        // 画面幅に応じてqrboxサイズを調整
        const minSize = Math.min(window.innerWidth, 400);

        const scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;

        await scanner.start(
          cameraId,
          {
            fps: 10,
            qrbox: { width: minSize, height: minSize },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            onScan(decodedText);
          },
          () => {
            // スキャンエラー（通常は無視して良い）
          }
        );
      } catch (err) {
        console.error("スキャンの開始に失敗:", err);
        const errorMsg = "カメラへのアクセスに失敗しました";
        setError(errorMsg);
        onError?.(errorMsg);
      }
    };

    startScanning();

    return () => {
      // クリーンアップ
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => {
            scannerRef.current?.clear();
          })
          .catch((err) => {
            console.error("スキャナーの停止に失敗:", err);
          });
      }
    };
    // onErrorは親から渡されるため、依存配列に含めない
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 w-full mx-auto">
      <div
        id="qr-reader"
        className="w-full aspect-square max-w-xs mx-auto rounded-lg overflow-hidden border-2 border-slate-600 shadow-lg"
        style={{ maxWidth: "400px", width: "100vw" }}
      />

      {error && (
        <div className="text-red-300 text-sm text-center p-3 bg-red-900/20 rounded-lg border border-red-700">
          {error}
        </div>
      )}
      
      {onCancel && (
        <button
          onClick={onCancel}
          className="mt-4 px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
