"use client";

import { useState } from "react";
import { FiCheckCircle, FiSmartphone } from "react-icons/fi";

type Step = "input" | "code" | "verified";

type Props = {
  onVerified?: () => void;
};

/**
 * 電話番号のSMS認証ウィジェット。
 * 番号入力→SMSコード送信→コード検証の3ステップ。
 */
export const PhoneVerification: React.FC<Props> = ({ onVerified }) => {
  const [step, setStep] = useState<Step>("input");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendCode = async () => {
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/user/phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "送信に失敗しました");
      setStep("code");
    } catch (err) {
      setError(err instanceof Error ? err.message : "送信に失敗しました");
    } finally {
      setSending(false);
    }
  };

  const verifyCode = async () => {
    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/user/phone", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "検証に失敗しました");
      setStep("verified");
      onVerified?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "検証に失敗しました");
    } finally {
      setSending(false);
    }
  };

  if (step === "verified") {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg">
        <FiCheckCircle className="text-green-600 flex-shrink-0" />
        <p className="text-sm text-green-800 font-medium">
          電話番号を認証しました({phoneNumber})
        </p>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <div className="flex items-center gap-2 mb-1">
        <FiSmartphone className="text-gray-500" />
        <p className="text-sm font-medium text-gray-800">電話番号認証(SMS)</p>
      </div>
      <p className="text-xs text-gray-500 mb-3 leading-5">
        安心してご利用いただくため、SMSで電話番号を確認します。番号が公開されることはありません。
      </p>

      {error && (
        <p className="text-xs text-red-600 mb-2 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </p>
      )}

      {step === "input" ? (
        <div className="flex gap-2">
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="090-1234-5678"
            className="flex-1 min-w-0 px-4 py-3 text-sm leading-6 text-gray-800 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/15 placeholder:text-gray-400"
          />
          <button
            type="button"
            onClick={sendCode}
            disabled={sending || !phoneNumber.trim()}
            className={`flex-shrink-0 px-4 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors ${
              sending || !phoneNumber.trim()
                ? "opacity-60 cursor-not-allowed"
                : ""
            }`}
          >
            {sending ? "送信中..." : "コード送信"}
          </button>
        </div>
      ) : (
        <div>
          <p className="text-xs text-gray-600 mb-2">
            {phoneNumber} 宛に届いた認証コードを入力してください
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              inputMode="numeric"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              className="flex-1 min-w-0 px-4 py-3 text-sm leading-6 tracking-widest text-gray-800 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/15 placeholder:text-gray-400"
            />
            <button
              type="button"
              onClick={verifyCode}
              disabled={sending || !code.trim()}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors ${
                sending || !code.trim() ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {sending ? "確認中..." : "確認"}
            </button>
          </div>
          <button
            type="button"
            onClick={() => {
              setStep("input");
              setCode("");
              setError(null);
            }}
            className="mt-2 text-xs text-indigo-600 underline"
          >
            番号を入力し直す / コードを再送信する
          </button>
        </div>
      )}
    </div>
  );
};
