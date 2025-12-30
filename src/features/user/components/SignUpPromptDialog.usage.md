# SignUpPromptDialog 使用例

## 基本的な使い方

```tsx
"use client";

import { SignUpPromptDialog } from "@/src/features/user/components";
import { useSignUpPrompt } from "@/src/features/user/hooks/useSignUpPrompt";

export default function MyComponent() {
  const { isOpen, openDialog, closeDialog } = useSignUpPrompt();

  return (
    <>
      <button onClick={openDialog}>
        サインアップを促す
      </button>

      <SignUpPromptDialog
        isOpen={isOpen}
        onClose={closeDialog}
      />
    </>
  );
}
```

## カスタムメッセージ

```tsx
<SignUpPromptDialog
  isOpen={isOpen}
  onClose={closeDialog}
  title="この機能を使うにはアカウントが必要です"
  message="投稿するにはアカウント登録が必要です。無料で簡単に始められます。"
/>
```

## ゲストユーザーの操作時に表示

```tsx
"use client";

import { useLoginMode, LoginMode } from "@/src/features/user/hooks/useLoginMode";
import { SignUpPromptDialog } from "@/src/features/user/components";
import { useSignUpPrompt } from "@/src/features/user/hooks/useSignUpPrompt";

export default function PostButton() {
  const { getLoginMode } = useLoginMode();
  const { isOpen, openDialog, closeDialog } = useSignUpPrompt();

  const handleClick = async () => {
    const mode = await getLoginMode();
    
    if (mode === LoginMode.GUEST) {
      // ゲストユーザーの場合はダイアログを表示
      openDialog();
    } else {
      // ログインユーザーの場合は投稿処理
      handlePost();
    }
  };

  const handlePost = () => {
    // 投稿処理
  };

  return (
    <>
      <button onClick={handleClick}>
        投稿する
      </button>

      <SignUpPromptDialog
        isOpen={isOpen}
        onClose={closeDialog}
        title="投稿するにはアカウントが必要です"
        message="アカウントを作成すると、投稿やコメントができるようになります。"
      />
    </>
  );
}
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `isOpen` | `boolean` | ✅ | - | ダイアログの表示状態 |
| `onClose` | `() => void` | ✅ | - | ダイアログを閉じる関数 |
| `title` | `string` | ❌ | "アカウントを作成してもっと楽しもう" | ダイアログのタイトル |
| `message` | `string` | ❌ | デフォルトメッセージ | ダイアログの説明文 |

## 特徴

- 🎨 モダンなグラデーションデザイン
- ✨ スムーズなアニメーション（フェードイン・スライドアップ）
- 📱 レスポンシブ対応
- ♿ アクセシビリティ対応（aria-label）
- 🎯 明確なCTA（新規登録・ログイン）
- 🔒 背景クリックで閉じる
- ⌨️ ESCキーで閉じる（今後実装可能）
