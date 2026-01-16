// components/LoginPrompt.tsx
import React from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers } from "react-icons/fa";
import { IoSparkles, IoChatbubblesSharp } from "react-icons/io5";
import { MdPushPin } from "react-icons/md";
import { signIn } from "../../services/auth";
import Link from "next/link";
import Image from "next/image";

const LoginPrompt: React.FC = () => {
  return (
    <div
      className="
      flex flex-col justify-center items-center min-h-screen
      bg-gradient-to-br from-orange-50 via-pink-50 to-amber-50 
      p-5 font-sans relative overflow-hidden
      before:content-[''] before:absolute before:top-1/4 before:left-1/4 before:w-64 before:h-64 
      before:bg-[radial-gradient(circle,rgba(251,146,60,0.2)_0%,transparent_70%)]
      before:rounded-full before:blur-[40px] before:animate-[float_6s_ease-in-out_infinite]
      after:content-[''] after:absolute after:top-1/3 after:right-1/4 after:w-64 after:h-64
      after:bg-[radial-gradient(circle,rgba(236,72,153,0.2)_0%,transparent_70%)]
      after:rounded-full after:blur-[40px] after:animate-[float_8s_ease-in-out_infinite_2s]
    "
    >
      <div
        className="
        bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 max-w-[520px] w-full text-center 
        relative z-10 border border-orange-100/50 sm:p-6 sm:mx-4
      "
      >
        {/* ヘッダー */}
        <div className="mb-8">
          <div
            className="
            inline-flex items-center justify-center w-20 h-20 
            bg-gradient-to-br from-orange-400 to-pink-500
            rounded-2xl mb-5 shadow-lg shadow-orange-300/40 sm:w-16 sm:h-16 
            relative overflow-hidden
          "
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
            <Image
              src="/pwa-icon.png"
              alt="App Icon"
              width={64}
              height={64}
              className="relative z-10 w-12 h-12 object-contain"
            />
          </div>

          <h1 className="text-3xl font-bold mb-3 text-gray-800 leading-tight sm:text-2xl">
            地域をつなぐ
            <br />
            <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">
              コミュニティマップ
            </span>
          </h1>

          <p className="text-base text-gray-600 m-0 font-medium">
            あなたの街の今を共有しよう
          </p>
        </div>

        {/* 機能リスト */}
        <div className="flex flex-col gap-4 mb-8 sm:gap-3">
          {/* ピン投稿 */}
          <div className="flex items-start gap-4 text-left p-3 rounded-xl hover:bg-orange-50/50 transition-colors sm:gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 bg-orange-50 shadow-sm">
              <MdPushPin className="text-lg text-orange-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-800 m-0 mb-1.5">
                マップにピンを刺して投稿
              </h3>
              <p className="text-xs text-gray-500 m-0 leading-relaxed">
                気になる場所にピンを立てて、イベント告知や雑談スレッドを作成できます
              </p>
            </div>
          </div>

          {/* イベントシェア */}
          <div className="flex items-start gap-4 text-left p-3 rounded-xl hover:bg-pink-50/50 transition-colors sm:gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 bg-pink-50 shadow-sm">
              <FaCalendarAlt className="text-lg text-pink-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-800 m-0 mb-1.5">
                イベント情報をシェア
              </h3>
              <p className="text-xs text-gray-500 m-0 leading-relaxed">
                地域のお祭りやセールなど、旬な情報をリアルタイムで発信
              </p>
            </div>
          </div>

          {/* タイムライン */}
          <div className="flex items-start gap-4 text-left p-3 rounded-xl hover:bg-amber-50/50 transition-colors sm:gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 bg-yellow-50 shadow-sm">
              <IoChatbubblesSharp className="text-lg text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-800 m-0 mb-1.5">
                タイムラインで交流
              </h3>
              <p className="text-xs text-gray-500 m-0 leading-relaxed">
                各スレッドで情報交換やコミュニケーションを楽しめます
              </p>
            </div>
          </div>

          {/* 地域のつながり */}
          <div className="flex items-start gap-4 text-left p-3 rounded-xl hover:bg-orange-50/50 transition-colors sm:gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 bg-orange-50 shadow-sm">
              <FaUsers className="text-lg text-orange-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-800 m-0 mb-1.5">
                地域のつながりを育む
              </h3>
              <p className="text-xs text-gray-500 m-0 leading-relaxed">
                近所の人たちと気軽にコミュニケーション、新しい出会いも
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <form
            action={async () => {
              "use server";
              await signIn("cognito", {}, "lang=ja");
            }}
          >
            <button
              className="
              bg-gradient-to-r from-orange-400 to-pink-500 
              text-white border-0 rounded-2xl px-8 py-4 text-base font-bold 
              cursor-pointer w-full transition-all duration-300 
              shadow-lg shadow-orange-300/40 flex items-center justify-center gap-3
              hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-400/50 
              active:translate-y-0 sm:px-6 sm:py-3.5 sm:text-[15px]
            "
              type="submit"
            >
              <FaMapMarkerAlt className="text-lg" />
              <span>マップを見る・参加する</span>
            </button>
          </form>

          {/* ゲストログイン */}
          <div className="text-center">
            <Link
              href="/map"
              className="text-gray-500 hover:text-orange-500 text-sm font-medium transition-colors underline decoration-gray-300 hover:decoration-orange-500 underline-offset-4"
            >
              ログインせずに利用する（ゲストモード）
            </Link>
          </div>

          <p className="text-xs text-gray-500 m-0 mt-2 text-center">
            ログインすることで、投稿やコメントが可能になります
          </p>
        </div>
      </div>

      {/* 下部バナー */}
      <div
        className="
        inline-flex items-center gap-2 bg-white/80 backdrop-blur-md 
        rounded-full px-6 py-3 text-gray-700 text-sm mt-8 
        border border-orange-200/50 shadow-md
      "
      >
        <IoSparkles className="text-base text-amber-400 animate-pulse" />
        <span className="font-medium">
          あなたの街をもっと楽しく、もっと便利に
        </span>
      </div>
    </div>
  );
};

export default LoginPrompt;
