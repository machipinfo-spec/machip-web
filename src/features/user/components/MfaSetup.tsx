"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { FiCheckCircle, FiShield } from "react-icons/fi";

type Setup = {
  secret: string;
  otpauthUrl: string;
};

/**
 * 認証アプリ(TOTP)によるMFA設定カード。
 * QRコードを認証アプリで読み取り→6桁コードを検証→有効化。
 */
export const MfaSetup: React.FC = () => {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [setup, setSetup] = useState<Setup | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/user/mfa")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setEnabled(data?.totpEnabled ?? false))
      .catch(() => setEnabled(false));
  }, []);

  const startSetup = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/user/mfa", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "開始に失敗しました");
      setSetup(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "開始に失敗しました");
    } finally {
      setBusy(false);
    }
  };

  const confirm = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/user/mfa", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "検証に失敗しました");
      setEnabled(true);
      setSetup(null);
      setCode("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "検証に失敗しました");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white mt-2 px-4 py-4">
      <div className="flex items-center gap-2 mb-1">
        <FiShield className="text-gray-500" />
        <p className="text-xs font-black text-gray-400">セキュリティ</p>
      </div>

      {enabled === null ? (
        <div className="py-3">
          <div className="animate-pulse h-10 bg-gray-100 rounded-xl" />
        </div>
      ) : enabled ? (
        <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
          <FiCheckCircle className="text-green-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-green-800">
              2段階認証(認証アプリ)が有効です
            </p>
            <p className="text-xs text-green-700 mt-0.5">
              ログイン時に認証アプリのコードが必要になります
            </p>
          </div>
        </div>
      ) : setup ? (
        <div className="bg-gray-50 rounded-xl px-4 py-4">
          <p className="text-sm font-bold mb-2">認証アプリを設定</p>
          <ol className="text-xs text-gray-600 leading-5 list-decimal list-inside mb-3">
            <li>Google Authenticator等の認証アプリでQRコードを読み取る</li>
            <li>アプリに表示された6桁のコードを入力する</li>
          </ol>
          <div className="bg-white p-3 rounded-lg border border-gray-200 w-fit mx-auto mb-3">
            <QRCode value={setup.otpauthUrl} size={140} />
          </div>
          <p className="text-[10px] text-gray-400 break-all mb-3 text-center">
            手動入力用キー: {setup.secret}
          </p>
          {error && (
            <p className="text-xs text-red-600 mb-2 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </p>
          )}
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              className="flex-1 min-w-0 px-4 py-2.5 text-sm tracking-widest bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
            />
            <button
              onClick={confirm}
              disabled={busy || code.length !== 6}
              className={`flex-shrink-0 px-4 py-2.5 text-sm font-bold text-white bg-gray-900 rounded-lg ${
                busy || code.length !== 6 ? "opacity-50" : ""
              }`}
            >
              {busy ? "確認中..." : "有効化"}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-xs text-gray-500 leading-5 mb-3">
            認証アプリを使った2段階認証で、アカウントの乗っ取りを防止できます。
          </p>
          {error && (
            <p className="text-xs text-red-600 mb-2 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </p>
          )}
          <button
            onClick={startSetup}
            disabled={busy}
            className={`w-full h-11 border border-gray-900 text-gray-900 rounded-xl text-sm font-bold ${
              busy ? "opacity-50" : ""
            }`}
          >
            {busy ? "準備中..." : "2段階認証を設定する"}
          </button>
        </div>
      )}
    </div>
  );
};
