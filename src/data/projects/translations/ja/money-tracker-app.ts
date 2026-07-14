// src/data/projects/translations/ja/money-tracker-app.ts

export const moneyTrackerData = {
   navigation: {
      backLink: "/portfolio",
      backText: "ポートフォリオに戻る",
      projectNumber: 7,
      totalProjects: 7,
      prevProjectSlug: undefined,
      nextProjectSlug: "kinrai-d-project"
   },

   header: {
      title: "Money Tracker App",
      description: "銀行の通知メールから取引データを自動取得する個人向け家計簿アプリ。リアルタイムの残高ダッシュボード付き",
      tags: ["2026", "Personal", "Automation", "Fintech", "Full-stack"],
      githubUrl: undefined
   },

   infoBar: {
      duration: "2ヶ月（継続中）",
      status: "運用中",
      company: "個人プロジェクト",
      technologies: ["Next.js", "Prisma", "Supabase"],
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
         title: "自動化された個人家計管理システム",
         imageAlt: "Money Tracker Appのメインダッシュボード",
         about: {
            title: "プロジェクトについて",
            paragraphs: [
               "Money Tracker Appは、Next.js 16（App Router）とTypeScriptで構築された個人向けの収支管理Webアプリケーションです。最大の特徴は、手入力ではなくGmail APIを通じて銀行の通知メールから取引データを自動取得する点です。",
               "システムは最後に取得したメールのタイムスタンプを保存しており、アプリを開くたびにその時点以降のKrungthaiとKasikornbankからの新着メールを自動的に取得します（cronジョブによるスケジュール実行ではありません）。その後データを解析し、Prisma ORM経由でSupabase（PostgreSQL）データベースに保存します。保存前に一意のreference番号をチェックして重複を防止します。"
            ]
         },
         objectives: {
            title: "目的",
            content: "収支の手入力の手間を削減する • ダッシュボードでリアルタイムに家計を把握できるようにする • 将来的に対応銀行を追加しやすい構造にする"
         }
      },

      features: {
         title: "主要機能",
         items: [
            {
               title: "Gmail自動取得",
               description: "アプリを開くたびに、最後に保存したタイムスタンプ以降の新着取引メールを自動取得"
            },
            {
               title: "メール解析",
               description: "各銀行のHTML通知メールから取引データを解析"
            },
            {
               title: "重複防止",
               description: "保存前に一意のreference番号をチェックし重複登録を防止"
            },
            {
               title: "複数銀行対応",
               description: "KrungthaiとKasikornbankの通知メールに対応"
            },
            {
               title: "残高ダッシュボード",
               description: "口座ごとの残高と収支サマリーを表示"
            },
            {
               title: "取引テーブル",
               description: "収入・支出を色分けした全取引の一覧表示"
            }
         ]
      },

      gallery: {
         title: "スクリーンショット",
         items: [
            "Dashboard Overview",
            "Transaction Table",
            "Balance Summary",
            "Gmail Sync Flow"
         ]
      },

      technical: {
         title: "技術詳細",
         details: {
            "Framework": "Next.js 16 (App Router)",
            "Language": "TypeScript",
            "Database": "Supabase (PostgreSQL), Prisma 7 ORM",
            "Integration": "Gmail API (OAuth 2.0)",
            "Sync Strategy": "アプリ起動時にタイムスタンプ以降を取得（cronジョブなし）",
            "Styling": "Tailwind CSS 4",
            "Deployment": "Vercel"
         },
         challenges: {
            title: "課題",
            items: [
               {
                  title: "[追記予定]",
                  description: "このプロジェクトの課題は後日追記します"
               }
            ]
         }
      },

      results: {
         title: "結果",
         items: [
            {
               title: "日常的に運用中",
               description: "アプリを開くたびに最後のタイムスタンプ以降を自動取得し、実際の家計管理に活用されている"
            },
            {
               title: "[追記予定]",
               description: "このプロジェクトの結果は後日追記します"
            }
         ],
         futureGoals: {
            title: "将来の目標",
            items: [
               { description: "[追記予定] 将来の目標は後日追記します" }
            ]
         }
      }
   }
}
