"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface QRScannerProps {
  onScan: (decodedText: string) => void;
  onError?: (error: string) => void;
}

export default function QRScanner({ onScan, onError }: QRScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isStartedRef = useRef(false);

  // Helper: try to get a deviceId using facingMode='environment'
  const getEnvironmentDeviceId = async (): Promise<string | null> => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return null;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } } });
      const track = stream.getVideoTracks()[0];
      const settings = track.getSettings() as MediaTrackSettings & { deviceId?: string };
      const deviceId = settings.deviceId || null;
      // stop to avoid keeping camera open
      track.stop();
      return deviceId;
    } catch (e) {
      return null;
    }
  };

  const startScannerWithCamera = async (cameraId: string | null) => {
    try {
      const minSize = Math.min(window.innerWidth - 32, 400); // leave 16px padding on each side

      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        cameraId ?? undefined,
        {
          fps: 10,
          qrbox: { width: minSize, height: minSize },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          onScan(decodedText);
        },
        () => {
          // ignore minor scan errors
        }
      );
    } catch (err) {
      console.error("スキャンの開始に失敗:", err);
      const errorMsg = "カメラへのアクセスに失敗しました";
      setError(errorMsg);
      onError?.(errorMsg);
    }
  };

  useEffect(() => {
    const startScanning = async () => {
      if (isStartedRef.current) return;
      isStartedRef.current = true;

      try {
        // カメラ取得
        const cams = await Html5Qrcode.getCameras();
        setCameras(cams || []);

        if (!cams || cams.length === 0) {
          const errorMsg = "カメラが見つかりませんでした";
          setError(errorMsg);
          onError?.(errorMsg);
          return;
        }

        // Try facingMode approach to prefer back camera
        const envDeviceId = await getEnvironmentDeviceId();
        let chosenId: string | null = null;
        if (envDeviceId) {
          const match = cams.find((c) => c.id === envDeviceId);
          if (match) chosenId = match.id;
        }

        // Fallback: find by label
        if (!chosenId) {
          const backCamera = cams.find((camera) =>
            camera.label.toLowerCase().includes("back") ||
            camera.label.toLowerCase().includes("rear") ||
            camera.label.toLowerCase().includes("environment") ||
            camera.label.toLowerCase().includes("外") ||
            camera.label.toLowerCase().includes("facing back")
          );
          chosenId = backCamera?.id || cams[0].id;
        }

        setSelectedCameraId(chosenId || cams[0].id);
        await startScannerWithCamera(chosenId || cams[0].id);
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
  }, []);

  // allow user to switch cameras
  const onSelectCamera = async (id: string) => {
    // stop current
    if (scannerRef.current) {
      await scannerRef.current.stop().catch(() => {});
      await scannerRef.current.clear().catch(() => {});
    }

    // if id === 'environment', try to resolve deviceId dynamically
    let deviceIdToUse = id;
    if (id === 'environment') {
      const env = await getEnvironmentDeviceId();
      if (env) deviceIdToUse = env;
    }

    setSelectedCameraId(deviceIdToUse);
    await startScannerWithCamera(deviceIdToUse ?? undefined);
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full mx-auto px-4">
      {/* Camera selector (visible when multiple cameras detected) */}
      {cameras && cameras.length > 1 && (
        <div className="w-full max-w-md mx-auto flex justify-center mb-2 gap-2">
          <select
            value={selectedCameraId ?? ''}
            onChange={(e) => onSelectCamera(e.target.value)}
            className="bg-slate-800 text-white px-3 py-2 rounded"
          >
            <option value="">Auto</option>
            <option value="environment">Back camera (preferred)</option>
            {cameras.map((c) => (
              <option key={c.id} value={c.id}>{c.label || c.id}</option>
            ))}
          </select>
        </div>
      )}

      <div
        id="qr-reader"
        className="w-full aspect-square max-w-[400px] mx-auto rounded-lg overflow-hidden border-2 border-slate-600 shadow-lg"
        style={{ width: '100%' }}
      />

      {error && (
        <div className="text-red-300 text-sm text-center p-3 bg-red-900/20 rounded-lg border border-red-700">
          {error}
        </div>
      )}

    </div>
  );
}
