import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/src/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "プライバシーポリシー | まちっぷ",
};

const PrivacyPage = () => {
  return (
    <LegalPage title="プライバシーポリシー" established="制定日: 2026年7月20日">
      <p className="text-sm text-gray-700 leading-7">
        まちっぷ運営者(以下「運営者」といいます)は、ローカルコミュニティサービス「まちっぷ」(以下「本サービス」といいます)における利用者の個人情報の取り扱いについて、以下のとおりプライバシーポリシー(以下「本ポリシー」といいます)を定めます。
      </p>

      <LegalSection heading="1. 取得する情報">
        <p>本サービスでは、以下の情報を取得します。</p>
        <ul className="list-disc pl-5 flex flex-col gap-2">
          <li>
            <span className="font-bold">アカウント情報</span>:
            メールアドレス、パスワード等の認証情報(認証基盤上で安全に管理されます)
          </li>
          <li>
            <span className="font-bold">プロフィール情報</span>:
            ニックネーム、プロフィール画像、自己紹介文、URL等、ユーザーが任意で登録した情報
          </li>
          <li>
            <span className="font-bold">投稿情報</span>:
            投稿した文章・画像、および地図上に立てたピンの位置情報
          </li>
          <li>
            <span className="font-bold">利用状況に関する情報</span>:
            プッシュ通知の配信に必要な端末情報、Cookie等によるログイン状態の管理情報
          </li>
        </ul>
        <p>
          ※
          地図上のピンの位置は、ユーザーが自ら選んで投稿するものです。端末の現在地情報を利用する場合は、端末の設定に基づき、ユーザーの許可を得たうえで地図表示のために利用します。
        </p>
      </LegalSection>

      <LegalSection heading="2. 利用目的">
        <p>取得した情報は、以下の目的で利用します。</p>
        <ol className="list-decimal pl-5 flex flex-col gap-2">
          <li>本サービスの提供・運営・本人確認のため</li>
          <li>投稿やプロフィールを他のユーザーに表示するため</li>
          <li>プッシュ通知等によるお知らせの配信のため</li>
          <li>不正利用の防止、利用規約違反への対応のため</li>
          <li>本サービスの改善、新機能の開発のため</li>
          <li>お問い合わせへの対応のため</li>
        </ol>
      </LegalSection>

      <LegalSection heading="3. 外部サービスの利用">
        <p>
          本サービスは、サービス提供のために以下の外部サービスを利用しており、これらのサービスに必要な範囲で情報が送信されます。
        </p>
        <ul className="list-disc pl-5 flex flex-col gap-2">
          <li>
            Amazon Web Services(認証・データの保管・配信基盤)
          </li>
          <li>Google マップ(地図の表示)</li>
          <li>Firebase(プッシュ通知の配信等)</li>
        </ul>
      </LegalSection>

      <LegalSection heading="4. 第三者への提供">
        <p>
          運営者は、以下の場合を除き、本人の同意なく個人情報を第三者に提供しません。
        </p>
        <ol className="list-decimal pl-5 flex flex-col gap-2">
          <li>法令に基づく場合</li>
          <li>人の生命、身体または財産の保護のために必要で、本人の同意を得ることが困難な場合</li>
          <li>国の機関等への協力が必要で、本人の同意により支障を及ぼすおそれがある場合</li>
        </ol>
      </LegalSection>

      <LegalSection heading="5. 安全管理">
        <p>
          運営者は、取得した情報の漏えい・滅失・毀損を防ぐため、アクセス制御や通信の暗号化等、必要かつ適切な安全管理措置を講じます。
        </p>
      </LegalSection>

      <LegalSection heading="6. 開示・訂正・削除の請求">
        <p>
          ユーザーは、運営者が保有する自己の個人情報について、開示・訂正・利用停止・削除を求めることができます。ご希望の場合は、下記のお問い合わせ先までご連絡ください。本人確認のうえ、法令に従い速やかに対応します。
        </p>
      </LegalSection>

      <LegalSection heading="7. 未成年の利用について">
        <p>
          未成年のユーザーは、保護者の同意を得たうえで本サービスをご利用ください。
        </p>
      </LegalSection>

      <LegalSection heading="8. 本ポリシーの変更">
        <p>
          本ポリシーの内容は、法令の改正やサービス内容の変更に応じて改定することがあります。重要な変更を行う場合は、本サービス上で告知します。
        </p>
      </LegalSection>

      <LegalSection heading="9. お問い合わせ">
        <p>
          個人情報の取り扱いに関するお問い合わせは、machip.info@gmail.com までご連絡ください。
        </p>
      </LegalSection>
    </LegalPage>
  );
};

export default PrivacyPage;
