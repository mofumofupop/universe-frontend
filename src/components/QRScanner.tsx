"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface QRScannerProps {
  onScan: (decodedText: string) => void;
  onError?: (error: string) => void;
}

export default function QRScanner({ onScan, onError }: QRScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user' | 'auto'>('environment');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isStartedRef = useRef(false);

  // ユーザーが指定した facingMode に基づいてデバイスID を取得できるか試す
  const getDeviceIdForFacingMode = async (mode: 'environment' | 'user') => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return null;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: mode } as any },
      } as any);
      const track = stream.getVideoTracks()[0];
      const settings = track.getSettings() as MediaTrackSettings & { deviceId?: string };
      const deviceId = settings.deviceId || null;
      track.stop();
      return deviceId;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const startScanning = async () => {
      // Stop existing scanner if any
      if (scannerRef.current) {
        try {
          await scannerRef.current.stop();
          scannerRef.current.clear();
        } catch (e) {
          // ignore
        }
        scannerRef.current = null;
        isStartedRef.current = false;
      }

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

        // ユーザー選択に基づきカメラを選択
        let selectedCameraId: string | null = null;

        if (facingMode === 'auto') {
          const backCamera = cameras.find((camera) =>
            camera.label.toLowerCase().includes('back') ||
            camera.label.toLowerCase().includes('rear') ||
            camera.label.toLowerCase().includes('environment') ||
            camera.label.toLowerCase().includes('外') ||
            camera.label.toLowerCase().includes('facing back')
          );
          selectedCameraId = backCamera?.id || cameras[0].id;
        } else {
          // Try to find labeled camera matching mode
          const candidate = cameras.find((camera) =>
            camera.label.toLowerCase().includes(facingMode === 'environment' ? 'back' : 'front') ||
            camera.label.toLowerCase().includes(facingMode === 'environment' ? 'rear' : 'front') ||
            camera.label.toLowerCase().includes(facingMode === 'environment' ? 'environment' : 'user')
          );

          if (candidate) {
            selectedCameraId = candidate.id;
          } else {
            // Try getUserMedia with facingMode to find deviceId
            const deviceId = await getDeviceIdForFacingMode(facingMode);
            if (deviceId) selectedCameraId = deviceId;
            else selectedCameraId = cameras[0].id;
          }
        }

        // コンテナ幅から余白を考慮したqrboxサイズを算出
        const container = document.getElementById('qr-reader');
        const containerWidth = container ? Math.min(container.clientWidth, window.innerWidth) : window.innerWidth;
        const horizontalPadding = 32; // 画面端との余白
        const maxBox = 400;
        const boxSize = Math.max(160, Math.min(maxBox, containerWidth - horizontalPadding));

        const scanner = new Html5Qrcode('qr-reader');
        scannerRef.current = scanner;

        if (!mounted) return;

        await scanner.start(
          selectedCameraId!,
          {
            fps: 10,
            qrbox: { width: boxSize, height: boxSize },
            aspectRatio: 1.0,
            // Optional: prefer front/back via facingMode in constraints is handled above
          },
          (decodedText) => {
            onScan(decodedText);
          },
          () => {
            // スキャンエラー（通常は無視して良い）
          }
        );
        setError(null);
      } catch (err) {
        console.error('スキャンの開始に失敗:', err);
        const errorMsg = 'カメラへのアクセスに失敗しました';
        setError(errorMsg);
        onError?.(errorMsg);
      }
    };

    startScanning();

    // restart when facingMode changes
    return () => {
      mounted = false;
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => {
            scannerRef.current?.clear();
            scannerRef.current = null;
            isStartedRef.current = false;
          })
          .catch((err) => {
            console.error('スキャナーの停止に失敗:', err);
          });
      }
    };
    // onErrorは親から渡されるため、依存配列に含めない
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  return (
    <div className="flex flex-col items-center gap-4 w-full mx-auto">
      <div className="flex gap-2 items-center justify-center mt-2">
        <button
          className={`px-3 py-1 rounded ${facingMode === 'environment' ? 'bg-white text-gray-900' : 'bg-transparent text-gray-300'}`}
          onClick={() => setFacingMode('environment')}
          aria-pressed={facingMode === 'environment'}
        >
          Back
        </button>
        <button
          className={`px-3 py-1 rounded ${facingMode === 'auto' ? 'bg-white text-gray-900' : 'bg-transparent text-gray-300'}`}
          onClick={() => setFacingMode('auto')}
          aria-pressed={facingMode === 'auto'}
        >
          Auto
        </button>
        <button
          className={`px-3 py-1 rounded ${facingMode === 'user' ? 'bg-white text-gray-900' : 'bg-transparent text-gray-300'}`}
          onClick={() => setFacingMode('user')}
          aria-pressed={facingMode === 'user'}
        >
          Front
        </button>
      </div>

      <div
        id="qr-reader"
        className="w-full rounded-lg overflow-hidden border-2 border-slate-600 shadow-lg"
        style={{ maxWidth: "min(400px, calc(100vw - 32px))", width: "min(400px, calc(100vw - 32px))" }}
      />

      {error && (
        <div className="text-red-300 text-sm text-center p-3 bg-red-900/20 rounded-lg border border-red-700">
          {error}
        </div>
      )}

    </div>
  );
}
