# Tetra Web プロジェクト構成説明書

本ドキュメントは、プロジェクト（`tetra-web`）のTOPディレクトリ配下にあるファイルおよびフォルダの構成とそれぞれの役割について説明したものです。
なお、`.gitignore` にて除外されているファイルおよびフォルダは本説明書の主要対象外として分類しています。

---

## 📂 ディレクトリ・ファイル構造（概要）

```text
tetra-web/
├── .vscode/               # VS Code プロジェクト設定
├── docs/                  # ドキュメント関連
│   └── e2e-test/          # E2Eテストに関するドキュメント
├── e2e/                   # E2Eテストコード（Playwright）
├── playwright/            # Playwright用データ
│   └── .auth/             # 認証セッション情報
├── public/                # 静的アセット（画像、フォント、サービスワーカー等）
├── src/                   # アプリケーションソースコード
│   ├── app/               # 画面・ルーティング（Next.js App Router）
│   ├── components/        # 共通UIコンポーネント
│   ├── contexts/          # Reactコンテキスト
│   ├── features/          # 機能ごとのコンポーネント・ロジック
│   ├── hooks/             # カスタムReactフック
│   ├── lib/               # 外部ライブラリ連携の初期設定
│   ├── services/          # API・外部サービス（Cognito, Firebase）連携
│   ├── types/             # TypeScript型定義
│   └── utils/             # 共通ユーティリティ関数
├── .gitignore             # Git除外設定ファイル
├── LICENSE                # ライセンス定義ファイル
├── README.md              # プロジェクトの概要・セットアップ手順
├── amplify.yml            # AWS Amplify のビルド・デプロイ設定
├── app.html               # 画面確認・テスト用HTML
├── app-mobile.html        # モバイル画面確認・テスト用HTML
├── debug-session.json     # デバッグ用設定・セッションデータ
├── eslint.config.mjs      # ESLint（静的コード解析）設定
├── next.config.ts         # Next.js フレームワーク設定
├── package.json           # プロジェクト依存関係・実行スクリプト定義
├── package-lock.json      # 依存パッケージのロックファイル
├── playwright.config.ts   # Playwright テストランナー設定
├── postcss.config.mjs     # PostCSS (CSSプロセッサ) 設定
├── tsconfig.json          # TypeScript コンパイラ設定
└── task.md                # タスク管理・進捗状況メモ
```

---

## 📄 各フォルダ・ファイルの詳細説明

### 1. 主要フォルダ

