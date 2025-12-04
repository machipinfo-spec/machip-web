// components/LoginPrompt.tsx (地域コミュニティマップ版)
import React from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers } from "react-icons/fa";
import { IoSparkles, IoChatbubblesSharp } from "react-icons/io5";
import { MdPushPin } from "react-icons/md";
import { signIn } from "../../services/auth";

// テーマ設定（別ファイルに切り出し可能）
const theme = {
  colors: {
    primary: {
      from: "from-orange-400",
      to: "to-pink-500",
      light: "orange-50",
      main: "orange-500",
    },
    secondary: {
      from: "from-amber-400",
      to: "to-orange-500",
      light: "pink-50",
      main: "pink-500",
    },
    accent: {
      light: "yellow-50",
      main: "amber-400",
    },
    background: {
      gradient: "from-orange-50 via-pink-50 to-amber-50",
      card: "white/95",
    },
    text: {
      primary: "gray-800",
      secondary: "gray-600",
      tertiary: "gray-500",
    }
  }
};

const LoginPrompt: React.FC = () => {
  return (
    <div className={`flex flex-col justify-center items-center min-h-screen bg-gradient-to-br ${theme.colors.background.gradient} p-5 font-[Inter,Hiragino_Sans,sans-serif] relative overflow-hidden before:content-[''] before:absolute before:top-1/4 before:left-1/4 before:w-64 before:h-64 before:bg-[radial-gradient(circle,rgba(251,146,60,0.2)_0%,transparent_70%)] before:rounded-full before:blur-[40px] before:animate-[float_6s_ease-in-out_infinite] after:content-[''] after:absolute after:top-1/3 after:right-1/4 after:w-64 after:h-64 after:bg-[radial-gradient(circle,rgba(236,72,153,0.2)_0%,transparent_70%)] after:rounded-full after:blur-[40px] after:animate-[float_8s_ease-in-out_infinite_2s]`}>
      <div className={`bg-${theme.colors.background.card} backdrop-blur-xl rounded-3xl shadow-2xl p-10 max-w-[520px] w-full text-center relative z-10 border border-orange-100/50 sm:p-6 sm:mx-4`}>
        {/* ヘッダーアイコン */}
        <div className="mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${theme.colors.primary.from} ${theme.colors.primary.to} rounded-2xl mb-5 shadow-lg shadow-orange-300/40 sm:w-16 sm:h-16 relative overflow-hidden`}>
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
            <FaMapMarkerAlt className="text-3xl text-white relative z-10 sm:text-2xl" />
            <MdPushPin className="text-lg text-white/80 absolute top-2 right-2 rotate-45" />
          </div>
          <h1 className={`text-3xl font-bold mb-3 text-${theme.colors.text.primary} leading-tight sm:text-2xl`}>
            地域をつなぐ
            <br />
            <span className={`bg-gradient-to-r ${theme.colors.primary.from} ${theme.colors.primary.to} bg-clip-text text-transparent`}>
              コミュニティマップ
            </span>
          </h1>
          <p className={`text-base text-${theme.colors.text.secondary} m-0 font-medium`}>
            あなたの街の今を共有しよう
          </p>
        </div>

        {/* 機能紹介 */}
        <div className="flex flex-col gap-4 mb-8 sm:gap-3">
          <div className="flex items-start gap-4 text-left p-3 rounded-xl hover:bg-orange-50/50 transition-colors sm:gap-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 bg-${theme.colors.primary.light} shadow-sm`}>
              <MdPushPin className={`text-lg text-${theme.colors.primary.main}`} />
            </div>
            <div className="flex-1">
              <h3 className={`text-sm font-bold text-${theme.colors.text.primary} m-0 mb-1.5`}>
                マップにピンを刺して投稿
              </h3>
              <p className={`text-xs text-${theme.colors.text.tertiary} m-0 leading-relaxed`}>
                気になる場所にピンを立てて、イベント告知や雑談スレッドを作成できます
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 text-left p-3 rounded-xl hover:bg-pink-50/50 transition-colors sm:gap-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 bg-${theme.colors.secondary.light} shadow-sm`}>
              <FaCalendarAlt className={`text-lg text-${theme.colors.secondary.main}`} />
            </div>
            <div className="flex-1">
              <h3 className={`text-sm font-bold text-${theme.colors.text.primary} m-0 mb-1.5`}>
                イベント情報をシェア
              </h3>
              <p className={`text-xs text-${theme.colors.text.tertiary} m-0 leading-relaxed`}>
                地域のお祭りやセールなど、旬な情報をリアルタイムで発信
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 text-left p-3 rounded-xl hover:bg-amber-50/50 transition-colors sm:gap-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 bg-${theme.colors.accent.light} shadow-sm`}>
              <IoChatbubblesSharp className={`text-lg text-${theme.colors.accent.main}`} />
            </div>
            <div className="flex-1">
              <h3 className={`text-sm font-bold text-${theme.colors.text.primary} m-0 mb-1.5`}>
                タイムラインで交流
              </h3>
              <p className={`text-xs text-${theme.colors.text.tertiary} m-0 leading-relaxed`}>
                各スレッドで情報交換やコミュニケーションを楽しめます
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 text-left p-3 rounded-xl hover:bg-orange-50/50 transition-colors sm:gap-3">
            <div className={`flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 bg-${theme.colors.primary.light} shadow-sm`}>
              <FaUsers className={`text-lg text-${theme.colors.primary.main}`} />
            </div>
            <div className="flex-1">
              <h3 className={`text-sm font-bold text-${theme.colors.text.primary} m-0 mb-1.5`}>
                地域のつながりを育む
              </h3>
              <p className={`text-xs text-${theme.colors.text.tertiary} m-0 leading-relaxed`}>
                近所の人たちと気軽にコミュニケーション、新しい出会いも
              </p>
            </div>
          </div>
        </div>

        {/* ログインボタン */}
        <div className="flex flex-col gap-4">
          <form
            action={async () => {
              "use server";
              await signIn("cognito", {}, "lang=ja");
            }}
          >
            <button
              className={`bg-gradient-to-r ${theme.colors.primary.from} ${theme.colors.primary.to} text-white border-0 rounded-2xl px-8 py-4 text-base font-bold cursor-pointer w-full transition-all duration-300 shadow-lg shadow-orange-300/40 flex items-center justify-center gap-3 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-400/50 active:translate-y-0 sm:px-6 sm:py-3.5 sm:text-[15px]`}
              type="submit"
            >
              <FaMapMarkerAlt className="text-lg" />
              <span>マップを見る・参加する</span>
            </button>
          </form>

          <p className={`text-xs text-${theme.colors.text.tertiary} m-0 mt-2`}>
            ログインすることで、投稿やコメントが可能になります
          </p>
        </div>
      </div>

      {/* 底部の説明 */}
      <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md rounded-full px-6 py-3 text-gray-700 text-sm mt-8 border border-orange-200/50 shadow-md">
        <IoSparkles className={`text-base text-${theme.colors.accent.main} animate-pulse`} />
        <span className="font-medium">あなたの街をもっと楽しく、もっと便利に</span>
      </div>
    </div>
  );
};

export default LoginPrompt;