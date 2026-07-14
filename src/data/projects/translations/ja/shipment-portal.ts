// src/data/projects/translations/ja/shipment-portal.ts

export const shipmentPortalData = {
   navigation: {
      backLink: "/portfolio",
      backText: "ポートフォリオに戻る",
      projectNumber: 9,
      totalProjects: 9,
      prevProjectSlug: undefined,
      nextProjectSlug: "master-data-service"
   },

   header: {
      title: "Shipment Portal",
      description: "FastShipのスタッフ向け社内ポータル。荷物一覧の俯瞰から個々の配送詳細まで追跡・管理できる",
      tags: ["2026", "Web", "Enterprise", "Internal Tool"],
      githubUrl: undefined
   },

   infoBar: {
      duration: "1ヶ月以上（継続中）",
      status: "運用中",
      company: "FastShip",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS"],
      labels: {
         duration: "開発期間",
         status: "ステータス",
         company: "会社",
         technology: "主要技術"
      }
   },

   tabsContent: {
      tabs: {
         overview: "概要",
         features: "機能",
         gallery: "スクリーンショット",
         technical: "技術詳細",
         results: "結果"
      },

      overview: {
         title: "荷物追跡・管理のためのスタッフ向けポータル",
         imageAlt: "Shipment Portalの荷物一覧画面",
         about: {
            title: "プロジェクトについて",
            paragraphs: [
               "Shipment PortalはFastShipの社内向けWebアプリケーションで、Next.js（App Router）とTypeScriptで構築されています。スタッフが荷物のステータス確認、個々の配送詳細の閲覧、集荷（pickup）依頼の管理を1か所で行えるようにします。",
               "一覧や詳細ページのようにデータ量の多いページはサーバーサイドレンダリングで高速に表示します。ポータル自体はデータベースを持たず、主に会社の中央バックエンドサービスを通じてデータを取得しますが、移行中の一部の追跡検索のみ、まだ従来のデータベースに直接問い合わせています。"
            ]
         },
         objectives: {
            title: "目的",
            content: "複数システムを行き来する代わりに、荷物の追跡・管理を1つのツールで完結できるようにする • 配送に関する情報を1つのページに集約し、検索の手間を減らす • 残っているレガシー依存を段階的に移行できる構造にする"
         }
      },

      features: {
         title: "主要機能",
         items: [
            {
               title: "フィルター付き荷物一覧",
               description: "全ての荷物を一覧表示し、ステータスで絞り込み、検索、ブックマークが可能"
            },
            {
               title: "荷物詳細ビュー",
               description: "送り主、受け取り人、通関、インボイス、追跡ステータスを1ページに集約"
            },
            {
               title: "集荷（Pickup）管理",
               description: "荷物一覧とは別に、集荷依頼とその進捗を専用ビューで確認"
            },
            {
               title: "代理店パフォーマンスダッシュボード",
               description: "代理店ごとの配送パフォーマンスを読みやすい形式で要約"
            },
            {
               title: "例外ビュー",
               description: "問題や異常ステータスのある荷物を抽出し、素早く確認できるようにする"
            },
            {
               title: "ロールベース認証",
               description: "スタッフ向けログインで、権限に応じてアクセス範囲を制御"
            }
         ]
      },

      gallery: {
         title: "スクリーンショット",
         items: [
            "Shipment List Overview",
            "Shipment Detail Page",
            "Pickup Detail View",
            "Agent Performance Dashboard"
         ]
      },

      technical: {
         title: "技術詳細",
         details: {
            "Framework": "Next.js 15 (App Router)",
            "Language": "TypeScript",
            "Styling": "Tailwind CSS v4（デザイントークンシステム）",
            "Authentication": "セッションベース（ロールごとの権限制御）",
            "Error Tracking": "Sentry",
            "Rendering": "データ量の多いページはサーバーサイドレンダリング"
         },
         challenges: {
            title: "課題",
            items: [
               {
                  title: "段階的な移行",
                  description: "一部のデータがレガシーソースに残り、他は新しいバックエンドサービスへ移行済みという状態でも、アプリを問題なく動作させる必要があった"
               },
               {
                  title: "[追記予定]",
                  description: "このプロジェクトの他の課題は後日追記します"
               }
            ]
         }
      },

      results: {
         title: "結果",
         items: [
            {
               title: "荷物追跡の一元化",
               description: "スタッフが荷物の情報を確認するために複数システムを行き来する必要がなくなった"
            },
            {
               title: "[追記予定]",
               description: "このプロジェクトの結果は後日追記します"
            }
         ],
         futureGoals: {
            title: "将来の目標",
            items: [
               { description: "残っているレガシー依存を完全に移行する" },
               { description: "[追記予定] 将来の目標は後日追記します" }
            ]
         }
      }
   }
}
