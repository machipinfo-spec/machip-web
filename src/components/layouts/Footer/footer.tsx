import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer
      className="
        bg-gradient-to-br from-orange-100 via-pink-100 to-amber-100
        pt-14 pb-10 mt-20 relative overflow-hidden
      "
    >
      {/* 光のエフェクト */}
      <div
        className="
          absolute top-10 left-10 w-52 h-52 rounded-full 
          bg-[radial-gradient(circle,rgba(251,146,60,0.22)_0%,transparent_70%)]
          blur-2xl
        "
      />
      <div
        className="
          absolute bottom-10 right-10 w-60 h-60 rounded-full 
          bg-[radial-gradient(circle,rgba(236,72,153,0.22)_0%,transparent_70%)]
          blur-2xl
        "
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10 font-sans">
        {/* メインセクション */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* サービス紹介 */}
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              コミュニティマップ
            </h3>
            <p className="text-sm text-gray-600 leading-6">
              街の出来事を共有するローカルコミュニティプラットフォーム。
              ピンを立てて会話し、地域のつながりを広げましょう。
            </p>
          </div>

          {/* クイックリンク */}
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              クイックリンク
            </h3>
            <ul className="flex flex-col gap-2 list-none p-0 m-0">
              <li>
                <Link
                  href="/about"
                  className="
                    text-sm text-gray-600 hover:text-orange-500 
                    transition-colors no-underline
                  "
                >
                  私たちについて
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="
                    text-sm text-gray-600 hover:text-orange-500 
                    transition-colors no-underline
                  "
                >
                  料金プラン
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="
                    text-sm text-gray-600 hover:text-orange-500 
                    transition-colors no-underline
                  "
                >
                  機能紹介
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="
                    text-sm text-gray-600 hover:text-orange-500 
                    transition-colors no-underline
                  "
                >
                  ブログ
                </Link>
              </li>
            </ul>
          </div>

          {/* サポート */}
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              サポート
            </h3>
            <ul className="flex flex-col gap-2 list-none p-0 m-0">
              <li>
                <Link
                  href="/faq"
                  className="
                    text-sm text-gray-600 hover:text-pink-500 
                    transition-colors no-underline
                  "
                >
                  よくある質問
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="
                    text-sm text-gray-600 hover:text-pink-500 
                    transition-colors no-underline
                  "
                >
                  お問い合わせ
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="
                    text-sm text-gray-600 hover:text-pink-500 
                    transition-colors no-underline
                  "
                >
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="
                    text-sm text-gray-600 hover:text-pink-500 
                    transition-colors no-underline
                  "
                >
                  利用規約
                </Link>
              </li>
            </ul>
          </div>

          {/* SNS */}
          <div className="flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              ソーシャル
            </h3>

            <div className="flex gap-4 mb-4">
              <FooterIcon color="orange" aria="Instagram">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </FooterIcon>

              <FooterIcon color="pink" aria="Twitter">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </FooterIcon>

              <FooterIcon color="amber" aria="Facebook">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </FooterIcon>
            </div>

            <p className="text-sm text-gray-600 leading-6">
              最新のお知らせをチェックしましょう！
            </p>
          </div>
        </div>

        {/* ボトム */}
        <div
          className="
            border-t border-orange-200/50 mt-10 pt-6 
            flex flex-col items-center gap-2
            md:flex-row md:justify-between
          "
        >
          <p className="text-sm text-gray-500 m-0">
            © {new Date().getFullYear()} Community Map. All rights reserved.
          </p>

          <p className="text-sm text-gray-500 flex items-center gap-1 m-0">
            Made with
            <span className="text-pink-500">❤</span>
            in Japan
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

/* 補助コンポーネント：SNSアイコン（色テーマ対応） */
const FooterIcon = ({
  children,
  color,
  aria,
}: {
  children: React.ReactNode;
  color: "orange" | "pink" | "amber";
  aria: string;
}) => {
  const colorClass =
    color === "orange"
      ? "hover:text-orange-500"
      : color === "pink"
      ? "hover:text-pink-500"
      : "hover:text-amber-500";

  return (
    <a
      href="#"
      aria-label={aria}
      className={`text-gray-600 transition-colors ${colorClass}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {children}
      </svg>
    </a>
  );
};
