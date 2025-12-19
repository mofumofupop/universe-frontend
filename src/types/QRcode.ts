/**
 * QRコード生成APIのレスポンス型
 */
export type QRCodeGenerationResponse = {
  success: boolean;
  message: string;
  qr: string;
};

/**
 * QRコード交換APIのレスポンス型
 */
export type QRCodeExchangeResponse = {
  success: boolean;
  message: string;
  id: string | null;
  username: string | null;
  new: {
    id: string;
    username: string;
  } | null;
};

/**
 * QRコード関連のエラーレスポンス型
 */
export type QRCodeErrorResponse = {
  success: false;
  message: string;
};

// 後方互換性のために残す
export type QRcode = {
  success: string;
  qr: string;
}; 