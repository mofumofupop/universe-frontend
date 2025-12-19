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
 * Friend情報の型
 */
export interface Friend {
  id: string;
  username: string;
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
 * アカウント情報のレスポンス型
 */
export interface AccountResponse extends ApiResponse {
  id: string;
  username: string;
  name: string;
  icon_url: string | null;
  friends: Friend[];
  friends_friends: Record<string, string[]>;
}

/**
 * ユーザー情報のレスポンス型
 */
export interface UserResponse extends ApiResponse {
  id: string;
  username: string;
  name: string;
  affiliation: string | null;
  icon_url: string | null;
  social_links: string[];
  friends?: Friend[];
}

/**
 * 登録APIのレスポンス型
 */
export interface RegisterResponse extends ApiResponse {
  id: string;
  username: string;
}

/**
 * ログインAPIのレスポンス型
 */
export interface LoginResponse extends ApiResponse {
  id: string;
  username: string;
}

/**
 * アイコンアップロードAPIのレスポンス型
 */
export interface IconUploadResponse extends ApiResponse {
  icon_url: string;
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
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        `バックエンドサーバーに接続できません。${API_BASE_URL} が起動しているか確認してください。`
      );
    }
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
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        `バックエンドサーバーに接続できません。${API_BASE_URL} が起動しているか確認してください。`
      );
    }
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

/**
 * ユーザー登録
 * @param username ユーザー名
 * @param passwordHash SHA-256でハッシュ化されたパスワード
 * @param name 名前（オプション）
 * @param affiliation 所属（オプション）
 * @param socialLinks SNSリンク（1〜5個）
 * @returns 登録されたユーザー情報
 */
export async function register(
  username: string,
  passwordHash: string,
  name?: string,
  affiliation?: string,
  socialLinks?: string[]
): Promise<RegisterResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password_hash: passwordHash,
        name,
        affiliation,
        social_links: socialLinks || [],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "登録に失敗しました");
    }

    // 登録成功時にローカルストレージに保存
    saveAuthToStorage(data.id, passwordHash);

    return data;
  } catch (error) {
    console.error("Register API Error:", error);
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        `バックエンドサーバーに接続できません。${API_BASE_URL} が起動しているか確認してください。`
      );
    }
    throw error;
  }
}

/**
 * ログイン
 * @param username ユーザー名
 * @param passwordHash SHA-256でハッシュ化されたパスワード
 * @returns ログインしたユーザー情報
 */
export async function login(
  username: string,
  passwordHash: string
): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password_hash: passwordHash,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "ログインに失敗しました");
    }

    // ログイン成功時にローカルストレージに保存
    saveAuthToStorage(data.id, passwordHash);

    return data;
  } catch (error) {
    console.error("Login API Error:", error);
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        `バックエンドサーバーに接続できません。${API_BASE_URL} が起動しているか確認してください。`
      );
    }
    throw error;
  }
}

/**
 * 自分のアカウント情報を取得
 * @param userId ユーザーのUUID
 * @param passwordHash SHA-256でハッシュ化されたパスワード
 * @returns アカウント情報
 */
export async function getAccount(
  userId: string,
  passwordHash: string
): Promise<AccountResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/account`, {
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
      throw new Error(data.message || "アカウント情報の取得に失敗しました");
    }

    return data;
  } catch (error) {
    console.error("Account API Error:", error);
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        `バックエンドサーバーに接続できません。${API_BASE_URL} が起動しているか確認してください。`
      );
    }
    throw error;
  }
}

/**
 * 他人のユーザー情報を取得
 * @param targetUserId 対象ユーザーのUUID
 * @param userId 自分のUUID（オプション、認証用）
 * @param passwordHash 自分のパスワードハッシュ（オプション、認証用）
 * @returns ユーザー情報
 */
export async function getUser(
  targetUserId: string,
  userId?: string,
  passwordHash?: string
): Promise<UserResponse> {
  try {
    const params = new URLSearchParams({ target: targetUserId });
    if (userId && passwordHash) {
      params.append("id", userId);
      params.append("password_hash", passwordHash);
    }

    const response = await fetch(`${API_BASE_URL}/api/user?${params}`, {
      method: "GET",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "ユーザー情報の取得に失敗しました");
    }

    return data;
  } catch (error) {
    console.error("User API Error:", error);
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        `バックエンドサーバーに接続できません。${API_BASE_URL} が起動しているか確認してください。`
      );
    }
    throw error;
  }
}

/**
 * アイコン画像をアップロード
 * @param userId ユーザーのUUID
 * @param passwordHash SHA-256でハッシュ化されたパスワード
 * @param iconFile アイコン画像ファイル
 * @returns アップロードされたアイコンのURL
 */
export async function uploadIcon(
  userId: string,
  passwordHash: string,
  iconFile: File
): Promise<IconUploadResponse> {
  try {
    const formData = new FormData();
    formData.append("id", userId);
    formData.append("password_hash", passwordHash);
    formData.append("icon", iconFile);

    const response = await fetch(`${API_BASE_URL}/api/icon`, {
      method: "POST",
      body: formData,
      // Content-Typeは自動設定されるため指定不要
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "アイコンのアップロードに失敗しました");
    }

    return data;
  } catch (error) {
    console.error("Icon Upload API Error:", error);
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error(
        `バックエンドサーバーに接続できません。${API_BASE_URL} が起動しているか確認してください。`
      );
    }
    throw error;
  }
}