"use client";

import React from "react";
import Link from "next/link";
import { FiX, FiUserPlus, FiLogIn } from "react-icons/fi";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
};

export const SignUpPromptDialog: React.FC<Props> = ({
  isOpen,
  onClose,
  title = "アカウントを作成してもっと楽しもう",
  message = "サインアップすると、投稿やコメント、プロフィールのカスタマイズなど、すべての機能をご利用いただけます。",
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* 背景オーバーレイ */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] flex items-center justify-center p-4 animate-fadeIn"
      />

      {/* ダイアログコンテナ */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 pointer-events-auto animate-slideUp"
        >
          {/* 閉じるボタン */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
            aria-label="閉じる"
          >
            <FiX size={20} />
          </button>

          {/* アイコン */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <FiUserPlus size={32} className="text-white" />
            </div>
          </div>

          {/* タイトル */}
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
            {title}
          </h2>

          {/* メッセージ */}
          <p className="text-gray-600 text-center mb-8 leading-relaxed">
            {message}
          </p>

          {/* アクションボタン */}
          <div className="space-y-3">
            <Link
              href="/login-prompt"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <FiUserPlus size={20} />
              新規登録
            </Link>

            <Link
              href="/login-prompt"
              onClick={onClose}
              className="w-full flex items-center justify-center gap-2 bg-white text-gray-700 font-semibold py-3 px-6 rounded-xl border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
            >
              <FiLogIn size={20} />
              ログイン
            </Link>
          </div>

          {/* フッター */}
          <button
            onClick={onClose}
            className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            後で
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};