*   **[.vscode](file:///c:/Users/mosam/Documents/work/taira/git/tetra-web/.vscode/)**
    *   VS Codeでの開発用の共有設定フォルダ。`settings.json` が配置されており、エディタの共通フォーマット設定などが含まれます。
*   **[docs](file:///c:/Users/mosam/Documents/work/taira/git/tetra-web/docs/)**
    *   仕様書や設計ガイドなど、開発用のドキュメントを格納するフォルダ。現在は `e2e-test`（テスト仕様）に関連する資料が置かれています。
*   **[e2e](file:///c:/Users/mosam/Documents/work/taira/git/tetra-web/e2e/)**
    *   Playwright を使用した E2E（エンドツーエンド）テストのコードが格納されています。`auth.setup.ts`（認証セットアップ）や `guest-mode`（ゲスト向けテスト）、`normal-mode`（通常ユーザー向けテスト）といったシナリオが用意されています。
*   **[playwright](file:///c:/Users/mosam/Documents/work/taira/git/tetra-web/playwright/)**
    *   Playwright 実行時に使用されるデータや、ログイン状態を保持する認証セッション情報（`playwright/.auth/user.json` など）が保存されるフォルダです。
*   **[public](file:///c:/Users/mosam/Documents/work/taira/git/tetra-web/public/)**
    *   ブラウザから直接アクセス可能な静的アセットを配置するフォルダ。画像（`images/`）、フォント、Firebase Messaging用のサービスワーカー（`firebase-messaging-sw.js`）などが配置されています。
*   **[src](file:///c:/Users/mosam/Documents/work/taira/git/tetra-web/src/)**
    *   アプリケーションのメインソースコード群です。
        *   `app/`: Next.js App Router に基づくページ・ルートの定義。
        *   `components/`: プロジェクト全体で再利用可能な共通 UI コンポーネント。
        *   `contexts/`: アプリケーションの広域的な状態管理を行う React Context。
        *   `features/`: 特定の機能やドメインに閉じたコンポーネントやロジック。
        *   `hooks/`: カスタム React フック。
        *   `lib/`: サードパーティ製ライブラリのラッパーや初期設定。
        *   `services/`: Cognito や Firebase、バックエンドAPIなどの外部サービスと連携するためのロジック。
        *   `types/`: TypeScript の共有型定義。
        *   `utils/`: プロジェクト共通で用いるユーティリティ（便利関数群）。
        *   `middleware.ts`: 認証状態の検証やリダイレクトを制御する Next.js のミドルウェア。

### 2. 設定ファイル・ドキュメント（ルート直下）

*   **[.gitignore](file:///c:/Users/mosam/Documents/work/taira/git/tetra-web/.gitignore)**
    *   Gitの管理対象から除外するファイルやディレクトリを指定する設定ファイルです。
*   **[LICENSE](file:///c:/Users/mosam/Documents/work/taira/git/tetra-web/LICENSE)**
    *   プロジェクトのソフトウェアライセンス（MIT等）を明記したファイル。
*   **[README.md](file:///c:/Users/mosam/Documents/work/taira/git/tetra-web/README.md)**
    *   プロジェクトの概要、環境構築手順、主要コマンドなどを記載した基本説明書。
*   **[amplify.yml](file:///c:/Users/mosam/Documents/work/taira/git/tetra-web/amplify.yml)**
    *   AWS Amplify ホスティングで自動ビルド・デプロイを行うためのビルドフェーズと設定の定義ファイル。
*   **[app.html](file:///c:/Users/mosam/Documents/work/taira/git/tetra-web/app.html) / [app-mobile.html](file:///c:/Users/mosam/Documents/work/taira/git/tetra-web/app-mobile.html)**
    *   モックの確認や外部連携確認などで使用される静的な HTML ファイル。
*   **[debug-session.json](file:///c:/Users/mosam/Documents/work/taira/git/tetra-web/debug-session.json)**
    *   デバッグツールやセッション管理のために一時的・内部的に利用されるJSONファイル。
*   **[eslint.config.mjs](file:///c:/Users/mosam/Documents/work/taira/git/tetra-web/eslint.config.mjs)**
    *   JavaScript/TypeScriptの静的コード解析ツール ESLint のルール設定ファイル。
*   **[next.config.ts](file:///c:/Users/mosam/Documents/work/taira/git/tetra-web/next.config.ts)**
    *   Next.js の動作やビルドプロセスをカスタマイズするための設定ファイル。
*   **[package.json](file:///c:/Users/mosam/Documents/work/taira/git/tetra-web/package.json) / [package-lock.json](file:///c:/Users/mosam/Documents/work/taira/git/tetra-web/package-lock.json)**
    *   プロジェクトが依存する npm パッケージの管理および実行用スクリプト（`dev`, `build`, `test:e2e` 等）を定義するファイル。
*   **[playwright.config.ts](file:///c:/Users/mosam/Documents/work/taira/git/tetra-web/playwright.config.ts)**
    *   Playwright を使用したブラウザテストの実行設定（タイムアウト、対象ブラウザ、Webサーバー起動コマンド等）を定義するファイル。
*   **[postcss.config.mjs](file:///c:/Users/mosam/Documents/work/taira/git/tetra-web/postcss.config.mjs)**
    *   CSSの変換を行う PostCSS の設定ファイル（Tailwind CSS の処理などに使用されます）。
*   **[tsconfig.json](file:///c:/Users/mosam/Documents/work/taira/git/tetra-web/tsconfig.json)**
    *   TypeScript のコンパイル設定（ターゲットバージョン、パスエイリアスの指定など）を記述するファイル。
*   **[task.md](file:///c:/Users/mosam/Documents/work/taira/git/tetra-web/task.md)**
    *   タスクの管理や進捗、TODOを整理するための開発用マークダウン。

---

## 🚫 Git除外対象（.gitignoreにより本説明書の対象外となっているもの）

以下のファイルおよびフォルダは、セキュリティ保護（機密情報の漏洩防止）や、ビルド生成物・依存ライブラリの肥大化を防ぐために Git 管理から除外（`.gitignore`）されています。

*   `node_modules/` ： npmよりインストールされた外部パッケージ群。
*   `.next/` / `out/` / `build/` ： Next.js のビルド結果やキャッシュ。
*   `.vercel/` ： Vercelホスティング用のメタデータ。
*   `.env*`（例: `.env.local`） ： APIキーやデータベース接続情報、各種資格情報などの環境変数が記載された機密ファイル。
*   `*.tsbuildinfo`（例: `tsconfig.tsbuildinfo`） ： TypeScriptのインクリメンタルビルド用の情報ファイル。
*   `next-env.d.ts` ： Next.js が自動生成する TypeScript 用の型宣言ファイル。
*   `.git/` ： Gitの管理データ（リポジトリの履歴情報等）。
