import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/src/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "利用規約 | まちっぷ",
};

const toc = [
  { id: "article-1", label: "第1条(適用)" },
  { id: "article-2", label: "第2条(アカウント登録)" },
  { id: "article-3", label: "第3条(利用料金)" },
  { id: "article-4", label: "第4条(個人情報の取り扱い)" },
  { id: "article-5", label: "第5条(投稿コンテンツの取り扱い)" },
  { id: "article-6", label: "第6条(位置情報に関する注意・禁止事項)" },
  { id: "article-7", label: "第7条(禁止事項)" },
  { id: "article-8", label: "第8条(投稿の削除・アカウントの停止)" },
  { id: "article-9", label: "第9条(退会)" },
  { id: "article-10", label: "第10条(未成年の利用)" },
  { id: "article-11", label: "第11条(サービスの変更・中断・終了)" },
  { id: "article-12", label: "第12条(免責事項)" },
  { id: "article-13", label: "第13条(規約の変更)" },
  { id: "article-14", label: "第14条(準拠法・裁判管轄)" },
  { id: "contact", label: "お問い合わせ" },
];

const TermsPage = () => {
  return (
    <LegalPage title="利用規約" established="制定日: 2026年7月20日" toc={toc}>
      <p className="text-[15px] text-gray-700 leading-[1.8]">
        この利用規約(以下「本規約」といいます)は、まちっぷ運営者(以下「運営者」といいます)が提供するローカルコミュニティサービス「まちっぷ」(以下「本サービス」といいます)の利用条件を定めるものです。ユーザーの皆さまには、本規約に同意のうえ本サービスをご利用いただきます。
      </p>

      <LegalSection id="article-1" heading="第1条(適用)">
        <p>
          本規約は、ユーザーと運営者との間の本サービスの利用に関わる一切の関係に適用されます。運営者が本サービス上で掲載する個別のルールやガイドラインは、本規約の一部を構成するものとします。
        </p>
      </LegalSection>

      <LegalSection id="article-2" heading="第2条(アカウント登録)">
        <ol className="list-decimal pl-5 flex flex-col gap-2">
          <li>
            本サービスの一部機能の利用には、アカウント登録が必要です。登録の際は、真実かつ正確な情報を提供してください。
          </li>
          <li>
            アカウントの管理責任はユーザー本人にあります。第三者への貸与・譲渡はできません。
          </li>
          <li>
            アカウント情報が第三者に不正利用されたことによる損害について、運営者は故意または重大な過失がある場合を除き責任を負いません。
          </li>
        </ol>
      </LegalSection>

      <LegalSection id="article-3" heading="第3条(利用料金)">
        <p>
          本サービスは現在、無料でご利用いただけます。将来、有料機能を導入する場合は、事前に本サービス上で告知します。
        </p>
      </LegalSection>

      <LegalSection id="article-4" heading="第4条(個人情報の取り扱い)">
        <p>
          本サービスにおける個人情報の取り扱いについては、別途定める
          <a
            href="/privacy"
            className="text-brand underline hover:text-brand-mid"
          >
            プライバシーポリシー
          </a>
          に従います。ユーザーは、本規約に同意することにより、プライバシーポリシーにも同意したものとみなします。
        </p>
      </LegalSection>

      <LegalSection id="article-5" heading="第5条(投稿コンテンツの取り扱い)">
        <ol className="list-decimal pl-5 flex flex-col gap-2">
          <li>
            ユーザーが本サービスに投稿した文章・画像等(以下「投稿コンテンツ」といいます)の著作権は、ユーザー本人に帰属します。
          </li>
          <li>
            ユーザーは運営者に対し、投稿コンテンツを、本サービスの提供・運営・改善および広報の目的に必要な範囲で、非独占的に、無償で、地域の制限なく利用(表示・複製・翻案・二次利用を含みます)することを許諾するものとします。
          </li>
          <li>
            投稿コンテンツが第三者の権利を侵害していないことについては、投稿したユーザーが責任を負うものとします。
          </li>
        </ol>
      </LegalSection>

      <LegalSection id="article-6" heading="第6条(位置情報に関する注意・禁止事項)">
        <p>
          本サービスは、地図上にピンを立てて情報を共有するサービスです。位置情報の取り扱いには特に注意が必要なため、以下の行為を禁止します。
        </p>
        <ol className="list-decimal pl-5 flex flex-col gap-2">
          <li>
            他人の自宅・勤務先・通学先など、特定の個人の所在が推測できる場所を、本人の同意なく投稿する行為
          </li>
          <li>私有地・立入禁止区域への無断立入りを助長する投稿</li>
          <li>危険な場所への訪問を誘導する投稿</li>
          <li>その他、位置情報を悪用して第三者のプライバシーや安全を脅かす行為</li>
        </ol>
        <p>
          また、ご自身の自宅など、個人の特定につながる場所の投稿にも十分ご注意ください。
        </p>
      </LegalSection>

      <LegalSection id="article-7" heading="第7条(禁止事項)">
        <p>ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
        <ol className="list-decimal pl-5 flex flex-col gap-2">
          <li>法令または公序良俗に違反する行為</li>
          <li>犯罪行為に関連する行為</li>
          <li>他のユーザーまたは第三者への誹謗中傷、脅迫、嫌がらせ</li>
          <li>他人のプライバシーを侵害する行為(無断での個人情報・住所・写真の投稿等)</li>
          <li>虚偽の情報や誤解を招く情報を意図的に発信する行為</li>
          <li>同一または類似の内容を繰り返し投稿する行為(重複投稿・スパム)</li>
          <li>第三者の著作権・商標権その他の知的財産権を侵害する行為</li>
          <li>営業、宣伝、広告、勧誘、その他営利を目的とする行為(運営者が認めたものを除く)</li>
          <li>なりすまし行為</li>
          <li>BOT等の自動化ツールを用いて本サービスを操作する行為</li>
          <li>複数のアカウントを不正に取得・利用する行為</li>
          <li>本サービスのサーバーやネットワークに過度な負荷をかける行為、不正アクセス</li>
          <li>その他、運営者が不適切と判断する行為</li>
        </ol>
      </LegalSection>

      <LegalSection id="article-8" heading="第8条(投稿の削除・アカウントの停止)">
        <ol className="list-decimal pl-5 flex flex-col gap-2">
          <li>
            運営者は、投稿コンテンツが以下のいずれかに該当すると判断した場合、事前の通知なく当該投稿を削除することができます。
            <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
              <li>虚偽の情報を含むもの</li>
              <li>重複投稿・スパムに該当するもの</li>
              <li>無許可の宣伝・広告に該当するもの</li>
              <li>誹謗中傷・プライバシー侵害に該当するもの</li>
              <li>著作権その他第三者の権利を侵害するもの</li>
              <li>第6条・第7条の禁止事項に該当するもの</li>
              <li>その他、運営者が不適切と判断したもの</li>
            </ul>
          </li>
          <li>
            運営者は、ユーザーが以下のいずれかに該当する場合、事前の通知なく、利用の一時停止またはアカウントの削除を行うことができます。
            <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
              <li>本規約に違反した場合</li>
              <li>なりすまし、BOT利用、複数アカウントによる不正が確認された場合</li>
              <li>長期間にわたり本サービスの利用がない場合</li>
              <li>その他、運営者が本サービスの利用を適当でないと判断した場合</li>
            </ul>
          </li>
          <li>
            本条に基づく措置によりユーザーに生じた損害について、運営者は責任を負いません。
          </li>
        </ol>
      </LegalSection>

      <LegalSection id="article-9" heading="第9条(退会)">
        <p>
          ユーザーは、いつでも本サービスを退会することができます。退会を希望する場合は、アプリ内の設定または本規約末尾のお問い合わせ窓口からお手続きください。退会後のデータの取り扱いについては、プライバシーポリシーに従います。なお、退会後も、法令上保存が必要な情報の取り扱い、および性質上退会後も存続すべき条項(第5条、第12条、第14条等)は、引き続き効力を有するものとします。
        </p>
      </LegalSection>

      <LegalSection id="article-10" heading="第10条(未成年の利用)">
        <p>
          未成年のユーザーは、保護者(親権者等の法定代理人)の同意を得たうえで本サービスをご利用ください。未成年のユーザーが本サービスを利用した場合、保護者の同意を得ているものとみなします。
        </p>
      </LegalSection>

      <LegalSection id="article-11" heading="第11条(サービスの変更・中断・終了)">
        <ol className="list-decimal pl-5 flex flex-col gap-2">
          <li>
            運営者は、ユーザーへの事前告知のうえ、本サービスの内容を変更・追加・終了することができます。
          </li>
          <li>
            運営者は、以下のいずれかに該当する場合、事前の告知なく本サービスの全部または一部を一時中断することがあります。
            <ul className="list-disc pl-5 mt-2 flex flex-col gap-1">
              <li>システムの保守・点検・更新を行う場合</li>
              <li>システム障害が発生した場合</li>
              <li>地震・火災・停電等の災害が発生した場合</li>
              <li>通信回線の障害が発生した場合</li>
              <li>法令への対応のために必要な場合</li>
              <li>その他、運営上やむを得ない事情がある場合</li>
            </ul>
          </li>
        </ol>
      </LegalSection>

      <LegalSection id="article-12" heading="第12条(免責事項)">
        <ol className="list-decimal pl-5 flex flex-col gap-2">
          <li>
            運営者は、投稿コンテンツおよび本サービス上の情報について、その正確性・完全性・最新性・有用性を保証しません。イベント情報等は変更される場合がありますので、必要に応じて公式の情報をご確認ください。
          </li>
          <li>
            ユーザー間またはユーザーと第三者との間で生じたトラブルについて、運営者は関与せず、責任を負いません。
          </li>
          <li>
            本サービスの利用によりユーザーに生じた損害について、運営者に故意または重大な過失がある場合を除き、責任を負いません。
          </li>
        </ol>
      </LegalSection>

      <LegalSection id="article-13" heading="第13条(規約の変更)">
        <p>
          運営者は、必要と判断した場合、本規約を変更することができます。重要な変更を行う場合は、法令に基づく場合を除き、合理的な期間を設けて本サービス上で事前に告知します。変更後に本サービスを利用した場合、変更後の規約に同意したものとみなします。
        </p>
      </LegalSection>

      <LegalSection id="article-14" heading="第14条(準拠法・裁判管轄)">
        <p>
          本規約の解釈にあたっては日本法を準拠法とします。本サービスに関して紛争が生じた場合、運営者の所在地を管轄する裁判所を専属的合意管轄とします。
        </p>
      </LegalSection>

      <LegalSection id="contact" heading="お問い合わせ">
        <p>本規約に関するお問い合わせは、下記までご連絡ください。</p>
        <ul className="list-none pl-0 flex flex-col gap-1">
          <li>サービス名: まちっぷ</li>
          <li>運営者: まちっぷ運営者</li>
          <li>メールアドレス: machip.info@gmail.com</li>
        </ul>
      </LegalSection>
    </LegalPage>
  );
};

export default TermsPage;
