/**
 * API関連のユーティリティ関数
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

/**
 * レスポンスの基本型
 */
interface ApiResponse {
  success: boolean;
  message: string;
}

/**
 * QRコード交換APIのレスポンス型
 */
export interface ExchangeResponse extends ApiResponse {
  id: string | null;
  username: string | null;
  new: {
    id: string;
    username: string;
  } | null;
}

/**
 * QRコードを使って名刺交換を行う
 * @param userId ユーザーのUUID
 * @param passwordHash SHA-256でハッシュ化されたパスワード
 * @param qrCode QRコードから読み取った文字列
 * @returns API レスポンス
 */
export async function exchangeBusinessCard(
  userId: string,
  passwordHash: string,
  qrCode: string
): Promise<ExchangeResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/exchange`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userId,
        password_hash: passwordHash,
        qr: qrCode,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API呼び出しに失敗しました");
    }

    return data;
  } catch (error) {
    console.error("Exchange API Error:", error);
    throw error;
  }
}

/**
 * QRコードを生成する（将来的な実装用）
 * @param userId ユーザーのUUID
 * @param passwordHash SHA-256でハッシュ化されたパスワード
 * @returns QRコード文字列
 */
export async function generateQRCode(
  userId: string,
  passwordHash: string
): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/qr`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: userId,
        password_hash: passwordHash,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "QRコード生成に失敗しました");
    }

    return data.qr;
  } catch (error) {
    console.error("QR Generation API Error:", error);
    throw error;
  }
}

/**
 * ローカルストレージからユーザー認証情報を取得
 */
export function getAuthFromStorage(): {
  userId: string | null;
  passwordHash: string | null;
} {
  if (typeof window === "undefined") {
    return { userId: null, passwordHash: null };
  }

  const userId = localStorage.getItem("userId");
  const passwordHash = localStorage.getItem("passwordHash");

  return { userId, passwordHash };
}

/**
 * ローカルストレージにユーザー認証情報を保存
 */
export function saveAuthToStorage(userId: string, passwordHash: string): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem("userId", userId);
  localStorage.setItem("passwordHash", passwordHash);
}

/**
 * ローカルストレージから認証情報を削除
 */
export function clearAuthFromStorage(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("userId");
  localStorage.removeItem("passwordHash");
}
